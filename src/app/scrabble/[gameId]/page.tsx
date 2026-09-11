import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import ScrabbleBoardClient from "@/components/ScrabbleBoardClient";

export default async function ScrabbleGamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { gameId } = await params;
  return <ScrabbleBoardClient gameId={gameId} />;
}
