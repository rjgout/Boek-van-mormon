import Link from "next/link";

export default function NavUserBadges({
  streak,
  xp,
  displayName,
}: {
  streak: number;
  xp: number;
  displayName: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm font-bold leading-none">
      <Link href="/streak" title="Reeks" className="flex items-center gap-1 text-orange-500">
        🔥 {streak}
      </Link>
      <span title="Ervaringspunten" className="flex items-center gap-1 text-gold-600">
        ⭐ {xp}
      </span>
      <Link href="/profile" className="hidden md:inline text-slate-500">
        {displayName}
      </Link>
    </div>
  );
}
