import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getDeployStatus, isDeployAgentConfigured } from "@/lib/deployAgent";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  if (!isDeployAgentConfigured()) return NextResponse.json({ error: "Deploy-agent niet geconfigureerd" }, { status: 501 });

  try {
    const { status, body } = await getDeployStatus();
    return NextResponse.json(body, { status });
  } catch {
    return NextResponse.json({ error: "Kon de deploy-agent niet bereiken" }, { status: 502 });
  }
}
