import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import ChapterGuessSetupClient from "@/components/ChapterGuessSetupClient";

export default async function ChapterGuessPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <ChapterGuessSetupClient />;
}
