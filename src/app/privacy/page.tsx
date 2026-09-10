export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 dark:text-slate-200">
      <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Privacybeleid</h1>

      <p>
        Deze website is een onafhankelijk, niet-commercieel initiatief en wordt niet gesponsord, ondersteund,
        goedgekeurd of onderhouden door The Church of Jesus Christ of Latter-day Saints.
      </p>

      <h2 className="font-extrabold text-lg mt-2">Welke gegevens verwerken we?</h2>
      <ul className="list-disc pl-5 flex flex-col gap-1">
        <li>Accountgegevens: e-mailadres, gebruikersnaam, naam, wachtwoord (versleuteld opgeslagen).</li>
        <li>Leesvoortgang, quizresultaten, XP, streaks en streak freezes.</li>
        <li>Vriendschapsrelaties (wie je toevoegt/accepteert).</li>
        <li>Bladwijzers, highlights en notities die je zelf toevoegt bij verzen.</li>
        <li>Resultaten van live-spellen die je speelt.</li>
      </ul>

      <h2 className="font-extrabold text-lg mt-2">Waarvoor gebruiken we deze gegevens?</h2>
      <p>
        Uitsluitend om de functionaliteit van de app te leveren: inloggen, je voortgang bijhouden, de
        competitie- en vriendenfuncties laten werken, en de live-quiz mogelijk te maken. We gebruiken geen
        trackers of advertentienetwerken en verkopen geen gegevens aan derden.
      </p>

      <h2 className="font-extrabold text-lg mt-2">Hoe lang bewaren we gegevens?</h2>
      <p>Zolang je een account hebt. Verwijder je je account, dan verwijderen we al je gegevens direct.</p>

      <h2 className="font-extrabold text-lg mt-2">Jouw rechten</h2>
      <p>
        Je kan je account en alle bijbehorende gegevens op elk moment zelf verwijderen via je{" "}
        <a href="/profile" className="underline text-brand-600 dark:text-brand-300">
          profielpagina
        </a>
        . Wil je een export van je gegevens, neem dan contact op met de beheerder van deze instantie.
      </p>

      <h2 className="font-extrabold text-lg mt-2">Cookies</h2>
      <p>
        Zie ons{" "}
        <a href="/cookies" className="underline text-brand-600 dark:text-brand-300">
          cookiebeleid
        </a>{" "}
        voor meer informatie.
      </p>
    </div>
  );
}
