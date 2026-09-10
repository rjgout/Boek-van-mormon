import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import GameRoom from "@/components/GameRoom";

export default async function LiveGamePage({ params }: { params: Promise<{ code: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { code } = await params;
  return <GameRoom code={code.toUpperCase()} myUserId={user.id} />;
}
