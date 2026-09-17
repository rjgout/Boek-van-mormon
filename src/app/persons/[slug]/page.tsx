import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export default async function PersonProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { slug } = await params;
  const person = await prisma.person.findUnique({
    where: { slug },
    include: {
      father: { select: { slug: true, name: true } },
      children: { select: { slug: true, name: true } },
    },
  });
  if (!person) redirect("/courses");

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">{person.name}</h1>
      </div>

      {person.description && <p className="text-lg leading-relaxed dark:text-slate-100">{person.description}</p>}

      {(person.father || person.children.length > 0) && (
        <div className="card flex flex-col gap-3">
          {person.father && (
            <p className="dark:text-slate-100">
              Vader: <Link href={`/persons/${person.father.slug}`} className="font-extrabold text-brand-600 dark:text-brand-300">{person.father.name}</Link>
            </p>
          )}
          {person.children.length > 0 && (
            <p className="dark:text-slate-100">
              Kinderen:{" "}
              {person.children.map((c, i) => (
                <span key={c.slug}>
                  <Link href={`/persons/${c.slug}`} className="font-extrabold text-brand-600 dark:text-brand-300">
                    {c.name}
                  </Link>
                  {i < person.children.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          )}
        </div>
      )}

      <Link href="/courses" className="btn-secondary self-start">
        ← Terug
      </Link>
    </div>
  );
}
