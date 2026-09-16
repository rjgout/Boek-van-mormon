import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import "./globals.css";
import { getCurrentUser } from "@/lib/session";
import { getBranding } from "@/lib/branding";
import { cacheDetectedAppUrl } from "@/lib/baseUrl";
import NavUserBadges from "@/components/NavUserBadges";
import InviteListener from "@/components/InviteListener";
import ChangelogPopup from "@/components/ChangelogPopup";
import ThemeScript from "@/components/ThemeScript";
import BottomNav from "@/components/BottomNav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";

// PWA: manifest + icons zijn wat een browser nodig heeft om "toevoegen aan
// startscherm"/installeren aan te bieden (samen met de service worker, zie
// ServiceWorkerRegister hieronder en public/sw.js). appleWebApp is nodig
// omdat iOS Safari het standaard manifest niet volgt voor het beginscherm.
// Dynamisch (i.p.v. een statische export) omdat een admin via
// /adminbackend een eigen favicon kan instellen (zie src/lib/branding.ts).
export async function generateMetadata(): Promise<Metadata> {
  const { faviconDataUrl } = await getBranding();

  return {
    title: APP_NAME,
    description: APP_TAGLINE,
    manifest: "/manifest.webmanifest",
    icons: {
      // Een eigen favicon vervangt de standaard-set volledig — anders kiest
      // de browser soms toch de hogere-resolutie standaard-PNG's in plaats
      // van het eigen icoon. /api/branding/favicon serveert 'm rechtstreeks
      // (of verwijst door naar het standaardbestand als er geen is ingesteld).
      icon: faviconDataUrl
        ? [{ url: "/api/branding/favicon", sizes: "any" }]
        : [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          ],
      // iOS gebruikt voor "Voeg toe aan beginscherm" specifiek dit
      // apple-touch-icon-icoon, niet de gewone favicon hierboven — zonder
      // deze eigen tak zou een custom favicon dus nooit op het beginscherm
      // van een iPhone verschijnen (zie /api/branding/apple-touch-icon).
      apple: faviconDataUrl
        ? [{ url: "/api/branding/apple-touch-icon", sizes: "any" }]
        : [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: APP_NAME,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1c8a3f",
  // Nodig zodat env(safe-area-inset-*) (zie BottomNav) daadwerkelijk de
  // inkeping/homeindicator-ruimte teruggeeft i.p.v. altijd 0 — anders valt
  // de onderste navigatie in een geïnstalleerde iOS-PWA samen met de
  // homeindicator.
  viewportFit: "cover",
};

// Onthoudt bij elk paginabezoek het publieke adres (zie cacheDetectedAppUrl
// in src/lib/baseUrl.ts) — hier, en niet in baseUrl.ts zelf, omdat dit
// bestand (via Next's eigen bundeling) de enige veilige plek is om
// "next/headers" te gebruiken. Fire-and-forget, mag de pagina nooit blokkeren.
async function detectAppUrlFromHeaders(): Promise<void> {
  if (process.env.APP_URL?.trim()) return; // env-override actief, niets te detecteren
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return;
  const proto = h.get("x-forwarded-proto") ?? "https";
  cacheDetectedAppUrl(`${proto}://${host}`, host);
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  detectAppUrlFromHeaders().catch(() => {});
  const [user, { logoDataUrl }] = await Promise.all([getCurrentUser(), getBranding()]);

  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-100 dark:border-slate-800">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-brand-700 dark:text-brand-300 text-lg">
              {logoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoDataUrl} alt={APP_NAME} className="h-8 w-auto" />
              ) : (
                <>
                  <span aria-hidden>📖</span>
                  {APP_NAME}
                </>
              )}
            </Link>

            {user ? (
              <nav className="flex items-center gap-4">
                <Link
                  href="/courses"
                  className="hidden sm:inline whitespace-nowrap text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300"
                >
                  Cursussen
                </Link>
                <Link
                  href="/friends"
                  className="hidden sm:inline whitespace-nowrap text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300"
                >
                  Vrienden
                </Link>
                <Link
                  href="/competition"
                  className="hidden sm:inline whitespace-nowrap text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300"
                >
                  Competitie
                </Link>
                <Link
                  href="/live"
                  className="hidden sm:inline whitespace-nowrap text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300"
                >
                  Spelen
                </Link>
                <Link
                  href="/shop"
                  className="hidden sm:inline whitespace-nowrap text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300"
                >
                  Winkel
                </Link>
                {user.isAdmin && (
                  <Link
                    href="/adminbackend"
                    className="hidden sm:inline whitespace-nowrap text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300"
                  >
                    Admin
                  </Link>
                )}
                <NavUserBadges streak={user.currentStreak} xp={user.xpTotal} displayName={user.handle} />
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
        <main className="mx-auto max-w-5xl px-4 py-8 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-8">{children}</main>
        {user && <BottomNav />}
        {user && <InviteListener />}
        {user && <ChangelogPopup />}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
