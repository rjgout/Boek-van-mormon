import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import ChapterGuessSoloClient from "@/components/ChapterGuessSoloClient";

export default async function ChapterGuessSoloPage({ params }: { params: Promise<{ gameId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { gameId } = await params;
  return <ChapterGuessSoloClient gameId={gameId} />;
}
