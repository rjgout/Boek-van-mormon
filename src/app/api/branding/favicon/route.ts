import { NextRequest, NextResponse } from "next/server";
import { getBranding } from "@/lib/branding";

// Publieke route (geen auth) die het door de admin ingestelde favicon
// serveert als binair beeld met het juiste Content-Type — een <link
// rel="icon"> kan niet rechtstreeks naar een data-URL uit de database
// wijzen op een manier die browsers betrouwbaar verversen, dus dit is de
// tussenlaag (zie generateMetadata in layout.tsx). Zonder eigen favicon
// wordt gewoon doorverwezen naar het standaardbestand.
export async function GET(req: NextRequest) {
  const { faviconDataUrl } = await getBranding();
  const match = faviconDataUrl ? /^data:([^;]+);base64,(.+)$/.exec(faviconDataUrl) : null;
  if (!match) {
    return NextResponse.redirect(new URL("/favicon.ico", req.nextUrl.origin));
  }
  const [, contentType, base64] = match;

  return new NextResponse(Buffer.from(base64, "base64"), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300",
    },
  });
}
