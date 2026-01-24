import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { setAuth, getAdminPassword } from "./index";

export function LoginForm() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const adminPassword = getAdminPassword();

    if (password === adminPassword) {
      setAuth();
      toast.success("Login successful!");
      setLocation("/admin");
    } else {
      setError("Invalid password. Please try again.");
      toast.error("Invalid password");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="font-oswald text-2xl font-bold uppercase">
            Admin <span className="text-blue-600">Login</span>
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Enter your password to access the admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
                autoFocus
                disabled={isLoading}
              />
              {error && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-none"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Set VITE_ADMIN_PASSWORD in your .env file for production
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
