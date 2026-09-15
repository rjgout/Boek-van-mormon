import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";

export default async function ToolsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Hulpmiddelen</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Handige extra&apos;s bij het lezen en spelen.</p>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/tools/dictionary" className="card flex items-center justify-between gap-3 hover:ring-2 hover:ring-brand-400">
          <div>
            <h2 className="font-extrabold text-lg dark:text-slate-100">Woordenboek</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Alle woorden uit het Boek van Mormon, op letter of op lengte — ook handig bij Scrabble.
            </p>
          </div>
          <span className="text-2xl" aria-hidden>
            📚
          </span>
        </Link>

        <Link href="/bookmarks" className="card flex items-center justify-between gap-3 hover:ring-2 hover:ring-brand-400">
          <div>
            <h2 className="font-extrabold text-lg dark:text-slate-100">Bladwijzers</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">De verzen die je hebt opgeslagen tijdens het lezen.</p>
          </div>
          <span className="text-2xl" aria-hidden>
            🔖
          </span>
        </Link>
      </div>
    </div>
  );
}
