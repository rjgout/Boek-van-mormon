import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import DictionaryClient from "@/components/DictionaryClient";

export default async function DictionaryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <DictionaryClient />;
}
