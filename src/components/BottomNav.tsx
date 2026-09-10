import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Lessen", icon: "📖" },
  { href: "/friends", label: "Vrienden", icon: "👥" },
  { href: "/competition", label: "Competitie", icon: "🏆" },
  { href: "/live", label: "Live", icon: "⚔️" },
  { href: "/profile", label: "Profiel", icon: "🙂" },
];

// Zonder dit was er op mobiel (waar de meeste gebruikers waarschijnlijk
// zitten) geen manier om bij Vrienden/Competitie/Live te komen: die links
// stonden alleen in de header en die verdwijnt onder het "sm"-breakpoint.
export default function BottomNav() {
  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur border-t border-slate-100 dark:border-slate-700 flex justify-around py-1"
      aria-label="Hoofdnavigatie"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-slate-500 dark:text-slate-300 text-xs font-bold min-w-[3.5rem]"
        >
          <span className="text-xl" aria-hidden>
            {item.icon}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
