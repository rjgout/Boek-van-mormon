// Dunne doorgeefluis naar de deploy-agent (zie deploy/agent/server.js) — die
// heeft via de Docker-socket toegang om jehova-app daadwerkelijk te
// vervangen, dit bestand praat er alleen mee over het interne
// Docker-netwerk. Zonder DEPLOY_AGENT_URL (bv. lokale ontwikkeling, of de
// generieke self-host-opzet in de hoofd-docker-compose.yml, die geen
// registry-image pullt) is deze functionaliteit gewoon niet beschikbaar —
// /adminbackend toont dan geen deploypaneel, zie AdminDeployClient.tsx.
export function isDeployAgentConfigured(): boolean {
  return Boolean(process.env.DEPLOY_AGENT_URL?.trim() && process.env.DEPLOY_AGENT_TOKEN?.trim());
}

async function callAgent(path: string, method: "GET" | "POST"): Promise<{ status: number; body: unknown }> {
  const url = process.env.DEPLOY_AGENT_URL?.trim();
  const token = process.env.DEPLOY_AGENT_TOKEN?.trim();
  if (!url || !token) throw new Error("DEPLOY_AGENT_URL/DEPLOY_AGENT_TOKEN niet geconfigureerd.");

  const res = await fetch(`${url}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

export function getDeployStatus() {
  return callAgent("/status", "GET");
}
export function startDeploy() {
  return callAgent("/deploy", "POST");
}
export function setMaintenanceMode(on: boolean) {
  return callAgent(on ? "/maintenance/on" : "/maintenance/off", "POST");
}
export function triggerRollback() {
  return callAgent("/rollback", "POST");
}
