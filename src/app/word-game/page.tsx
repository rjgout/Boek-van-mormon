import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import WordGameClient from "@/components/WordGameClient";

export default async function WordGamePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <WordGameClient />;
}
