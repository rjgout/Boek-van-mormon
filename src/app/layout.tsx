import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getCurrentUser } from "@/lib/session";
import NavUserBadges from "@/components/NavUserBadges";
import InviteListener from "@/components/InviteListener";
import ThemeScript from "@/components/ThemeScript";
import ThemeToggle from "@/components/ThemeToggle";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${APP_NAME} — Boek van Mormon`,
  description: APP_TAGLINE,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-100 dark:border-slate-800">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-brand-700 dark:text-brand-300 text-lg">
              <span aria-hidden>📖</span>
              {APP_NAME}
            </Link>

            {user ? (
              <nav className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="hidden sm:inline text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300"
                >
                  Lessen
                </Link>
                <Link
                  href="/friends"
                  className="hidden sm:inline text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300"
                >
                  Vrienden
                </Link>
                <Link
                  href="/competition"
                  className="hidden sm:inline text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300"
                >
                  Competitie
                </Link>
                <Link
                  href="/live"
                  className="hidden sm:inline text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300"
                >
                  Live spel
                </Link>
                <ThemeToggle />
                <NavUserBadges
                  streak={user.currentStreak}
                  freezes={user.freezeCount}
                  xp={user.xpTotal}
                  displayName={user.displayName}
                />
              </nav>
            ) : (
              <nav className="flex items-center gap-2">
                <ThemeToggle />
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
        <main className="mx-auto max-w-5xl px-4 py-8 pb-24 sm:pb-8">{children}</main>
        <Footer />
        {user && <BottomNav />}
        {user && <InviteListener />}
      </body>
    </html>
  );
}
