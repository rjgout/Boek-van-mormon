// Voorkomt een flits van het verkeerde thema: dit script draait vóór React
// hydrateert en zet de 'dark' class direct op <html> op basis van de
// opgeslagen voorkeur (of het systeemthema als er nog geen voorkeur is).
const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('bom-theme');
    var isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {}
})();
`;

export default function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
