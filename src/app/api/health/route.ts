import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Gebruikt door de Docker HEALTHCHECK van jehova-app. Controleert de database
// (kritiek: de app kan niet functioneren zonder), en rapporteert Redis
// informatief (niet kritiek: de live-quiz werkt gedegradeerd zonder).
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    return NextResponse.json(
      { status: "error", database: "unreachable", error: error instanceof Error ? error.message : String(error) },
      { status: 503 }
    );
  }

  return NextResponse.json({
    status: "ok",
    database: "ok",
    redisConfigured: Boolean(process.env.REDIS_URL),
  });
}
