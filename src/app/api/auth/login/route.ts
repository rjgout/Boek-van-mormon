import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSessionToken, verifyPassword, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

const schema = z.object({
  identifier: z.string().trim().toLowerCase().min(1, "Vul je e-mailadres of gebruikersnaam in."),
  password: z.string().min(1, "Vul je wachtwoord in."),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { identifier, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { username: identifier }] },
  });

  const genericError = { error: "Onjuiste inloggegevens." };
  if (!user) {
    return NextResponse.json(genericError, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json(genericError, { status: 401 });
  }

  const token = await createSessionToken(user.id);
  const res = NextResponse.json({ id: user.id, username: user.username });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
