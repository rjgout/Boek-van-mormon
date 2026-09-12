import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import CoursesClient from "@/components/CoursesClient";
import ActiveGamesBanner from "@/components/ActiveGamesBanner";

export default async function CoursesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-2xl mx-auto w-full">
        <ActiveGamesBanner />
      </div>
      <CoursesClient />
    </div>
  );
}
