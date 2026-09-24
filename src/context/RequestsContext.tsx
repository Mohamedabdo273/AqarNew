import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SellForm } from '../lib/sellForm';
import { BRAND } from '../config/brand';

/** Where a seller request stands. Mirrors the tracker shown to the seller. */
export type RequestStage = 'received' | 'reviewing' | 'listed' | 'matched' | 'transferred';
export const REQUEST_STAGES: RequestStage[] = ['received', 'reviewing', 'listed', 'matched', 'transferred'];

export interface SellRequest {
  code: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  stage: RequestStage;
  form: SellForm;
}

interface RequestsContextType {
  requests: SellRequest[];
  createRequest: (form: SellForm) => SellRequest;
  updateRequest: (code: string, form: SellForm) => void;
  getRequest: (code: string) => SellRequest | undefined;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);
const STORAGE_KEY = 'wahdety_requests_v1';

export const RequestsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<SellRequest[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch {
      /* storage unavailable — requests live for this session only */
    }
  }, [requests]);

  const createRequest = (form: SellForm): SellRequest => {
    const now = new Date().toISOString();
    const req: SellRequest = {
      code: `${BRAND.codePrefix}-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: now,
      updatedAt: now,
      stage: 'received',
      form,
    };
    setRequests((prev) => [req, ...prev]);
    return req;
  };

  const updateRequest = (code: string, form: SellForm) =>
    setRequests((prev) => prev.map((r) => (r.code === code ? { ...r, form, updatedAt: new Date().toISOString() } : r)));

  const getRequest = (code: string) => requests.find((r) => r.code === code);

  return (
    <RequestsContext.Provider value={{ requests, createRequest, updateRequest, getRequest }}>{children}</RequestsContext.Provider>
  );
};

export const useRequests = (): RequestsContextType => {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error('useRequests must be used within a RequestsProvider');
  return ctx;
};
