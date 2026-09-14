import Link from "next/link";

const items = [
  { href: "/courses", label: "Cursussen", icon: "📖" },
  { href: "/friends", label: "Vrienden", icon: "👥" },
  { href: "/competition", label: "Competitie", icon: "🏆" },
  { href: "/live", label: "Spelen", icon: "🎮" },
  { href: "/shop", label: "Winkel", icon: "🛒" },
  { href: "/profile", label: "Profiel", icon: "🙂" },
];

// Zonder dit was er op mobiel (waar de meeste gebruikers waarschijnlijk
// zitten) geen manier om bij Vrienden/Competitie/Spelen te komen: die links
// stonden alleen in de header en die verdwijnt onder het "sm"-breakpoint.
export default function BottomNav() {
  return (
    <nav
      // pb-[...] i.p.v. py-1 voor de onderkant: telt de homeindicator-ruimte
      // van een geïnstalleerde iOS-PWA (env(safe-area-inset-bottom), zie ook
      // viewportFit: "cover" in layout.tsx) op bij de gewone 0.25rem padding,
      // zodat de navigatie daar nooit onder valt. In een gewone browsertab
      // is die env()-waarde 0, dus daar verandert niets.
      className="sm:hidden fixed bottom-0 inset-x-0 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur border-t border-slate-100 dark:border-slate-700 flex justify-around pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))]"
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
