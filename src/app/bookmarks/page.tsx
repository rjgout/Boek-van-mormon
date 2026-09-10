import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import BookmarksClient from "@/components/BookmarksClient";

export default async function BookmarksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <BookmarksClient />;
}
