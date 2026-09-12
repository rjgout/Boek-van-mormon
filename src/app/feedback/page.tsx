import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import FeedbackClient from "@/components/FeedbackClient";

export default async function FeedbackPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <FeedbackClient />;
}
