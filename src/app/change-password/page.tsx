import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import ChangePasswordClient from "@/components/ChangePasswordClient";

export default async function ChangePasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <ChangePasswordClient forced={user.mustChangePassword} />;
}
