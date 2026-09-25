/**
 * Admin sign-in (front end only).
 *
 * This is the screen-side half. It keeps nobody out on its own: the real protection has to be the
 * backend refusing /api/admin/* without a valid token. Until POST /api/admin/login exists, the dev
 * server lets any credentials through (and says so on screen); production builds refuse.
 */
const SESSION_KEY = 'wahdety_admin_session';

export type SignInResult = 'ok' | 'invalid' | 'unavailable';

export const hasAdminSession = (): boolean => {
  try {
    return !!sessionStorage.getItem(SESSION_KEY);
  } catch {
    return false;
  }
};

export const adminSignOut = () => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
};

const saveSession = (token: string) => {
  try {
    sessionStorage.setItem(SESSION_KEY, token);
  } catch {
    /* ignore — the user just has to sign in again */
  }
};

/** True while there's no login endpoint and we're on the dev server. */
export const isDevLogin = () => import.meta.env.DEV;

export async function adminSignIn(email: string, password: string): Promise<SignInResult> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const isJson = res.headers.get('content-type')?.includes('application/json');
    if (res.ok && isJson) {
      const data = (await res.json()) as { token?: string };
      if (data.token) {
        saveSession(data.token);
        return 'ok';
      }
    }
    if (res.status === 401 || res.status === 403) return 'invalid';
  } catch {
    /* network error — fall through */
  }
  // No login endpoint yet.
  if (isDevLogin()) {
    saveSession('dev');
    return 'ok';
  }
  return 'unavailable';
}
