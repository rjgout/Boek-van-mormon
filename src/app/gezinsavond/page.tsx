import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import FamilyGameSetupClient from "@/components/FamilyGameSetupClient";

export default async function GezinsavondPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <FamilyGameSetupClient />;
}
