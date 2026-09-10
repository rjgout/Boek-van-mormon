import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { createSessionToken, hashPassword, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { generateDiscriminator, formatTag, HANDLE_REGEX, HANDLE_MIN_LENGTH, HANDLE_MAX_LENGTH } from "@/lib/handle";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Vul een geldig e-mailadres in."),
  handle: z
    .string()
    .trim()
    .min(HANDLE_MIN_LENGTH, `Gebruikersnaam moet minstens ${HANDLE_MIN_LENGTH} tekens zijn.`)
    .max(HANDLE_MAX_LENGTH, `Gebruikersnaam mag maximaal ${HANDLE_MAX_LENGTH} tekens zijn.`)
    .regex(HANDLE_REGEX, "Alleen letters, cijfers, spaties, - en _ toegestaan."),
  displayName: z.string().trim().min(1, "Vul een naam in.").max(40),
  password: z.string().min(8, "Wachtwoord moet minstens 8 tekens zijn."),
});

const MAX_DISCRIMINATOR_ATTEMPTS = 25;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { email, handle, displayName, password } = parsed.data;

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return NextResponse.json({ error: "Dit e-mailadres is al in gebruik." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  // handle+discriminator is uniek, handle alleen niet — bij een botsing
  // (zeldzaam: 1 op 100.000 voor exact dezelfde combinatie) proberen we
  // gewoon een nieuw willekeurig nummer.
  for (let attempt = 0; attempt < MAX_DISCRIMINATOR_ATTEMPTS; attempt++) {
    const discriminator = generateDiscriminator();
    try {
      const user = await prisma.user.create({
        data: { email, handle, discriminator, displayName, passwordHash },
      });
      const token = await createSessionToken(user.id);
      const res = NextResponse.json({ id: user.id, tag: formatTag(user.handle, user.discriminator) });
      res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
      return res;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        continue; // discriminator-botsing voor deze handle, probeer opnieuw
      }
      throw e;
    }
  }

  return NextResponse.json(
    { error: "Kon geen unieke gebruikersnaam aanmaken, probeer een andere gebruikersnaam." },
    { status: 409 }
  );
}
