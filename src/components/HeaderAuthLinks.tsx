import Link from "next/link";

// Altijd zichtbaar, ook op mobiel — installatie van de app wordt niet meer
// hier voorgesteld (zie HeaderInstallHint.tsx voor die, alleen-na-inloggen,
// terugkerende hint), dus deze twee knoppen mogen gewoon altijd de weg naar
// aanmelden/inloggen wijzen.
export default function HeaderAuthLinks() {
  return (
    <nav className="flex items-center gap-2">
      <Link href="/login" className="btn-secondary !px-4 !py-2">
        Inloggen
      </Link>
      <Link href="/register" className="btn-primary !px-4 !py-2">
        Account maken
      </Link>
    </nav>
  );
}
