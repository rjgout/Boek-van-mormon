import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

const PAGE_SIZE = 30;

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const skipParam = searchParams.get("skip");
  const skip = skipParam !== null ? Number(skipParam) : 0;
  if (!Number.isInteger(skip) || skip < 0) {
    return NextResponse.json({ error: "Ongeldige skip-waarde" }, { status: 400 });
  }

  const transactions = await prisma.xPTransaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    skip,
    take: PAGE_SIZE + 1,
  });

  const hasMore = transactions.length > PAGE_SIZE;
  return NextResponse.json({
    transactions: transactions.slice(0, PAGE_SIZE),
    hasMore,
    xpTotal: user.xpTotal,
  });
}
