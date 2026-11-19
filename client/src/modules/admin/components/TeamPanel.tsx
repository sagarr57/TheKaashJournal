import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Users, ShieldCheck, ShieldOff, UserPlus } from "lucide-react";
import { getAdminToken, logout } from "../auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

interface TeamUser {
  id: string;
  username: string;
  full_name: string | null;
  email: string | null;
  is_active: boolean;
  totp_enabled: boolean;
  last_login: string | null;
}

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getAdminToken()}`, ...(init?.headers || {}) },
  });
  if (res.status === 401) logout();
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

/** Lists admin accounts and lets a signed-in admin add a teammate, pause access, or reset 2FA. */
export function TeamPanel() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [me, setMe] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [form, setForm] = useState({ username: "", full_name: "", email: "", password: "" });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api("/admin/team");
      setUsers(data.users || []);
      setMe(data.me || "");
    } catch (err: any) {
      toast.error("Could not load team", { description: err?.message });
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const change = async (user: TeamUser, kind: "activate" | "deactivate" | "reset-2fa") => {
    setBusyId(user.id);
    try {
      const { user: updated } = await api("/admin/team", { method: "POST", body: JSON.stringify({ id: user.id, change: kind }) });
      setUsers((list) => list.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(kind === "reset-2fa" ? `2FA reset for ${user.username}` : kind === "activate" ? `${user.username} can sign in again` : `${user.username} can no longer sign in`);
    } catch (err: any) {
      toast.error("Change failed", { description: err?.message });
    } finally { setBusyId(null); }
  };

  const addUser = async (e: FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api("/auth/create-admin", { method: "POST", body: JSON.stringify(form) });
      toast.success(`Added ${form.username}`, { description: "Share the username and password with them privately. They should change the password and turn on 2FA after signing in." });
      setForm({ username: "", full_name: "", email: "", password: "" });
      setShowForm(false);
      await load();
    } catch (err: any) {
      toast.error("Could not add teammate", { description: err?.message });
    } finally { setAdding(false); }
  };

  const input = "w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <h2 className="font-semibold text-slate-900">Team</h2>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-500">
            <UserPlus className="w-3.5 h-3.5" /> Add teammate
          </button>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Each person signs in with their own username and password, and sets up 2FA on their own phone from this Settings page.
      </p>

      {showForm && (
        <form onSubmit={addUser} className="mb-5 p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="space-y-1"><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Username</span>
              <input className={input} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.trim() })} placeholder="e.g. saga" required autoComplete="off" /></label>
            <label className="space-y-1"><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full name</span>
              <input className={input} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Optional" /></label>
            <label className="space-y-1"><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</span>
              <input className={input} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Optional" /></label>
            <label className="space-y-1"><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Temporary password</span>
              <input className={input} type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" minLength={8} required autoComplete="new-password" /></label>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-white">Cancel</button>
            <button type="submit" disabled={adding} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50">{adding ? "Adding…" : "Add teammate"}</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">Loading team…</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {users.map((u) => (
            <li key={u.id} className="py-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <p className="font-medium text-slate-900 text-sm">
                  {u.username}{u.username === me && <span className="ml-2 text-xs text-slate-400">(you)</span>}
                  {!u.is_active && <span className="ml-2 text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">No access</span>}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                  {u.totp_enabled
                    ? <span className="inline-flex items-center gap-1 text-emerald-600"><ShieldCheck className="w-3.5 h-3.5" /> 2FA on</span>
                    : <span className="inline-flex items-center gap-1 text-amber-600"><ShieldOff className="w-3.5 h-3.5" /> 2FA off</span>}
                  <span>· {u.last_login ? `last signed in ${new Date(u.last_login).toLocaleDateString("en-GB")}` : "never signed in"}</span>
                </p>
              </div>
              {u.username !== me && (
                <div className="flex gap-2">
                  {u.totp_enabled && (
                    <button disabled={busyId === u.id} onClick={() => change(u, "reset-2fa")} className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50" title="Use if they lost their phone; they can set 2FA up again">
                      Reset 2FA
                    </button>
                  )}
                  <button disabled={busyId === u.id} onClick={() => change(u, u.is_active ? "deactivate" : "activate")}
                    className={`px-2.5 py-1.5 text-xs border rounded-lg disabled:opacity-50 ${u.is_active ? "border-red-300 text-red-600 hover:bg-red-50" : "border-slate-300 hover:bg-slate-50"}`}>
                    {u.is_active ? "Remove access" : "Restore access"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
