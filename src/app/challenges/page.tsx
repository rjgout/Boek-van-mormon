import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import ChallengesClient from "@/components/ChallengesClient";

export default async function ChallengesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <Suspense fallback={<p className="text-slate-400 dark:text-slate-500">Laden...</p>}>
      <ChallengesClient />
    </Suspense>
  );
}
