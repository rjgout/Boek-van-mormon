import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export default async function PersonsToolPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const persons = await prisma.person.findMany({
    orderBy: { name: "asc" },
    include: {
      father: { select: { slug: true, name: true } },
      children: { select: { slug: true, name: true }, orderBy: { name: "asc" } },
    },
  });

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <Link href="/tools" className="text-sm font-bold text-brand-600 dark:text-brand-300 hover:underline">
          ← Hulpmiddelen
        </Link>
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300 mt-1">👤 Personages</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Wie is wie in het Boek van Mormon — inclusief familieverbanden. Dezelfde gegevens als de
          &ldquo;tik op een naam&rdquo;-kaartjes in de introductiecursus.
        </p>
      </div>

      {persons.length === 0 && <p className="text-slate-400 dark:text-slate-500">Nog geen personages beschikbaar.</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        {persons.map((person) => (
          <div
            key={person.slug}
            id={person.slug}
            className="card flex flex-col gap-2 scroll-mt-24 target:ring-2 target:ring-brand-400"
          >
            <h2 className="font-extrabold text-lg text-brand-700 dark:text-brand-300">{person.name}</h2>
            {person.description && <p className="text-sm text-slate-600 dark:text-slate-300">{person.description}</p>}

            {(person.father || person.children.length > 0) && (
              <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-2 mt-1">
                {person.father && (
                  <p>
                    Vader:{" "}
                    <a href={`#${person.father.slug}`} className="font-bold text-brand-600 dark:text-brand-300 hover:underline">
                      {person.father.name}
                    </a>
                  </p>
                )}
                {person.children.length > 0 && (
                  <p>
                    Kinderen:{" "}
                    {person.children.map((c, i) => (
                      <span key={c.slug}>
                        <a href={`#${c.slug}`} className="font-bold text-brand-600 dark:text-brand-300 hover:underline">
                          {c.name}
                        </a>
                        {i < person.children.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
