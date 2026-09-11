"use client";

import { useState } from "react";
import { formatTag } from "@/lib/handle";

interface AdminUser {
  id: string;
  email: string;
  handle: string;
  discriminator: string;
  displayName: string;
  isAdmin: boolean;
  xpTotal: number;
  currentStreak: number;
  createdAt: string;
}

export default function AdminUsersClient({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AdminUser[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleAdmin(userId: string, nextIsAdmin: boolean) {
    setError(null);
    setBusyId(userId);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAdmin: nextIsAdmin }),
    });
    setBusyId(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Er ging iets mis.");
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isAdmin: nextIsAdmin } : u)));
  }

  return (
    <div className="card overflow-x-auto">
      <h2 className="font-extrabold mb-4">Gebruikers ({users.length})</h2>
      {error && <p className="text-red-600 dark:text-red-400 text-sm font-semibold mb-3">{error}</p>}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-bold uppercase text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700">
            <th className="py-2 pr-3">Naam</th>
            <th className="py-2 pr-3">Tag</th>
            <th className="py-2 pr-3">E-mail</th>
            <th className="py-2 pr-3">XP</th>
            <th className="py-2 pr-3">Streak</th>
            <th className="py-2 pr-3">Admin</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-slate-50 dark:border-slate-800">
              <td className="py-2 pr-3 font-bold dark:text-slate-100">
                {u.displayName}
                {u.id === currentUserId && <span className="text-brand-500 dark:text-brand-300 font-normal"> (jij)</span>}
              </td>
              <td className="py-2 pr-3 text-slate-500 dark:text-slate-400">{formatTag(u.handle, u.discriminator)}</td>
              <td className="py-2 pr-3 text-slate-500 dark:text-slate-400">{u.email}</td>
              <td className="py-2 pr-3 dark:text-slate-200">{u.xpTotal}</td>
              <td className="py-2 pr-3 dark:text-slate-200">🔥 {u.currentStreak}</td>
              <td className="py-2 pr-3">
                {u.isAdmin ? (
                  <span className="text-brand-600 dark:text-brand-300 font-bold">Admin</span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">Gebruiker</span>
                )}
              </td>
              <td className="py-2">
                {u.id === currentUserId ? (
                  <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                ) : (
                  <button
                    className="btn-secondary !px-3 !py-1.5 !text-xs"
                    disabled={busyId === u.id}
                    onClick={() => toggleAdmin(u.id, !u.isAdmin)}
                  >
                    {busyId === u.id ? "Bezig..." : u.isAdmin ? "Adminrechten weghalen" : "Maak admin"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
