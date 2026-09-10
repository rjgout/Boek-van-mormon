export default function CookiesPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 dark:text-slate-200">
      <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">Cookiebeleid</h1>

      <p>
        Deze website gebruikt uitsluitend <strong>functioneel noodzakelijke</strong> cookies — er is dus geen
        toestemmingsbanner nodig volgens de ePrivacy-richtlijn/AVG, die alleen vereist is voor niet-noodzakelijke
        cookies (zoals tracking of advertenties). We gebruiken geen analytics- of advertentiecookies.
      </p>

      <h2 className="font-extrabold text-lg mt-2">Welke cookie gebruiken we?</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b border-slate-200 dark:border-slate-700">
            <th className="py-2 pr-4">Naam</th>
            <th className="py-2 pr-4">Doel</th>
            <th className="py-2">Bewaartermijn</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <td className="py-2 pr-4 font-mono text-xs">bvm_session</td>
            <td className="py-2 pr-4">Houdt je ingelogd (sessiebeheer). Noodzakelijk voor de werking van de site.</td>
            <td className="py-2">30 dagen, of tot je uitlogt</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-2">
        Mocht dat in de toekomst veranderen (bijvoorbeeld door analytics toe te voegen), dan werken we dit beleid
        bij en vragen we waar wettelijk vereist eerst je toestemming.
      </p>
    </div>
  );
}
