import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { setMaintenanceMode, isDeployAgentConfigured } from "@/lib/deployAgent";

const schema = z.object({ on: z.boolean() });

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  if (!isDeployAgentConfigured()) return NextResponse.json({ error: "Deploy-agent niet geconfigureerd" }, { status: 501 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Ongeldige invoer" }, { status: 400 });

  try {
    const { status, body } = await setMaintenanceMode(parsed.data.on);
    return NextResponse.json(body, { status });
  } catch {
    return NextResponse.json({ error: "Kon de deploy-agent niet bereiken" }, { status: 502 });
  }
}
