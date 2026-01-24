// Authentication utilities for admin module

const SESSION_KEY = "admin_auth";
const SESSION_TIME_KEY = "admin_auth_time";
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  
  const auth = sessionStorage.getItem(SESSION_KEY);
  const authTime = sessionStorage.getItem(SESSION_TIME_KEY);
  
  if (!auth || !authTime) return false;
  
  const timeDiff = Date.now() - parseInt(authTime);
  
  if (timeDiff > SESSION_DURATION) {
    clearAuth();
    return false;
  }
  
  return auth === "true";
}

/**
 * Set authentication session
 */
export function setAuth(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, "true");
  sessionStorage.setItem(SESSION_TIME_KEY, Date.now().toString());
}

/**
 * Clear authentication session
 */
export function clearAuth(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_TIME_KEY);
}

/**
 * Logout and redirect to login
 */
export function logout(): void {
  clearAuth();
  window.location.href = "/admin/login";
}

/**
 * Get admin password from environment
 */
export function getAdminPassword(): string {
  return import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
}
