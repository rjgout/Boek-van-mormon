import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { sendTestMail } from "@/lib/email";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

  const result = await sendTestMail(user.email);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });

  return NextResponse.json({ ok: true });
}
