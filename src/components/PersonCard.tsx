"use client";

import { useState } from "react";
import Link from "next/link";

interface PersonInfo {
  slug: string;
  name: string;
  description: string | null;
  father: { slug: string; name: string } | null;
  children: { slug: string; name: string }[];
}

/**
 * "Tik op een naam"-kaartje — leest live uit de Person-tabel via
 * /api/persons/[slug] (dus altijd in sync, nooit een gekopieerde
 * beschrijving in de lescontent zelf). Gebruikt <details>/<summary>, net als
 * andere uitklapbare kaartjes elders in de app (bv. PodcastCourseView) —
 * geen nieuwe tooltip-library nodig, en werkt vanzelf ook met toetsenbord/
 * schermlezers.
 */
export default function PersonCard({ slug, name }: { slug: string; name: string }) {
  const [info, setInfo] = useState<PersonInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);

  function onToggle(e: React.SyntheticEvent<HTMLDetailsElement>) {
    const isOpen = e.currentTarget.open;
    if (isOpen && !opened) {
      setOpened(true);
      setLoading(true);
      fetch(`/api/persons/${slug}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => setInfo(data))
        .finally(() => setLoading(false));
    }
  }

  return (
    <details
      className="group inline-block align-baseline"
      onToggle={onToggle}
    >
      <summary className="cursor-pointer select-none list-none font-extrabold text-brand-700 dark:text-brand-300 underline decoration-dotted underline-offset-4">
        {name}
      </summary>
      <div className="mt-2 card !p-4 max-w-xs text-sm flex flex-col gap-2 animate-pop">
        {loading && <p className="text-slate-400 dark:text-slate-500">Laden...</p>}
        {!loading && info && (
          <>
            <p className="font-extrabold dark:text-slate-100">{info.name}</p>
            {info.description && <p className="text-slate-600 dark:text-slate-300">{info.description}</p>}
            <Link href={`/persons/${info.slug}`} className="text-brand-600 dark:text-brand-300 font-bold text-xs">
              Meer over {info.name} →
            </Link>
          </>
        )}
        {!loading && !info && <p className="text-slate-400 dark:text-slate-500">Niet gevonden.</p>}
      </div>
    </details>
  );
}
