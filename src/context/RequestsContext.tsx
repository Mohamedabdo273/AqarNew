import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { EMPTY_SELL_FORM, SellForm } from '../lib/sellForm';
import { useAuth } from './AuthContext';
import {
  DOC_TYPE,
  DocType,
  SellRequestDocument,
  SellRequestDto,
  createSellRequest,
  deleteSellPhoto,
  fetchMySellRequests,
  getSellRequest,
  updateSellRequest,
  uploadSellDocument,
  uploadSellPhoto,
} from '../services/api';

/** Where a seller request stands. Mirrors the tracker shown to the seller. */
export type RequestStage = 'received' | 'reviewing' | 'listed' | 'matched' | 'transferred';
export const REQUEST_STAGES: RequestStage[] = ['received', 'reviewing', 'listed', 'matched', 'transferred'];

export interface SellRequest {
  code: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  stage: RequestStage;
  /** The API's own stage name — can also be 'closed' (withdrawn / rejected). */
  apiStage: string;
  canEdit: boolean;
  /** Set when the team sent the request back asking for more. */
  needsInfoReason: string | null;
  documents: SellRequestDocument[];
  /** Listing photo URLs (/media/...), in order — the first is the cover. */
  photos: string[];
  form: SellForm;
}

/** Files picked in the sell form, uploaded right after the request is created. */
export interface SellUploads {
  contractPages?: File[];
  paymentSchedule?: File | null;
  unitPlan?: File | null;
  /** Listing photos — public once the unit is published. */
  photos?: File[];
}

interface RequestsContextType {
  requests: SellRequest[];
  /** True while the saved requests are being fetched on load. */
  loading: boolean;
  /** Creates the request on the server, then uploads the files. Returns the code; a failed upload doesn't undo the request. */
  createRequest: (form: SellForm, uploads?: SellUploads) => Promise<{ code: string; failedUploads: number }>;
  updateRequest: (code: string, form: SellForm) => Promise<void>;
  uploadDocument: (code: string, docType: DocType, file: File) => Promise<void>;
  uploadPhoto: (code: string, file: File) => Promise<void>;
  deletePhoto: (code: string, url: string) => Promise<void>;
  getRequest: (code: string) => SellRequest | undefined;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

/**
 * Requests sent from this device: only the code and its access token are kept here; everything else comes from the API.
 * A signed-in seller also gets every request on their account (from any device) — those need no token.
 */
const STORAGE_KEY = 'wahdety_request_tokens_v1';
type Stored = { code: string; token: string };

const readStored = (): Stored[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((s) => s && typeof s.code === 'string' && typeof s.token === 'string') : [];
  } catch {
    return [];
  }
};

const writeStored = (list: Stored[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — requests live for this session only */
  }
};

const namesOf = (docs: SellRequestDocument[], type: DocType) => docs.filter((d) => d.docType === type).map((d) => d.originalName);

/** API request → the front end's shape. File-name fields are rebuilt from the uploaded documents. */
const fromDto = (dto: SellRequestDto): SellRequest => {
  const docs = dto.documents ?? [];
  const form: SellForm = {
    ...EMPTY_SELL_FORM,
    ...(dto.form as Partial<SellForm>),
    contractPages: namesOf(docs, DOC_TYPE.contract).slice(0, 4),
    paymentScheduleFile: namesOf(docs, DOC_TYPE.schedule)[0] ?? '',
    unitPlanFile: namesOf(docs, DOC_TYPE.plan)[0] ?? '',
    contractFile: namesOf(docs, DOC_TYPE.contract)[0] ?? '',
    receiptFile: (namesOf(docs, DOC_TYPE.receipts)[0] ?? namesOf(docs, DOC_TYPE.statement)[0]) ?? '',
    idFile: namesOf(docs, DOC_TYPE.nationalId)[0] ?? '',
  };
  return {
    code: dto.code,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    stage: (REQUEST_STAGES as string[]).includes(dto.stage) ? (dto.stage as RequestStage) : 'received',
    apiStage: dto.stage,
    canEdit: dto.canEdit,
    needsInfoReason: dto.needsInfoReason,
    documents: docs,
    photos: dto.photos ?? [],
    form,
  };
};

export const RequestsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [stored, setStored] = useState<Stored[]>(readStored);
  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [loading, setLoading] = useState(() => readStored().length > 0);

  useEffect(() => writeStored(stored), [stored]);

  // Load every request this device has a token for. One that's gone (404) or no longer ours (401/403) is dropped.
  useEffect(() => {
    const initial = readStored();
    if (!initial.length) return;
    Promise.allSettled(initial.map((s) => getSellRequest(s.code, s.token))).then((results) => {
      const loaded: SellRequest[] = [];
      const keep: Stored[] = [];
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          loaded.push(fromDto(r.value));
          keep.push(initial[i]);
        } else {
          const status = (r.reason as { status?: number })?.status;
          // Network/server trouble: keep the token so it loads next time.
          if (!status || status >= 500) keep.push(initial[i]);
        }
      });
      // Merge — the account's requests may have arrived first.
      const codes = new Set(loaded.map((r) => r.code));
      setRequests((prev) => [...loaded, ...prev.filter((r) => !codes.has(r.code))].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setStored(keep);
      setLoading(false);
    });
  }, []);

  // Signed in: add the account's requests. Signed out: keep only the ones this device holds a token for.
  useEffect(() => {
    if (!user) {
      const mine = new Set(readStored().map((s) => s.code));
      setRequests((prev) => prev.filter((r) => mine.has(r.code)));
      return;
    }
    let live = true;
    fetchMySellRequests()
      .then((list) => {
        if (!live) return;
        const fromAccount = list.map(fromDto);
        const codes = new Set(fromAccount.map((r) => r.code));
        setRequests((prev) =>
          [...fromAccount, ...prev.filter((r) => !codes.has(r.code))].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        );
      })
      .catch((e) => console.error('Failed to load account requests', e));
    return () => {
      live = false;
    };
  }, [user?.id]);

  const tokenFor = useCallback((code: string) => stored.find((s) => s.code === code)?.token, [stored]);

  const replace = (dto: SellRequestDto) => setRequests((prev) => prev.map((r) => (r.code === dto.code ? fromDto(dto) : r)));

  const createRequest: RequestsContextType['createRequest'] = async (form, uploads = {}) => {
    const { code, accessToken, request } = await createSellRequest(form);
    setStored((prev) => [{ code, token: accessToken }, ...prev.filter((s) => s.code !== code)]);

    const jobs: [DocType, File][] = [
      ...(uploads.contractPages ?? []).map((f): [DocType, File] => [DOC_TYPE.contract, f]),
      ...(uploads.paymentSchedule ? [[DOC_TYPE.schedule, uploads.paymentSchedule] as [DocType, File]] : []),
      ...(uploads.unitPlan ? [[DOC_TYPE.plan, uploads.unitPlan] as [DocType, File]] : []),
    ];
    const photos = uploads.photos ?? [];
    const results = await Promise.allSettled(jobs.map(([type, file]) => uploadSellDocument(code, accessToken, type, file)));
    let failedUploads = results.filter((r) => r.status === 'rejected').length;
    // Photos one at a time, so they keep the order the seller picked (the first is the cover).
    for (const f of photos) {
      try {
        await uploadSellPhoto(code, accessToken, f);
      } catch {
        failedUploads++;
      }
    }

    // Re-read so the list shows the uploaded documents and photos too.
    const fresh = jobs.length || photos.length ? await getSellRequest(code, accessToken).catch(() => request) : request;
    setRequests((prev) => [fromDto(fresh), ...prev.filter((r) => r.code !== code)]);
    return { code, failedUploads };
  };

  const updateRequest: RequestsContextType['updateRequest'] = async (code, form) => {
    // No token is fine when the request belongs to the signed-in account; the API checks either.
    replace(await updateSellRequest(code, tokenFor(code), form));
  };

  const uploadDocument: RequestsContextType['uploadDocument'] = async (code, docType, file) => {
    const token = tokenFor(code);
    await uploadSellDocument(code, token, docType, file);
    replace(await getSellRequest(code, token));
  };

  const uploadPhoto: RequestsContextType['uploadPhoto'] = async (code, file) => {
    const token = tokenFor(code);
    await uploadSellPhoto(code, token, file);
    replace(await getSellRequest(code, token));
  };

  const deletePhoto: RequestsContextType['deletePhoto'] = async (code, url) => {
    const token = tokenFor(code);
    await deleteSellPhoto(code, token, url);
    replace(await getSellRequest(code, token));
  };

  const getRequest = (code: string) => requests.find((r) => r.code === code);

  return (
    <RequestsContext.Provider value={{ requests, loading, createRequest, updateRequest, uploadDocument, uploadPhoto, deletePhoto, getRequest }}>{children}</RequestsContext.Provider>
  );
};

export const useRequests = (): RequestsContextType => {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error('useRequests must be used within a RequestsProvider');
  return ctx;
};
