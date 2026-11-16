const SESSION_KEY = "admin_auth";
const SESSION_TIME_KEY = "admin_auth_time";
const SESSION_USER_KEY = "admin_username";
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const auth = sessionStorage.getItem(SESSION_KEY);
  const authTime = sessionStorage.getItem(SESSION_TIME_KEY);
  if (!auth || !authTime) return false;
  if (Date.now() - parseInt(authTime) > SESSION_DURATION) {
    clearAuth();
    return false;
  }
  return auth === "true";
}

export function setAuth(username?: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, "true");
  sessionStorage.setItem(SESSION_TIME_KEY, Date.now().toString());
  if (username) sessionStorage.setItem(SESSION_USER_KEY, username);
}

export function getUsername(): string {
  return sessionStorage.getItem(SESSION_USER_KEY) || "";
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_TIME_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
}

export function logout(): void {
  clearAuth();
  window.location.href = "/admin/login";
}
