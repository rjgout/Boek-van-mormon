import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getOrCreateTodayGame } from "@/lib/wordGame";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const view = await getOrCreateTodayGame(user.id);
  return NextResponse.json(view);
}
