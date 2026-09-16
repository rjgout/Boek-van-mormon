import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import XpHistoryClient from "@/components/XpHistoryClient";

export default async function XpPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <XpHistoryClient />;
}
