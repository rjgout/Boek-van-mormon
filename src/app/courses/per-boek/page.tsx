import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import PerBookClient from "@/components/PerBookClient";

export default async function PerBookPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <PerBookClient />;
}
