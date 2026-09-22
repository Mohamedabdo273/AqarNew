const TOKEN_KEY = 'tanazul_token';
const REFRESH_KEY = 'tanazul_refresh';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: string[] = []
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

/** بيتنده لما الجلسة تنتهي نهائيًا — الـ AuthContext بيسجّل نفسه هنا */
let onSessionExpired: (() => void) | null = null;
export function setSessionExpiredHandler(handler: () => void) {
  onSessionExpired = handler;
}

let refreshing: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return false;

  // طلب تجديد واحد بس حتى لو كذا نداء فشلوا في نفس الوقت
  refreshing ??= (async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      tokenStore.set(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
}

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const token = tokenStore.get();
  const isFormData = options.body instanceof FormData;

  const res = await fetch(path, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && retry && tokenStore.getRefresh() && !isFormData) {
    if (await tryRefresh()) return request<T>(path, options, false);
    tokenStore.clear();
    onSessionExpired?.();
    throw new ApiError('الجلسة انتهت. سجّل دخول تاني.', 401);
  }

  if (!res.ok) {
    let message = 'حصل خطأ في الاتصال بالسيرفر.';
    let errors: string[] = [];
    try {
      const body = await res.json();
      message = body.message ?? message;
      errors = body.errors ?? [];
    } catch {
      /* الرد مش JSON — نسيب الرسالة الافتراضية */
    }
    throw new ApiError(message, res.status, errors);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, form: FormData) =>
    request<T>(path, { method: 'POST', body: form }),
};
