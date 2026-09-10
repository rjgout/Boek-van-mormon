import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSessionToken, hashPassword, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Vul een geldig e-mailadres in."),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Gebruikersnaam moet minstens 3 tekens zijn.")
    .max(20, "Gebruikersnaam mag maximaal 20 tekens zijn.")
    .regex(/^[a-z0-9_]+$/, "Alleen letters, cijfers en underscores toegestaan."),
  displayName: z.string().trim().min(1, "Vul een naam in.").max(40),
  password: z.string().min(8, "Wachtwoord moet minstens 8 tekens zijn."),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { email, username, displayName, password } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Dit e-mailadres of deze gebruikersnaam is al in gebruik." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, username, displayName, passwordHash },
  });

  const token = await createSessionToken(user.id);
  const res = NextResponse.json({ id: user.id, username: user.username });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
