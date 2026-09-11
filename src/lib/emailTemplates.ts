import { APP_NAME } from "@/lib/brand";

function wrap(bodyHtml: string): string {
  return `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1f2937">
    <h1 style="color:#166534;font-size:20px">${APP_NAME}</h1>
    ${bodyHtml}
    <p style="color:#9ca3af;font-size:12px;margin-top:32px">Deze e-mail is automatisch verstuurd — reageren heeft geen zin.</p>
  </div>`;
}

export function verifyEmailTemplate(link: string) {
  return {
    subject: `${APP_NAME} — bevestig je account`,
    html: wrap(
      `<p>Bedankt voor je registratie! Klik op onderstaande link om je account te bevestigen:</p>
       <p><a href="${link}" style="background:#16a34a;color:#fff;padding:10px 20px;border-radius:10px;text-decoration:none;font-weight:bold">Account bevestigen</a></p>
       <p style="color:#6b7280;font-size:13px">Werkt de knop niet? Kopieer deze link: ${link}</p>
       <p style="color:#6b7280;font-size:13px">Deze link is 24 uur geldig.</p>`
    ),
    text: `Bevestig je account via: ${link} (24 uur geldig)`,
  };
}

export function resetPasswordTemplate(link: string) {
  return {
    subject: `${APP_NAME} — wachtwoord resetten`,
    html: wrap(
      `<p>Je hebt een wachtwoordreset aangevraagd. Klik op onderstaande link om een nieuw wachtwoord te kiezen:</p>
       <p><a href="${link}" style="background:#16a34a;color:#fff;padding:10px 20px;border-radius:10px;text-decoration:none;font-weight:bold">Nieuw wachtwoord instellen</a></p>
       <p style="color:#6b7280;font-size:13px">Werkt de knop niet? Kopieer deze link: ${link}</p>
       <p style="color:#6b7280;font-size:13px">Deze link is 1 uur geldig. Heb je dit niet aangevraagd, dan kan je deze e-mail negeren.</p>`
    ),
    text: `Stel een nieuw wachtwoord in via: ${link} (1 uur geldig, negeer deze mail als je dit niet was)`,
  };
}
