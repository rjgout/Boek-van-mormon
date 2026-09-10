import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import LeaderboardClient from "@/components/LeaderboardClient";

export default async function CompetitionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <LeaderboardClient />;
}
