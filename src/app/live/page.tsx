import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import LiveLobbyForm from "@/components/LiveLobbyForm";

export default async function LivePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <LiveLobbyForm />;
}
