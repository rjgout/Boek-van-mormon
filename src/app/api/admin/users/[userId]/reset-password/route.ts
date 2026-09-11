import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { hashPassword } from "@/lib/auth";

// Leesbaar tijdelijk wachtwoord: geen 0/O/1/l/I (makkelijk te verwarren bij
// mondeling/chat doorgeven).
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

function generateTempPassword(length = 12): string {
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

// Er is bewust geen "wachtwoord vergeten"-e-mailflow (dit is een self-hosted
// app zonder verplichte SMTP-configuratie). In plaats daarvan genereert een
// admin hier een eenmalig tijdelijk wachtwoord dat hij/zij zelf doorgeeft aan
// de gebruiker; die moet er bij de eerstvolgende login direct een eigen
// wachtwoord voor kiezen (mustChangePassword, afgedwongen in dashboard/page.tsx).
export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const admin = await getCurrentUser();
  if (!admin) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!admin.isAdmin) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

  const { userId } = await params;
  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash, mustChangePassword: true },
  });

  // Dit is de ENIGE keer dat dit wachtwoord ergens leesbaar is — er wordt
  // niets van opgeslagen buiten de (gehashte) database-kolom.
  return NextResponse.json({ tempPassword });
}
