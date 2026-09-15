import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getGameSettings } from "@/lib/gameSettings";
import LiveLobbyForm from "@/components/LiveLobbyForm";

export default async function LivePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const settings = await getGameSettings();
  return <LiveLobbyForm settings={settings} isAdmin={user.isAdmin} />;
}
