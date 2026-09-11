import Link from "next/link";

interface EpisodeView {
  id: string;
  number: number;
  title: string;
  summary: string | null;
  listenUrl: string | null;
  contentCompleted: boolean;
  contentBestScore: number | null;
  bomCompleted: boolean;
  bomBestScore: number | null;
}

interface Props {
  courseName: string;
  streak: number;
  freezeCount: number;
  xpTotal: number;
  episodes: EpisodeView[];
}

export default function PodcastCourseView({ courseName, streak, freezeCount, xpTotal, episodes }: Props) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">{courseName}</h1>
          <div className="flex gap-4 text-center">
            <MiniStat icon="🔥" value={streak} label="Streak" color="text-orange-500" />
            <MiniStat icon="🧊" value={freezeCount} label="Freezes" color="text-ice-600" />
            <MiniStat icon="⭐" value={xpTotal} label="XP" color="text-gold-600" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-brand-500 to-brand-600 text-white flex flex-col gap-2">
          <p className="text-brand-100 font-bold uppercase text-xs tracking-wide">Over deze cursus</p>
          <p>
            Bij elke aflevering van de{" "}
            <span className="font-extrabold">Geloof je dat ook?</span> podcast horen twee korte oefenrondes: één
            over de inhoud van de aflevering, en één die de brug slaat naar het Boek van Mormon.
          </p>
          <Link href="/courses" className="text-brand-100 text-xs font-bold underline underline-offset-2 self-start">
            Wissel cursus
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {episodes.length === 0 && (
          <p className="text-slate-400 dark:text-slate-500">Er zijn nog geen afleveringen beschikbaar.</p>
        )}
        {episodes.map((episode) => (
          <div key={episode.id} className="card flex flex-col gap-3 max-w-xl">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="font-extrabold text-lg dark:text-slate-100">
                🎙️ Aflevering {episode.number} — {episode.title}
              </h2>
              {episode.listenUrl && (
                <a
                  href={episode.listenUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-brand-600 dark:text-brand-300 underline underline-offset-2"
                >
                  Beluister deze aflevering ↗
                </a>
              )}
            </div>
            {episode.summary && <p className="text-sm text-slate-500 dark:text-slate-400">{episode.summary}</p>}
            <div className="flex gap-3 flex-wrap">
              <Link
                href={`/podcast/${episode.id}/CONTENT`}
                className={`btn flex-1 min-w-[220px] border-2 ${
                  episode.contentCompleted
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600"
                }`}
              >
                {episode.contentCompleted ? "✓ " : ""}Inhoud van de aflevering
                {episode.contentBestScore !== null ? ` · ${episode.contentBestScore}%` : ""}
              </Link>
              <Link
                href={`/podcast/${episode.id}/BOM_CONNECTION`}
                className={`btn flex-1 min-w-[220px] border-2 ${
                  episode.bomCompleted
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600"
                }`}
              >
                {episode.bomCompleted ? "✓ " : ""}Verband met het Boek van Mormon
                {episode.bomBestScore !== null ? ` · ${episode.bomBestScore}%` : ""}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniStat({ icon, value, label, color }: { icon: string; value: number; label: string; color: string }) {
  return (
    <div>
      <div className={`text-2xl font-extrabold ${color}`}>
        {icon} {value}
      </div>
      <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">{label}</div>
    </div>
  );
}
