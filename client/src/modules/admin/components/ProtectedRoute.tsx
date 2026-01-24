import { useEffect } from "react";
import { useLocation } from "wouter";
import { isAuthenticated } from "../auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  if (!isAuthenticated()) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
