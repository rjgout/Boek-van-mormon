import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import AdminUsersClient from "@/components/AdminUsersClient";

export default async function AdminBackendPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.isAdmin) redirect("/dashboard");

  const [users, userCount, bookCount, chapterCount, exerciseCount] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        email: true,
        handle: true,
        discriminator: true,
        displayName: true,
        isAdmin: true,
        xpTotal: true,
        currentStreak: true,
        createdAt: true,
      },
    }),
    prisma.user.count(),
    prisma.book.count(),
    prisma.chapter.count(),
    prisma.exercise.count(),
  ]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Adminbeheer</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Alleen zichtbaar voor accounts met adminrechten.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Gebruikers" value={userCount} />
        <StatCard label="Boeken" value={bookCount} />
        <StatCard label="Hoofdstukken" value={chapterCount} />
        <StatCard label="Oefeningen" value={exerciseCount} />
      </div>

      <AdminUsersClient
        initialUsers={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))}
        currentUserId={user.id}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card text-center py-4">
      <div className="text-2xl font-extrabold text-brand-700 dark:text-brand-300">{value}</div>
      <div className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">{label}</div>
    </div>
  );
}
