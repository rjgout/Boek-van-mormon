"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavUserBadges({
  streak,
  freezes,
  xp,
  displayName,
}: {
  streak: number;
  freezes: number;
  xp: number;
  displayName: string;
}) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 text-sm font-bold">
      <span title="Dag-streak" className="flex items-center gap-1 text-orange-500">
        🔥 {streak}
      </span>
      <span title="Streak freezes" className="flex items-center gap-1 text-ice-600">
        🧊 {freezes}
      </span>
      <span title="Ervaringspunten" className="flex items-center gap-1 text-gold-600">
        ⭐ {xp}
      </span>
      <Link href="/profile" className="hidden md:inline text-slate-500">
        {displayName}
      </Link>
      <button onClick={logout} className="text-slate-400 hover:text-slate-700 text-xs font-semibold">
        Uitloggen
      </button>
    </div>
  );
}
