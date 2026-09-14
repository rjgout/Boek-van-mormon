import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getStreakOverview } from "@/lib/streakCalendar";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const yearParam = searchParams.get("year");
  const monthParam = searchParams.get("month");
  const year = yearParam !== null ? Number(yearParam) : undefined;
  const month = monthParam !== null ? Number(monthParam) : undefined;
  if (year !== undefined && !Number.isInteger(year)) {
    return NextResponse.json({ error: "Ongeldig jaar" }, { status: 400 });
  }
  if (month !== undefined && (!Number.isInteger(month) || month < 1 || month > 12)) {
    return NextResponse.json({ error: "Ongeldige maand" }, { status: 400 });
  }

  const overview = await getStreakOverview(user.id, year, month);
  return NextResponse.json(overview);
}
