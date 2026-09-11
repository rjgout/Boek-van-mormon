import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import ScrabbleListClient from "@/components/ScrabbleListClient";

export default async function ScrabblePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <Suspense fallback={<p className="text-slate-400 dark:text-slate-500">Laden...</p>}>
      <ScrabbleListClient />
    </Suspense>
  );
}
