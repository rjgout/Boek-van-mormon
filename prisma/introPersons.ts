// Personen voor de introductiecursus (zie prisma/introContent.ts) en de
// "tik op een naam"-kaartjes daarin. Beschrijvingen zijn bewust feitelijk/
// verhalend (wie, familie, wat ze deden) en geen theologisch commentaar —
// getoetst aan de echte tekst (zie bv. 1 Nephi 1:4 en 2:2-5 voor Lehi's
// gezin) via een kort python3/node-scriptje, net als bij de podcast-
// Boek van Mormon-koppelingen. fatherSlug verwijst naar een andere entry
// hieronder (of null); prisma/importIntro.ts lost dit op naar Person.fatherId.

export interface IntroPersonSeed {
  slug: string;
  name: string;
  description: string;
  gender?: "man" | "vrouw";
  fatherSlug?: string;
  motherSlug?: string;
}

export const introPersons: IntroPersonSeed[] = [
  // Familie van Lehi
  {
    slug: "lehi",
    name: "Lehi",
    description:
      "Woonde met zijn gezin in Jeruzalem. Kreeg de opdracht om, vlak voordat de stad zou worden verwoest, met " +
      "zijn familie de wildernis in te trekken. Vader van Laman, Lemuel, Sam, Nephi, Jakob en Jozef.",
    gender: "man",
  },
  {
    slug: "sariah",
    name: "Sariah",
    description: "De vrouw van Lehi en moeder van hun kinderen. Trok samen met het gezin de wildernis in.",
    gender: "vrouw",
  },
  {
    slug: "laman",
    name: "Laman",
    description: "De oudste zoon van Lehi en Sariah. Rebelde tegen Gods plan en voerde de Lamaniten aan.",
    gender: "man",
    fatherSlug: "lehi",
    motherSlug: "sariah",
  },
  {
    slug: "lemuel",
    name: "Lemuel",
    description: "Zoon van Lehi en Sariah, jonger dan Laman. Sloot zich aan bij de opstandige groep van Laman.",
    gender: "man",
    fatherSlug: "lehi",
    motherSlug: "sariah",
  },
  {
    slug: "sam",
    name: "Sam",
    description:
      "Zoon van Lehi en Sariah. Ondersteunde Nephi in zijn rechtschapenheid en volgde het plan van God.",
    gender: "man",
    fatherSlug: "lehi",
    motherSlug: "sariah",
  },
  {
    slug: "nephi",
    name: "Nephi",
    description:
      "Jongste van de vier oudste zonen van Lehi en Sariah. Schrijft zelf het eerste boek van het Boek van " +
      "Mormon, en vertelt daarin het verhaal van zijn familie. Stichtte de Nephietische civilisatie.",
    gender: "man",
    fatherSlug: "lehi",
    motherSlug: "sariah",
  },
  {
    slug: "jakob",
    name: "Jakob",
    description:
      "Zoon van Lehi en Sariah, geboren in de wildernis. Schrijver van het tweede boek van het Boek van Mormon.",
    gender: "man",
    fatherSlug: "lehi",
    motherSlug: "sariah",
  },
  {
    slug: "jozef",
    name: "Jozef",
    description: "Jongste zoon van Lehi en Sariah, eveneens geboren in de wildernis.",
    gender: "man",
    fatherSlug: "lehi",
    motherSlug: "sariah",
  },

  // Centrale figuren later in het Boek van Mormon
  {
    slug: "mormon",
    name: "Mormon",
    description:
      "Bracht, veel later in de geschiedenis, de verslagen van eerdere schrijvers samen en maakte er een " +
      "samenvatting van — het grootste deel van het Boek van Mormon is zijn werk. Vader van Moroni.",
    gender: "man",
  },
  {
    slug: "moroni",
    name: "Moroni",
    description:
      "De zoon van Mormon. Maakte het boek af nadat zijn vader was overleden, en voegde er zelf nog een deel aan toe.",
    gender: "man",
    fatherSlug: "mormon",
  },
  {
    slug: "alma",
    name: "Alma",
    description:
      "Werd door zijn vader (die ook al Alma heette) gewijd tot hogepriester, en predikte daarna door het hele " +
      "land — te beginnen in de stad Zarahemla. Leeft veel later dan Lehi's gezin.",
    gender: "man",
  },
  {
    slug: "alma-de-jongere",
    name: "Alma de Jongere",
    description: "Zoon van Alma de Oudere. Wordt eerst tot zonde verleid, maar keert zich later tot God.",
    gender: "man",
    fatherSlug: "alma",
  },
  {
    slug: "samuel-de-lamaniet",
    name: "Samuel de Lamaniet",
    description:
      "Een Lamaniet die naar de stad Zarahemla kwam om tot de Nephieten te prediken. Toen ze hem niet binnen " +
      "wilden laten, klom hij op de stadsmuur en riep zijn boodschap vandaar.",
    gender: "man",
  },
  {
    slug: "abinadi",
    name: "Abinadi",
    description:
      "Een profeet die tegen koning Noe en zijn priesterschap predikte. Werd ter dood veroordeeld voor zijn boodschap.",
    gender: "man",
  },
  {
    slug: "amaleki",
    name: "Amaleki",
    description: "Een Nephiet die aansloot bij het volk van Limhi en later naar Zarahemla reisde.",
    gender: "man",
  },
  {
    slug: "ammon",
    name: "Ammon",
    description:
      "Zendelingverkondiger die tot de Lamaniten ging. Toonde grote moed en geloof in zijn missie onder het volk van Lamoni.",
    gender: "man",
  },
  {
    slug: "aaron",
    name: "Aaron",
    description:
      "Broer van Ammon. Ook zendeling onder de Lamaniten. Predikte het evangelie ondanks veel tegenstand.",
    gender: "man",
  },
  {
    slug: "mosiah",
    name: "Mosiah",
    description: "Koning der Nephieten. Leidde zijn volk naar de stad Zarahemla en gaf hen rechtschapenheid.",
    gender: "man",
  },
  {
    slug: "benjamin",
    name: "Benjamin",
    description: "Een rechtschapen koning der Nephieten die zijn volk verenigde en hen zijn kostbare woorden gaf.",
    gender: "man",
  },
  {
    slug: "lamoni",
    name: "Lamoni",
    description:
      "Een Lamaniëtische koning die tot het geloof werd gebracht door Ammon. Zijn hart veranderde van hoop voor zijn volk.",
    gender: "man",
  },
  {
    slug: "anti-nephi-lehi",
    name: "Anti-Nephi-Lehi",
    description:
      "Een Lamaniëtische koning die zich tot God wendde en zijn volk van veel zonden bevrijd. Stierf samen met veel van zijn volk " +
      "om hun verbond te bewaren.",
    gender: "man",
  },
  {
    slug: "amulek",
    name: "Amulek",
    description:
      "Een man van Zarahemla die naast Alma predikte en tegen de priesterschap van Noe sprak. Werd vervolgd vanwege zijn getuigenis.",
    gender: "man",
  },
  {
    slug: "helaman",
    name: "Helaman",
    description:
      "Zoon van Alma de Jongere. Leidde een groep jonge Nephieten in de slag en bewees zich een rechtschapen bevelhebber.",
    gender: "man",
    fatherSlug: "alma-de-jongere",
  },
  {
    slug: "teancum",
    name: "Teancum",
    description:
      "Een Nephietische bevelhebber die dapper tegen de Lamanieten en tegen Amalickiah streed. Een man van groot vertrouwen.",
    gender: "man",
  },
  {
    slug: "amalickiah",
    name: "Amalickiah",
    description:
      "Een ambistieuze Nephiet die zich tegen Moroni verzette en naar de Lamanieten vluchtte. Werd daar een machtige koning.",
    gender: "man",
  },
  {
    slug: "moroni-bevelhebber",
    name: "Moroni (bevelhebber)",
    description:
      "Een rechtschapen Nephietische bevelhebber die tegen Amalickiah en de Lamanieten streed. Volledig gewijd aan Gods volk.",
    gender: "man",
  },
  {
    slug: "korihor",
    name: "Korihor",
    description:
      "Een antichrist-profeet die tegen de kerken predikte en gezegd werd dat er geen Christus zou komen. " +
      "Werd gedwongen te zwijgen en vertreden.",
    gender: "man",
  },
  {
    slug: "sherem",
    name: "Sherem",
    description:
      "Een antichrist-leraar die Jakob uitdaagde over de komst van Christus. Werd door Gods macht voorgoed dood geslagen.",
    gender: "man",
  },

  // Vroege Nephieten rond Lehi's tijd
  {
    slug: "laban",
    name: "Laban",
    description:
      "Een welgestelde man in Jeruzalem die de gouden platen bezat. Nephi diende hem en haalde uiteindelijk de platen weg.",
    gender: "man",
  },
  {
    slug: "ishmael",
    name: "Ishmael",
    description: "Een man van Jeruzalem wiens gezin zich bij Lehi aansloot in de wildernis. Vader van vrouwen die met de zonen van Lehi trouwden.",
    gender: "man",
  },
  {
    slug: "zoram",
    name: "Zoram",
    description:
      "Een knecht van Laban die zich bij Nephi aansloot. Trouwde met een dochter van Ishmael.",
    gender: "man",
  },
  {
    slug: "brother-of-jared",
    name: "Broer van Jared",
    description:
      "Leidt de Jaredische groep naar Amerika. Zag Gods vinger en sprak met Jezus Christus in een droom.",
    gender: "man",
  },

  // Koninklijke huizen en Nephiet-leiders
  {
    slug: "mulek",
    name: "Mulek",
    description: "Een zoon van koning Zedekia van Juda. Ontsnapte en kwam naar Amerika.",
    gender: "man",
  },
  {
    slug: "noah",
    name: "Noe (boze koning)",
    description: "Een boze koning der Nephieten die de priesterschap misleidde. Werd gestraft voor zijn zonden.",
    gender: "man",
  },
  {
    slug: "limhi",
    name: "Limhi",
    description: "Zoon van koning Noah. Werd beter dan zijn vader en leidde zijn volk in rechtschapenheid.",
    gender: "man",
    fatherSlug: "noah",
  },
  {
    slug: "zeniff",
    name: "Zeniff",
    description: "Een rechtschapen Nephiet die naar Zarahemla terugging en later Limhi's vader werd.",
    gender: "man",
  },

  // Profeten en priesters
  {
    slug: "amulon",
    name: "Amulon",
    description:
      "Een boosaardige priester van Noe die later een priester in het priesterschap van Noe werd. " +
      "Onderdrukte Gods volk.",
    gender: "man",
  },
  {
    slug: "shiblon",
    name: "Shiblon",
    description: "Zoon van Alma de Jongere. Ontving de getuiging van zijn vader en werd een trouw dienaar van God.",
    gender: "man",
    fatherSlug: "alma-de-jongere",
  },
  {
    slug: "corianton",
    name: "Corianton",
    description:
      "Zoon van Alma de Jongere. Zonderde ernstig maar keerde zich tot God en diende uiteindelijk als zendeling.",
    gender: "man",
    fatherSlug: "alma-de-jongere",
  },
  {
    slug: "nehor",
    name: "Nehor",
    description:
      "Een ketterij-leraar die tegen Alma predikte. Doodde Gideon maar werd gestraft voor zijn misdaden.",
    gender: "man",
  },
  {
    slug: "gideon",
    name: "Gideon",
    description: "Een rechtschapen man van Zarahemla die voor Alma en het volk stond.",
    gender: "man",
  },

  // Onderkoning- en tegenstanders
  {
    slug: "gadianton",
    name: "Gadianton",
    description: "Een boosaardige man die een groep rovers stichtte — de Gadianton-rovers, die later een groot probleem werden.",
    gender: "man",
  },
  {
    slug: "kishkumen",
    name: "Kishkumen",
    description: "Een moordernaar die betrokken was bij Gadianton-rovers. Werkte aan het doden van rechtvaardige leiders.",
    gender: "man",
  },
  {
    slug: "zeezrom",
    name: "Zeezrom",
    description:
      "Een rechtschapen man van Ammonihah die eerst Alma en Amulek tegen zich inzette, maar zich later bekeerde.",
    gender: "man",
  },
  {
    slug: "ammoron",
    name: "Ammoron",
    description: "Een Lamaniëtische bevelhebber en broer van Amalickiah. Streed tegen de Nephieten.",
    gender: "man",
  },

  // Vrouwen in het verhaal
  {
    slug: "abish",
    name: "Abish",
    description: "Een Lamaniëtische vrouw wier koninklijke familie bekeerd werd. Diende trouw als zendeling.",
    gender: "vrouw",
  },

  // Jaredisch volk
  {
    slug: "ether",
    name: "Ether",
    description:
      "Een Jaredische profeet die als laatste van zijn volk bleef. Schreef de geschiedenis van de Jarediten op.",
    gender: "man",
  },
];
