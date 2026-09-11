import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import CoursesClient from "@/components/CoursesClient";

export default async function CoursesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <CoursesClient />;
}
