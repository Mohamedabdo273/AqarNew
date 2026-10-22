import { RealEstateUnit } from '../types';
import { SellForm } from '../lib/sellForm';

/**
 * Client for the public API (AqarApi). With VITE_API_URL set, the browser calls that server directly (it must allow this
 * site in its Cors:Origins); without it, requests go to /api on this origin and server.ts proxies them to API_URL.
 * Every error leaves the API as { message, errors } — ApiError carries both.
 */
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: string[] = [],
  ) {
    super(message);
  }
}

const FALLBACK_MESSAGE = 'حصلت مشكلة في الاتصال. جرّب تاني كمان شوية.';

/* ───────────── Session (signed-in visitor) ───────────── */

export interface Session {
  accessToken: string;
  refreshToken: string;
  /** ISO time the access token stops working. */
  expiresAt: string;
}

const SESSION_KEY = 'wahdety_session_v1';
let session: Session | null = (() => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
})();
const sessionListeners = new Set<(s: Session | null) => void>();

export const getSession = () => session;

export function setSession(next: Session | null) {
  session = next;
  try {
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable — the session lasts until the tab closes */
  }
  sessionListeners.forEach((fn) => fn(next));
}

/** AuthContext listens so a session that dies mid-request (refresh rejected) signs the visitor out everywhere. */
export const onSessionChange = (fn: (s: Session | null) => void) => {
  sessionListeners.add(fn);
  return () => sessionListeners.delete(fn);
};

// Refresh tokens rotate: two parallel refreshes would present the same token twice and the API treats that as theft.
// So every caller that hits a 401 waits on the same refresh.
let refreshing: Promise<boolean> | null = null;
function refreshSession(): Promise<boolean> {
  const current = session;
  if (!current) return Promise.resolve(false);
  refreshing ??= fetch(`${API_BASE}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: current.refreshToken }),
  })
    .then(async (res) => {
      if (!res.ok) {
        // Only a definite "no" ends the session; a network blip keeps it for the next try.
        if (res.status === 401 || res.status === 400) setSession(null);
        return false;
      }
      const auth = (await res.json()) as AuthResponse;
      setSession({ accessToken: auth.accessToken, refreshToken: auth.refreshToken, expiresAt: auth.expiresAt });
      return true;
    })
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

const withAuth = (init: RequestInit): RequestInit => {
  if (!session) return init;
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${session.accessToken}`);
  return { ...init, headers };
};

async function request<T>(path: string, init: RequestInit = {}, retried = false): Promise<T> {
  // Refresh a little before expiry rather than eat a 401 on every first call after a break.
  if (!retried && session && new Date(session.expiresAt).getTime() - Date.now() < 30_000) await refreshSession();
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api${path}`, withAuth(init));
  } catch {
    throw new ApiError(FALLBACK_MESSAGE, 0);
  }
  if (res.status === 401 && session && !retried && (await refreshSession())) return request<T>(path, init, true);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.message || FALLBACK_MESSAGE, res.status, Array.isArray(body?.errors) ? body.errors : []);
  }
  if (res.status === 204) return undefined as T;
  // An HTML page here means /api never reached the API (e.g. the dev server runs without the proxy in server.ts).
  if (!(res.headers.get('content-type') ?? '').includes('json')) {
    console.error(`${API_BASE}/api${path} returned ${res.headers.get('content-type') || 'no content type'} instead of JSON — is the API proxy running?`);
    throw new ApiError(FALLBACK_MESSAGE, 502);
  }
  return res.json() as Promise<T>;
}

const json = (method: string, body: unknown, headers: Record<string, string> = {}): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json', ...headers },
  body: JSON.stringify(body),
});

/** Turns an error into one line for the user: the API's message plus its field errors. */
export const errorText = (e: unknown) =>
  e instanceof ApiError ? [e.message, ...e.errors].join(' — ') : FALLBACK_MESSAGE;

/* ───────────── Units ───────────── */

interface Paged<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}

/** The API sends the unit in the front end's own shape; ids come back as strings. */
type UnitDto = RealEstateUnit & { publicCode?: string };

/* الباك اند لسه بيرجّع إقليم واحد اسمه "القاهرة الكبرى"، واحنا قسمناه قاهرة وجيزة.
   بنقسمه هنا وقت الاستقبال حسب المنطقة التفصيلية، فالفلاتر تشتغل من غير ما نستنى الداتابيز.
   يتشال لما الباك اند يتعدّل. */
const LEGACY_GREATER_CAIRO = 'القاهرة الكبرى';
const GIZA_SUB_AREAS = new Set([
  'الشيخ زايد',
  'الشيخ زايد الجديدة',
  '6 أكتوبر وحدائق أكتوبر',
  'المهندسين والدقي',
  'المهندسين والدقي والزمالك',
  'الهرم وفيصل',
]);
/** المنطقة التفصيلية القديمة اللي اتغير اسمها مع التقسيم. */
const RENAMED_SUB_AREAS: Record<string, string> = {
  'المهندسين والدقي والزمالك': 'المهندسين والدقي',
};

/** أنواع اتغير اسمها عندنا والباك اند لسه بيرجّع القديم. */
const RENAMED_TYPES: Record<string, RealEstateUnit['propertyType']> = {
  'محل': 'محل/مقر',
  'مساحة في مول': 'محل/مقر',
};

function splitGreaterCairo(unit: UnitDto): UnitDto {
  const subArea = (unit.subArea && RENAMED_SUB_AREAS[unit.subArea]) || unit.subArea;
  const propertyType = RENAMED_TYPES[unit.propertyType] ?? unit.propertyType;
  if (propertyType !== unit.propertyType) unit = { ...unit, propertyType };
  if ((unit.region as string) !== LEGACY_GREATER_CAIRO) return subArea === unit.subArea ? unit : { ...unit, subArea };
  const isGiza = !!unit.subArea && GIZA_SUB_AREAS.has(unit.subArea);
  return { ...unit, subArea, region: isGiza ? 'جيزة' : 'قاهرة' };
}

/** Every published unit, all pages. The listing filters and sorts on the client. */
export async function fetchAllUnits(): Promise<RealEstateUnit[]> {
  const all: RealEstateUnit[] = [];
  for (let page = 1; ; page++) {
    const res = await request<Paged<UnitDto>>(`/units?page=${page}&pageSize=100&sort=newest`);
    all.push(...res.items.map(splitGreaterCairo));
    if (!res.hasNext) return all;
  }
}

/** One unit by id or code — also counts a view. */
export const fetchUnit = async (idOrCode: string) =>
  splitGreaterCairo(await request<UnitDto>(`/units/${encodeURIComponent(idOrCode)}`));

export interface VerifyResult {
  found: boolean;
  verified: boolean;
  code: string | null;
  unit: RealEstateUnit | null;
  checks: { key: string; ok: boolean }[];
}
export const verifyCode = (code: string) => request<VerifyResult>(`/verify/${encodeURIComponent(code)}`);

/* ───────────── Sell requests ───────────── */

/** Matches DocumentType on the API. */
export const DOC_TYPE = { contract: 1, receipts: 2, nationalId: 3, developerLetter: 4, statement: 5, schedule: 6, plan: 7, other: 99 } as const;
export type DocType = (typeof DOC_TYPE)[keyof typeof DOC_TYPE];

export interface SellRequestDocument {
  id: number;
  docType: DocType;
  originalName: string;
  fileSizeBytes: number;
  scanStatus: number;
  uploadedAt: string;
}

/** The API's SellFormDto: the form without the file-name fields (files are uploaded separately). */
type SellFormBody = Omit<SellForm, 'contractPages' | 'paymentScheduleFile' | 'unitPlanFile' | 'contractFile' | 'receiptFile' | 'idFile'>;

export interface SellRequestDto {
  code: string;
  createdAt: string;
  updatedAt: string;
  /** received | reviewing | listed | matched | transferred | closed */
  stage: string;
  status: number;
  needsInfoReason: string | null;
  verificationCode: string | null;
  unitId: number;
  canEdit: boolean;
  form: SellFormBody;
  documents: SellRequestDocument[];
  /** Listing photos (public URLs), shown on the unit once it's published. */
  photos: string[];
}

export interface SellRequestTracker {
  code: string;
  stage: string;
  compound: string;
  developer: string;
  createdAt: string;
  updatedAt: string;
}

const toBody = (f: SellForm): SellFormBody => {
  const { contractPages, paymentScheduleFile, unitPlanFile, contractFile, receiptFile, idFile, ...rest } = f;
  return rest;
};

/** Requests sent from this device carry their token; ones owned by the signed-in account don't need it. */
const tokenHeader = (token?: string): Record<string, string> => (token ? { 'X-Request-Token': token } : {});

/** `draft`: save the form so far (each "Next"); it stays out of review until submitted. */
export const createSellRequest = (form: SellForm, draft = false) =>
  request<{ code: string; accessToken: string; request: SellRequestDto }>(`/sell-requests${draft ? '?draft=true' : ''}`, json('POST', toBody(form)));

export const getSellRequest = (code: string, token?: string) =>
  request<SellRequestDto>(`/sell-requests/${encodeURIComponent(code)}`, { headers: tokenHeader(token) });

/** On a draft, `draft: true` saves another step and `false` submits it for review. */
export const updateSellRequest = (code: string, token: string | undefined, form: SellForm, draft = false) =>
  request<SellRequestDto>(`/sell-requests/${encodeURIComponent(code)}${draft ? '?draft=true' : ''}`, json('PUT', toBody(form), tokenHeader(token)));

export const trackSellRequest = (code: string) => request<SellRequestTracker>(`/sell-requests/${encodeURIComponent(code)}/track`);

export function uploadSellDocument(code: string, token: string | undefined, docType: DocType, file: File) {
  const body = new FormData();
  body.append('docType', String(docType));
  body.append('file', file);
  return request<SellRequestDocument>(`/sell-requests/${encodeURIComponent(code)}/documents`, { method: 'POST', headers: tokenHeader(token), body });
}

/** A listing photo — unlike documents, buyers see these once the unit is published. */
export function uploadSellPhoto(code: string, token: string | undefined, file: File) {
  const body = new FormData();
  body.append('file', file);
  return request<{ url: string }>(`/sell-requests/${encodeURIComponent(code)}/photos`, { method: 'POST', headers: tokenHeader(token), body });
}

/** A stored file's URL as the API returns it (/media/...) → one the browser can load: on the API host, or via the proxy. */
export const mediaUrl = (url: string) => (url.startsWith('/') ? `${API_BASE}${url}` : url);

export const deleteSellPhoto = (code: string, token: string | undefined, url: string) =>
  request<void>(`/sell-requests/${encodeURIComponent(code)}/photos?url=${encodeURIComponent(url)}`, { method: 'DELETE', headers: tokenHeader(token) });

/* ───────────── Inquiries ───────────── */

/** Matches InquiryType on the API. */
export const INQUIRY_TYPE = { general: 1, viewing: 2, priceOffer: 3, investor: 5, booking: 9 } as const;

interface InquiryCreated {
  id: number;
  status: number;
  createdAt: string;
}

export const sendInquiry = (body: {
  contactName: string;
  contactPhone: string;
  inquiryType: (typeof INQUIRY_TYPE)[keyof typeof INQUIRY_TYPE];
  unitId?: number;
  message?: string;
  offerAmount?: number;
  preferredDate?: string;
}) => request<InquiryCreated>('/inquiries', json('POST', body));

export const sendContact = (body: { topic: string; name: string; phone: string; message: string }) =>
  request<InquiryCreated>('/inquiries/contact', json('POST', body));

export const sendSwap = (body: { targetUnitId: number; name: string; phone: string; myPaid?: number; myMonthly?: number; notes?: string }) =>
  request<InquiryCreated>('/inquiries/swap', json('POST', body));

export const sendSearchAlert = (body: { phone: string; name?: string; summary?: string; filters?: unknown }) =>
  request<InquiryCreated>('/inquiries/alert', json('POST', body));

export function sendStatement(
  fields: { name: string; phone: string; developer: string; compound?: string; contractPrice: number; paidAmount: number; hasLatePenalties: boolean; latePenaltiesAmount: number },
  file?: File | null,
) {
  const body = new FormData();
  Object.entries(fields).forEach(([k, v]) => v !== undefined && body.append(k, String(v)));
  if (file) body.append('file', file);
  return request<InquiryCreated>('/inquiries/statement', { method: 'POST', body });
}

/* ───────────── Sign-in (phone + WhatsApp code) ───────────── */

/** Matches UserRole on the API. Visitors can only be buyer / seller / investor. */
export const USER_ROLE = { buyer: 1, seller: 2, investor: 3, ops: 4, sales: 5, admin: 6 } as const;

export interface AccountUser {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  role: number;
  isPhoneVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AccountUser;
  isNewUser: boolean;
}

export const requestOtp = (phone: string) => request<{ success: boolean }>('/auth/otp/request', json('POST', { phone }));

export const verifyOtp = (phone: string, code: string) => request<AuthResponse>('/auth/otp/verify', json('POST', { phone, code }));

/** Sign-up, step 1: checks the details (409 if the phone already has a password) and sends the code. */
export const startRegistration = (body: { fullName: string; phone: string; password: string }) =>
  request<{ success: boolean }>('/auth/register/start', json('POST', body));

/** Sign-up, step 2: same details plus the code. */
export const register = (body: { fullName: string; phone: string; password: string; code: string }) =>
  request<AuthResponse>('/auth/register', json('POST', body));

export const login = (phone: string, password: string) => request<AuthResponse>('/auth/login', json('POST', { phone, password }));

/** "Forgot password": after requestOtp, the code sets a new password and signs in. */
export const resetPassword = (body: { phone: string; code: string; newPassword: string }) =>
  request<AuthResponse>('/auth/password/reset', json('POST', body));

export const fetchMe = () => request<AccountUser>('/auth/me');

export const updateMe = (body: { fullName: string; email?: string | null }) => request<AccountUser>('/auth/me', json('PUT', body));

/** Revokes the refresh token on the server; the caller clears the session either way. */
export const logoutSession = (refreshToken: string) => request<void>('/auth/logout', json('POST', { refreshToken }));

/* ───────────── Account data ───────────── */

export const fetchFavoriteIds = () => request<number[]>('/me/favorites');
export const addFavorite = (unitId: number) => request<void>(`/me/favorites/${unitId}`, { method: 'PUT' });
export const removeFavorite = (unitId: number) => request<void>(`/me/favorites/${unitId}`, { method: 'DELETE' });
/** Merges favorites saved as a guest into the account; returns the full list. */
export const syncFavorites = (unitIds: number[]) => request<number[]>('/me/favorites/sync', json('POST', { unitIds }));

export const fetchMySellRequests = () => request<SellRequestDto[]>('/me/sell-requests');

/* ───────────── Offers ("اعرض سعرك") & notifications ───────────── */

/** Matches OfferThreadStatus on the API. */
export const OFFER_STATUS = { awaitingSeller: 1, awaitingBuyer: 2, agreed: 3, rejected: 4, withdrawn: 5, expired: 6, closed: 7 } as const;
export type OfferStatus = (typeof OFFER_STATUS)[keyof typeof OFFER_STATUS];
/** Matches OfferMoveType on the API. */
export const OFFER_MOVE = { offer: 1, counter: 2, accept: 3, reject: 4, withdraw: 5, expire: 6, close: 7, extend: 8 } as const;
/** Matches OfferActor on the API. */
export const OFFER_ACTOR = { buyer: 1, seller: 2, system: 3, staff: 4 } as const;

export type OfferAction = 'accept' | 'counter' | 'reject' | 'raise' | 'withdraw';

/** How the buyer hands over the cash: full, or needs instalments (details agreed by phone). Matches OfferCashPlan on the API. */
export const CASH_PLAN = { full: 1, installments: 2 } as const;
export type CashPlan = (typeof CASH_PLAN)[keyof typeof CASH_PLAN];

export interface OfferMove {
  type: number;
  actor: number;
  amount: number | null;
  /** The cash plan proposed with an offer/counter. */
  cashPlan: CashPlan | null;
  note: string | null;
  at: string;
}

/** One negotiation as the caller sees it. The other side is only "مشتري N" / "صاحب الوحدة". */
export interface OfferThread {
  id: number;
  unitId: number;
  unitCode: string;
  unitTitle: string;
  unitImage: string | null;
  role: 'buyer' | 'seller';
  buyerLabel: string;
  status: OfferStatus;
  askingPrice: number;
  floorPrice: number;
  lastBuyerOffer: number;
  lastSellerCounter: number | null;
  /** The cash plan on the table (whoever moved last set it). */
  cashPlan: CashPlan;
  agreedPrice: number | null;
  buyerFee: number;
  buyerMovesLeft: number;
  sellerMovesLeft: number;
  deadlineAt: string | null;
  closeReason: string | null;
  actions: OfferAction[];
  nextMin: number | null;
  nextMax: number | null;
  moves: OfferMove[];
  createdAt: string;
  updatedAt: string | null;
}

export interface UnitOfferState {
  negotiable: boolean;
  isOwner: boolean;
  canOffer: boolean;
  reason: string | null;
  askingPrice: number;
  floorPrice: number;
  maxOffer: number;
  step: number;
  buyerFeePercent: number;
  openThreadsOnUnit: number;
  thread: OfferThread | null;
}

export const fetchUnitOfferState = (unitId: number | string) => request<UnitOfferState>(`/offers/unit/${encodeURIComponent(String(unitId))}`);
export const createOffer = (unitId: number, amount: number, cashPlan: CashPlan) =>
  request<OfferThread>('/offers', json('POST', { unitId, amount, cashPlan }));
export const fetchOffer = (id: number) => request<OfferThread>(`/offers/${id}`);
export const offerAction = (id: number, action: OfferAction, amount?: number, cashPlan?: CashPlan) =>
  request<OfferThread>(`/offers/${id}/${action}`, amount === undefined ? { method: 'POST' } : json('POST', { amount, cashPlan }));
export const fetchMyOffers = () => request<OfferThread[]>('/me/offers');
export const fetchReceivedOffers = () => request<OfferThread[]>('/me/offers/received');

/** Matches NotificationType on the API. */
export const NOTIFICATION_TYPE = {
  offerReceived: 1,
  offerCountered: 2,
  offerRaised: 3,
  offerAccepted: 4,
  offerRejected: 5,
  offerExpired: 6,
  offerWithdrawn: 7,
  unitReserved: 8,
  offerClosed: 9,
  offerExtended: 10,
  offerReopened: 11,
  staffCallParties: 12,
} as const;

export interface AppNotification {
  id: number;
  type: number;
  /** Arabic, ready to show. */
  title: string;
  body: string | null;
  unitId: number | null;
  unitCode: string | null;
  offerThreadId: number | null;
  amount: number | null;
  createdAt: string;
  isRead: boolean;
}

export const fetchNotifications = () => request<{ items: AppNotification[]; unreadCount: number }>('/me/notifications');
export const markNotificationRead = (id: number) => request<void>(`/me/notifications/${id}/read`, { method: 'POST' });
export const markAllNotificationsRead = () => request<void>('/me/notifications/read-all', { method: 'POST' });
