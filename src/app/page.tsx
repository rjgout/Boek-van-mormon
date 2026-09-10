import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex flex-col items-center text-center gap-8 py-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-800 leading-tight">
        Lees het Boek van Mormon,
        <br />
        op een speelse manier.
      </h1>
      <p className="max-w-xl text-slate-600 text-lg">
        Korte lessen, invuloefeningen, dag-streaks, streak freezes die je verdient
        (en kan weggeven), vrienden en een live quiz die je samen kan spelen.
      </p>
      <div className="flex gap-3">
        <Link href="/register" className="btn-primary">
          Gratis beginnen
        </Link>
        <Link href="/login" className="btn-secondary">
          Ik heb al een account
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-8 w-full max-w-3xl">
        <div className="card text-left">
          <div className="text-3xl mb-2">🔥</div>
          <h3 className="font-extrabold mb-1">Dag-streak</h3>
          <p className="text-sm text-slate-500">
            Elke dag een beetje lezen bouwt je streak op. Een streak freeze
            verdien je door mijlpalen te halen — en die kan je weggeven aan vrienden.
          </p>
        </div>
        <div className="card text-left">
          <div className="text-3xl mb-2">✍️</div>
          <h3 className="font-extrabold mb-1">Invuloefeningen</h3>
          <p className="text-sm text-slate-500">
            Geen multiple choice: je vult zelf de ontbrekende woorden in of
            legt woorden in de juiste volgorde.
          </p>
        </div>
        <div className="card text-left">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-extrabold mb-1">Live tegen vrienden</h3>
          <p className="text-sm text-slate-500">
            Nodig vrienden uit voor een live quiz over een hoofdstuk en zie
            wie het snelst en scherpst is.
          </p>
        </div>
      </div>
    </div>
  );
}
