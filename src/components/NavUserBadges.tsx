import Link from "next/link";

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
  return (
    <div className="flex items-center gap-3 text-sm font-bold leading-none">
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
    </div>
  );
}
