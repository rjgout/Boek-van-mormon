import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { APP_NAME } from "@/lib/brand";
import InstallAppCard from "@/components/InstallAppCard";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex flex-col items-center text-center gap-8 py-12">
      <p className="text-sm font-bold uppercase tracking-wide text-brand-500 dark:text-brand-400">{APP_NAME}</p>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-800 dark:text-brand-300 leading-tight">
        Lees het Boek van Mormon,
        <br />
        op een speelse manier.
      </h1>
      <p className="max-w-xl text-slate-600 dark:text-slate-300 text-lg">
        Korte lessen, invuloefeningen, dag-streaks, streak freezes die je verdient
        (en kan weggeven), vrienden, divisies en een live quiz die je samen kan spelen.
      </p>
      <div className="flex gap-3">
        <Link href="/register" className="btn-primary">
          Gratis beginnen
        </Link>
        <Link href="/login" className="btn-secondary">
          Ik heb al een account
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 w-full max-w-4xl">
        <div className="card text-left">
          <div className="text-3xl mb-2">🔥</div>
          <h3 className="font-extrabold mb-1 dark:text-slate-100">Dag-streak</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Elke dag een beetje lezen bouwt je streak op. Een streak freeze
            verdien je door mijlpalen te halen — en die kan je weggeven aan vrienden.
          </p>
        </div>
        <div className="card text-left">
          <div className="text-3xl mb-2">✍️</div>
          <h3 className="font-extrabold mb-1 dark:text-slate-100">Invuloefeningen</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Geen multiple choice: je vult zelf de ontbrekende woorden in of
            legt woorden in de juiste volgorde.
          </p>
        </div>
        <div className="card text-left">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-extrabold mb-1 dark:text-slate-100">Live tegen vrienden</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Nodig vrienden uit voor een live quiz over een hoofdstuk en zie
            wie het snelst en scherpst is.
          </p>
        </div>
        <InstallAppCard variant="compact" />
      </div>
    </div>
  );
}
