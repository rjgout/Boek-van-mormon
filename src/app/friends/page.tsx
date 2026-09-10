import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import FriendsClient from "@/components/FriendsClient";

export default async function FriendsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <FriendsClient />;
}
