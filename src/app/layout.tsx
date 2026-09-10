import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getCurrentUser } from "@/lib/session";
import NavUserBadges from "@/components/NavUserBadges";
import InviteListener from "@/components/InviteListener";

export const metadata: Metadata = {
  title: "Boek van Mormon — speels lezen",
  description: "Lees het Boek van Mormon op een speelse, Duolingo-achtige manier.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="nl">
      <body>
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-100">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-brand-700 text-lg">
              <span aria-hidden>📖</span>
              Boek van Mormon
            </Link>

            {user ? (
              <nav className="flex items-center gap-4">
                <Link href="/dashboard" className="hidden sm:inline text-sm font-bold text-slate-600 hover:text-brand-600">
                  Lessen
                </Link>
                <Link href="/friends" className="hidden sm:inline text-sm font-bold text-slate-600 hover:text-brand-600">
                  Vrienden
                </Link>
                <Link href="/competition" className="hidden sm:inline text-sm font-bold text-slate-600 hover:text-brand-600">
                  Competitie
                </Link>
                <Link href="/live" className="hidden sm:inline text-sm font-bold text-slate-600 hover:text-brand-600">
                  Live spel
                </Link>
                <NavUserBadges
                  streak={user.currentStreak}
                  freezes={user.freezeCount}
                  xp={user.xpTotal}
                  displayName={user.displayName}
                />
              </nav>
            ) : (
              <nav className="flex items-center gap-2">
                <Link href="/login" className="btn-secondary !px-4 !py-2">
                  Inloggen
                </Link>
                <Link href="/register" className="btn-primary !px-4 !py-2">
                  Account maken
                </Link>
              </nav>
            )}
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        {user && <InviteListener />}
      </body>
    </html>
  );
}
