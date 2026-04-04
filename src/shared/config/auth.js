const AUTH_KEY = 'auth_session';

export function getAuthSession() {
  return localStorage.getItem(AUTH_KEY);
}

export function isAuthenticated() {
  return Boolean(getAuthSession());
}

export function saveAuthSession(sessionValue) {
  localStorage.setItem(AUTH_KEY, sessionValue);
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_KEY);
}

