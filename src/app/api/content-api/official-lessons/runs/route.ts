import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyContentApiKey } from "@/lib/contentApi";

/** Geschiedenis van importruns (zie officialContentImport.ts), meest recente eerst. */
export async function GET(req: NextRequest) {
  if (!verifyContentApiKey(req)) {
    return NextResponse.json({ error: "Ongeldige of ontbrekende API-sleutel." }, { status: 401 });
  }

  const runs = await prisma.officialContentImportRun.findMany({
    orderBy: { startedAt: "desc" },
    take: 20,
  });

  return NextResponse.json({
    ok: true,
    runs: runs.map((r) => ({ ...r, errors: r.errors ? JSON.parse(r.errors) : [] })),
  });
}
