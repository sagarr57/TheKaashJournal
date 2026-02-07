import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { setAuth } from "./index";

// Use Vercel serverless function
// In production: uses /api (Vercel rewrites to serverless functions)
// In development: you can either:
//   1. Run `vercel dev` to run functions locally
//   2. Or set VITE_API_URL to your deployed Vercel URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function LoginForm() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        // If response is not JSON, it's likely a 500 or connection error
        if (response.status === 500 || response.status === 0) {
          setError('Backend server not running. Please run `vercel dev` or `npm run dev:api`');
          toast.error('Backend server not running. Run `vercel dev` or `npm run dev:api`');
          return;
        }
        throw e;
      }

      if (!response.ok) {
        setError(data.error || 'Invalid username or password');
        toast.error(data.error || 'Login failed');
        return;
      }

      if (data.success) {
        setAuth();
        toast.success("Login successful!");
        setLocation("/admin");
      } else {
        setError('Login failed');
        toast.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            Enter your credentials to access the admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12"
                required
                autoFocus
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
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
        </CardContent>
      </Card>
    </div>
  );
}
