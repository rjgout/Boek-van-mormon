import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getDictionaryEntries } from "@/lib/dictionary";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  return NextResponse.json({ entries: getDictionaryEntries() });
}
