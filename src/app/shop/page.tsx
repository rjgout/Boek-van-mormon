import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import ShopClient from "@/components/ShopClient";

export default async function ShopPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <ShopClient />;
}
