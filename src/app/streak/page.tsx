import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import StreakClient from "@/components/StreakClient";

export default async function StreakPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <StreakClient />;
}
