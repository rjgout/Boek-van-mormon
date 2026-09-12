import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

  const reports = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { displayName: true, email: true, handle: true, discriminator: true } } },
  });

  return NextResponse.json({ reports });
}
