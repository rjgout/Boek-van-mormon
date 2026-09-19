// Personen voor de introductiecursus (zie prisma/introContent.ts) en de
// "tik op een naam"-kaartjes daarin, plus alle overige met naam genoemde
// personen uit het Boek van Mormon (bron: Wikipedia, "List of people in
// the Book of Mormon" — vertaald en samengevat naar het Nederlands, geen
// letterlijke overname). Bij gelijknamige personen wordt onderscheid
// gemaakt via de slug (bv. "aaron-2") en een verduidelijking tussen haakjes
// in de naam. fatherSlug/motherSlug verwijzen naar een andere entry
// hieronder (of null); prisma/importIntro.ts lost dit op naar
// Person.fatherId/motherId. Familiebanden zijn alleen ingevuld waar de
// brontekst expliciet en ondubbelzinnig "zoon van"/"dochter van" vermeldt —
// niet bij een vage "afstammeling van".

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
    fatherSlug: "mormon-1",
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
    fatherSlug: "abinadom",
  },
  {
    slug: "ammon",
    name: "Ammon",
    description:
      "Zendelingverkondiger die tot de Lamaniten ging. Toonde grote moed en geloof in zijn missie onder het volk van Lamoni.",
    gender: "man",
    fatherSlug: "mosiah-2",
  },
  {
    slug: "aaron",
    name: "Aaron",
    description:
      "Broer van Ammon. Ook zendeling onder de Lamaniten. Predikte het evangelie ondanks veel tegenstand.",
    gender: "man",
    fatherSlug: "mosiah-2",
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
    fatherSlug: "mosiah",
  },
  {
    slug: "lamoni",
    name: "Lamoni",
    description:
      "Een Lamaniëtische koning die tot het geloof werd gebracht door Ammon. Zijn hart veranderde van hoop voor zijn volk.",
    gender: "man",
    fatherSlug: "koning-der-lamanieten-2",
    motherSlug: "koningin-2",
  },
  {
    slug: "anti-nephi-lehi",
    name: "Anti-Nephi-Lehi",
    description:
      "Een Lamaniëtische koning die zich tot God wendde en zijn volk van veel zonden bevrijd. Stierf samen met veel van zijn volk " +
      "om hun verbond te bewaren.",
    gender: "man",
    fatherSlug: "koning-der-lamanieten-2",
  },
  {
    slug: "amulek",
    name: "Amulek",
    description:
      "Een man van Zarahemla die naast Alma predikte en tegen de priesterschap van Noe sprak. Werd vervolgd vanwege zijn getuigenis.",
    gender: "man",
    fatherSlug: "giddonah-1",
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
    fatherSlug: "zedekia",
  },
  {
    slug: "noah",
    name: "Noe (boze koning)",
    description: "Een boze koning der Nephieten die de priesterschap misleidde. Werd gestraft voor zijn zonden.",
    gender: "man",
    fatherSlug: "zeniff",
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

  // --- Overige personen (A) ---
  {
    slug: "aaron-2",
    name: "Aaron (Jaredische troonopvolger)",
    description: "Jaredische koningszoon of -afstammeling in de lijn van troonopvolging, die zijn hele leven in gevangenschap doorbracht. Vader van Amnigaddah.",
    gender: "man",
  },
  {
    slug: "aaron-4",
    name: "Aaron (Lamanitische koning)",
    description: "Lamanitische koning die Mormon met een groter leger aanviel, maar verloor.",
    gender: "man",
  },
  {
    slug: "abinadom",
    name: "Abinadom",
    description: "Nephitische geschiedschrijver en krijger, die geen openbaring of profetie kende. Zoon van Chemish en vader van Amaleki.",
    gender: "man",
    fatherSlug: "chemish",
  },
  {
    slug: "aha",
    name: "Aha",
    description: "Nephitische legerofficier, zoon van Zoram, die het Lamanitische gebied introk om gevangenen terug te halen.",
    gender: "man",
    fatherSlug: "zoram-2",
  },
  {
    slug: "ahah",
    name: "Ahah",
    description: "Een onrechtvaardige Jaredische koning met een kort leven. Zoon van Seth, vader of voorvader van Ethem.",
    gender: "man",
    fatherSlug: "seth-2",
  },
  {
    slug: "akish",
    name: "Akish",
    description:
      "Boosaardige Jaredische zoon van Kimnor, ooit bevriend met Omer, die werkte met geheime samenzweringen. Spande met Jared en diens dochter " +
      "samen om Omer omver te werpen, en verkreeg het koninkrijk door Jared te doden.",
    gender: "man",
    fatherSlug: "kimnor",
  },
  {
    slug: "amaleki-2",
    name: "Amaleki (ontdekkingsreiziger)",
    description: "Nephitische ontdekkingsreiziger, broer van Ammon, op zoek naar het volk van Zeniff.",
    gender: "man",
  },
  {
    slug: "amgid",
    name: "Amgid",
    description: "Late Jaredische troonpretendent, omvergeworpen door Com.",
    gender: "man",
  },
  {
    slug: "aminadi",
    name: "Aminadi",
    description: "Verklaarde het schrift op de tempelmuur, geschreven door Gods vinger. Afstammeling van Nephi en voorvader van Amulek.",
    gender: "man",
  },
  {
    slug: "amlici",
    name: "Amlici",
    description: "Nephitische afvallige die leider van de afvalligen werd, en door Alma in de strijd werd gedood. Naamgever van het volk van de Amlicieten.",
    gender: "man",
  },
  {
    slug: "ammah",
    name: "Ammah",
    description: "Nephitische zendeling, metgezel van Aaron en Muloki. Predikte in Ani-Anti en Middoni, gevangengezet in Middoni, bevrijd door Ammon.",
    gender: "man",
  },
  {
    slug: "ammaron",
    name: "Ammaron",
    description: "Vierde Nephitische archiefbewaarder na de verschijning van Christus. Vertelde Mormon hoe en wanneer hij de platen moest verbergen. Zoon van Amos, broer van Amos.",
    gender: "man",
    fatherSlug: "amos-2",
  },
  {
    slug: "ammon-1",
    name: "Ammon (zoon van Lot)",
    description: "Ook wel Ben-Ammi genoemd, zoon van de bijbelse Lot.",
    gender: "man",
  },
  {
    slug: "ammon-2",
    name: "Ammon (Mulekitische leider)",
    description: "Een Mulekitische afstammeling en leider van een Nephitische expeditie van Zarahemla naar het land Nephi, die Limhi en zijn volk naar de vrijheid leidde.",
    gender: "man",
  },
  {
    slug: "amnigaddah",
    name: "Amnigaddah",
    description: "Gevangen Jarediet, in de lijn van troonopvolging. Vader van Coriantum, zoon van Aaron.",
    gender: "man",
    fatherSlug: "aaron-2",
  },
  {
    slug: "amnor",
    name: "Amnor",
    description: "Nephitische spion tijdens de Amlicitische veldtocht, samen met Limher, Manti en Zeram.",
    gender: "man",
  },
  {
    slug: "amoron",
    name: "Amoron",
    description: "Nephiet uit de vijfde eeuw na Christus, tijdgenoot en ondergeschikte van Mormon tijdens de laatste oorlog tussen Lamanieten en Nephieten.",
    gender: "man",
  },
  {
    slug: "amos-2",
    name: "Amos (archiefbewaarder, zoon van Nephi)",
    description: "Tweede Nephitische archiefbewaarder, documenteerde de vredestijd na de verschijning van Christus. Vader van Amos en Ammaron, zoon van Nephi.",
    gender: "man",
    fatherSlug: "nephi-4",
  },
  {
    slug: "amos-3",
    name: "Amos (archiefbewaarder, zoon van Amos)",
    description: "Zoon van Amos, derde archiefbewaarder die de Nephitische geschiedenis na Christus' verschijning documenteerde. Gaf de kroniek door aan broer Ammaron.",
    gender: "man",
    fatherSlug: "amos-2",
  },
  {
    slug: "antiomno",
    name: "Antiomno",
    description: "Lamanitische koning van het land Middoni en vriend van Lamoni, die de zendelingen Aaron, Muloki en Ammah gevangenzette.",
    gender: "man",
  },
  {
    slug: "antionah",
    name: "Antionah",
    description: "Belangrijkste leider in Ammonihah die Alma bevroeg over de aard van onsterfelijkheid.",
    gender: "man",
  },
  {
    slug: "antionum",
    name: "Antionum",
    description: "Nephitische bevelhebber, omgekomen in de laatste slag bij Cumorah.",
    gender: "man",
  },
  {
    slug: "antipus",
    name: "Antipus",
    description: "Nephitische bevelhebber in de stad Judea die samen met Helaman en de jonge Nephitische krijgers tegen de Lamanieten streed.",
    gender: "man",
  },
  {
    slug: "archeantus",
    name: "Archeantus",
    description: "Nephitische soldaat, een van drie \"uitgelezen mannen\" die sneuvelden in de strijd.",
    gender: "man",
  },

  // --- Overige personen (B) ---
  {
    slug: "broer-van-amaleki-1",
    name: "Broer van Amaleki (naamloos)",
    description: "Naamloze broer van Amaleki en zoon van Abinadom, die meedeed aan beide expedities naar het land Nephi, samen met Zeniff.",
    gender: "man",
    fatherSlug: "abinadom",
  },
  {
    slug: "broers-van-amulon",
    name: "Broeders van Amulon (naamloos)",
    description: "Naamloze \"broeders\" van Amulon (waarschijnlijk figuurlijk bedoeld voor de priesters van Noe), die op bevel van koning Laman de taal van Nephi aan de Lamanieten leerden.",
    gender: "man",
  },
  {
    slug: "broer-van-kim",
    name: "Broer van Kim (naamloos)",
    description: "Naamloze onrechtvaardige middelste Jaredische heerser die tegen Kim in opstand kwam en hem en zijn nakomelingen in gevangenschap bracht.",
    gender: "man",
    fatherSlug: "morianton-1",
  },
  {
    slug: "broer-van-nimrah",
    name: "Broer van Nimrah (naamloos)",
    description: "Naamloze Jaredische zoon van Akish, die uit jaloezie door zijn vader gevangen werd gezet en verhongerde — wat een jarenlange oorlog ontketende.",
    gender: "man",
    fatherSlug: "akish",
  },
  {
    slug: "broer-van-shiblom-1",
    name: "Broer van Shiblom (naamloos)",
    description: "Naamloze Jarediet (vermoedelijk zoon van Com) die de dood van alle profeten beval.",
    gender: "man",
  },

  // --- Overige personen (C) ---
  {
    slug: "cezoram",
    name: "Cezoram",
    description: "Achtste Nephitische opperrechter, opgevolgd door zijn zoon en uiteindelijk door Seezoram. Niet te verwarren met Seezoram, een andere opperrechter.",
    gender: "man",
  },
  {
    slug: "chemish",
    name: "Chemish",
    description: "Nephitische archiefbewaarder, zoon van Omni en broer van Amaron.",
    gender: "man",
    fatherSlug: "omni",
  },
  {
    slug: "cohor-1",
    name: "Cohor (vroege Jaredische koning)",
    description: "Onrechtvaardige vroege Jaredische koning, zoon van Corihor en broer van Noach. Stichtte samen met Noach een rivaliserend koninkrijk tegenover dat van Shule.",
    gender: "man",
    fatherSlug: "corihor-1",
  },
  {
    slug: "cohor-2",
    name: "Cohor (koning, zoon van Noach)",
    description: "Boosaardige vroege Jaredische koning, gedood door Shule. Zoon van Noach, vader van Nimrod.",
    gender: "man",
    fatherSlug: "noah-2",
  },
  {
    slug: "cohor-3",
    name: "Cohor (late Jarediet)",
    description: "Late Jarediet, alleen genoemd als vader van zonen en dochters.",
    gender: "man",
  },
  {
    slug: "com-1",
    name: "Com (middelste Jaredische koning)",
    description: "Rechtschapen middelste Jaredische koning, zoon van Coriantum en vader van Heth — door zijn eigen zoon van de troon gestoten.",
    gender: "man",
    fatherSlug: "coriantum-1",
  },
  {
    slug: "com-2",
    name: "Com (late Jaredische koning)",
    description:
      "Rechtschapen late Jaredische koning die de helft van het volk meenam naar een eigen koninkrijk en vervolgens tegen Amgid streed om de rest " +
      "van het rijk. Vader van Shiblom en minstens één andere zoon, zoon van Coriantum.",
    gender: "man",
    fatherSlug: "coriantum-2",
  },
  {
    slug: "coriantor",
    name: "Coriantor",
    description:
      "Late Jarediet in de lijn van koningschap, zoon van Moron en vader of voorvader van Ether. Hoewel zijn vader koning was geweest, leefde " +
      "Coriantor zijn hele leven in gevangenschap.",
    gender: "man",
    fatherSlug: "moron",
  },
  {
    slug: "coriantum-1",
    name: "Coriantum (middelste Jaredische koning)",
    description: "Rechtschapen middelste Jaredische koning, een stedenbouwer die op late leeftijd trouwde. Zoon van Emer, vader van Com.",
    gender: "man",
    fatherSlug: "emer",
  },
  {
    slug: "coriantum-2",
    name: "Coriantum (gevangen Jarediet)",
    description: "Gevangen middelste Jarediet in de lijn van troonopvolging. Vader van Com, zoon van Amnigaddah.",
    gender: "man",
    fatherSlug: "amnigaddah",
  },
  {
    slug: "coriantumr-1",
    name: "Coriantumr (vroege Jarediet)",
    description: "Vroege Jarediet, zoon van koning Omer en broer van Emer, die het koninkrijk aan zijn vader teruggaf.",
    gender: "man",
    fatherSlug: "omer",
  },
  {
    slug: "coriantumr-2",
    name: "Coriantumr (laatste Jaredische koning)",
    description: "Laatste Jaredische koning en laatste overlevende van de Jarediten. Streed tegen Shared en tegen Gilead, Lib en Shiz.",
    gender: "man",
  },
  {
    slug: "coriantumr-3",
    name: "Coriantumr (Nephitische afvallige)",
    description: "Nephitische afvallige, bevelhebber van de Lamanitische troepen, afstammeling van Zarahemla. Doodde opperrechter Pacumeni bij de stadsmuur, tot Moronihah hem neersloeg.",
    gender: "man",
  },
  {
    slug: "corihor-1",
    name: "Corihor (vroege Jarediet)",
    description: "Vroege Jarediet, opstandige zoon van Kib (en broer van Shule), die later berouw toonde. Vader van Noach en Cohor, die zich allebei tegen hem keerden.",
    gender: "man",
    fatherSlug: "kib",
  },
  {
    slug: "corihor-2",
    name: "Corihor (late Jarediet)",
    description: "Late Jarediet, alleen genoemd als vader van zonen en dochters. Niet te verwarren met de antichrist Korihor.",
    gender: "man",
  },
  {
    slug: "corom",
    name: "Corom",
    description: "Middelste Jaredische koning die goed deed voor zijn volk en vele kinderen kreeg, onder wie Kish. Zoon van Levi.",
    gender: "man",
    fatherSlug: "levi-2",
  },
  {
    slug: "cumenihah",
    name: "Cumenihah",
    description: "Nephitische bevelhebber, omgekomen in de laatste slag bij Cumorah.",
    gender: "man",
  },

  // --- Overige personen (D) ---
  {
    slug: "dochter-van-jared-3",
    name: "Dochter van Jared (naamloos)",
    description: "Naamloze dochter van Jared, die probeerde het koninkrijk van haar vader te redden door Omer te doden, en die trouwde met Akish en met hem samenspande.",
    gender: "vrouw",
  },

  // --- Overige personen (E) ---
  {
    slug: "emer",
    name: "Emer",
    description: "Rechtschapen middelste Jaredische koning met een vreedzame, voorspoedige regering van 62 jaar. Sprak rechtvaardig recht en zag Jezus Christus. Zoon van Omer en vader van Coriantum.",
    gender: "man",
    fatherSlug: "omer",
  },
  {
    slug: "emron",
    name: "Emron",
    description: "Nephitische soldaat, een van drie \"uitgelezen mannen\" die sneuvelden in de strijd.",
    gender: "man",
  },
  {
    slug: "enos-2",
    name: "Enos",
    description: "Zoon van Jakob, Nephitisch profeet en archiefbewaarder, verteller van het boek Enos, die van 's morgens tot 's avonds bad om vergeving van zonden te ontvangen.",
    gender: "man",
    fatherSlug: "jakob",
  },
  {
    slug: "esrom",
    name: "Esrom",
    description: "Vroege Jarediet, zoon van Omer en broer van Coriantumr, die samen met zijn broer tegen Jared streed om het koninkrijk aan hun vader terug te geven.",
    gender: "man",
    fatherSlug: "omer",
  },
  {
    slug: "ethem",
    name: "Ethem",
    description: "Boosaardige latere Jaredische koning wiens volk zijn hart verhardde. Zoon of afstammeling van Ahah, vader van Moron.",
    gender: "man",
  },
  {
    slug: "ezias",
    name: "Ezias",
    description: "Oude profeet die op dezelfde manier getuigde als Zenock, Jesaja en Jeremia.",
    gender: "man",
  },

  // --- Overige personen (G) ---
  {
    slug: "gazelem",
    name: "Gazelem",
    description: "Een ziener (of, volgens sommigen, een zienersteen) door God bereid om de geheime werken der duisternis te zien.",
  },
  {
    slug: "gid",
    name: "Gid",
    description: "Nephitische legerofficier en hoofdaanvoerder van de wacht over gevangenen. Meldde Helaman de dood en ontsnapping van opstandige gevangenen.",
    gender: "man",
  },
  {
    slug: "giddianhi",
    name: "Giddianhi",
    description: "Leider van de Gadianton-rovers die van Lachoneus arrogant Nephitisch land opeiste, en zijn volgelingen daarna ten strijde liet trekken. Werd verslagen en gedood.",
    gender: "man",
  },
  {
    slug: "giddonah-1",
    name: "Giddonah (vader van Amulek)",
    description: "Vader van Amulek en zoon van Ishmael, genoemd als Amuleks gezag om tot het volk van Ammonihah te prediken.",
    gender: "man",
    fatherSlug: "ishmael-3",
  },
  {
    slug: "giddonah-2",
    name: "Giddonah (hogepriester in Gideon)",
    description: "Hogepriester en opperrechter in Gideon, uitgedaagd door de antichrist Korihor.",
    gender: "man",
  },
  {
    slug: "gidgiddonah",
    name: "Gidgiddonah",
    description: "Nephitische bevelhebber, gesneuveld met zijn tienduizend man bij de slag om Cumorah.",
    gender: "man",
  },
  {
    slug: "gidgiddoni",
    name: "Gidgiddoni",
    description:
      "Nephitische bevelhebber, profeet en rechter, aangesteld door Lachoneus om de troepen tegen de volgelingen van de Gadianton-rover Giddianhi " +
      "te leiden. Weigerde het verzoek van het volk om zelf aan te vallen, verzamelde wapens en versloeg de rovers toen ze aanvielen.",
    gender: "man",
  },
  {
    slug: "gilead",
    name: "Gilead",
    description: "Broer van Shared, die een deel van het leger van Coriantumr doodde toen ze dronken waren, en zijn troon overnam.",
    gender: "man",
  },
  {
    slug: "gilgah",
    name: "Gilgah",
    description: "Tweede zoon van Jared, een vroege Jarediet die nederig voor God wandelde en het koningschap weigerde.",
    gender: "man",
    fatherSlug: "jared-2",
  },
  {
    slug: "gilgal",
    name: "Gilgal",
    description: "Nephitische bevelhebber, omgekomen in de laatste slag bij Cumorah.",
    gender: "man",
  },

  // --- Overige personen (H) ---
  {
    slug: "hagoth",
    name: "Hagoth",
    description: "Nephitische scheepsbouwer, een nieuwsgierig man die schepen bouwde om degenen te vinden die naar het noorden waren getrokken. Sommige schepen verdwenen en er werd nooit meer iets van vernomen.",
    gender: "man",
  },
  {
    slug: "hearthom",
    name: "Hearthom",
    description: "Rechtschapen middelste Jaredische koning die na 24 jaar zijn koninkrijk verloor en in gevangenschap viel. Zoon van Lib, vader van Heth.",
    gender: "man",
    fatherSlug: "lib-1",
  },
  {
    slug: "helam",
    name: "Helam",
    description: "Bekeerling uit het volk van Noach en de eerste die door Alma werd gedoopt. Waarschijnlijk naamgever van de stad en het land Helam.",
    gender: "man",
  },
  {
    slug: "helaman-1",
    name: "Helaman (zoon van koning Benjamin)",
    description: "Derde zoon van koning Benjamin, broer van Mosiah en Helorum. Door hun vader geleerd de geschriften in de oorspronkelijke taal te lezen.",
    gender: "man",
    fatherSlug: "benjamin",
  },
  {
    slug: "helaman-3",
    name: "Helaman (opperrechter, zoon van Helaman)",
    description:
      "Zesde Nephitische opperrechter en oudste zoon van Helaman. Ontving de kronieken van Shiblon en werd tot rechter aangesteld. De aanslag " +
      "van de Gadianton-rover Kishkumen op zijn leven mislukte dankzij het ingrijpen van een dienaar.",
    gender: "man",
    fatherSlug: "helaman",
  },
  {
    slug: "helem",
    name: "Helem",
    description: "Broer van Ammon en op zoek naar het volk van Zeniff.",
    gender: "man",
  },
  {
    slug: "helorum",
    name: "Helorum",
    description: "Tweede zoon van koning Benjamin, broer van Mosiah en Helaman. Wordt slechts in één vers bij naam genoemd, maar werd samen met zijn broers door koning Benjamin toegesproken.",
    gender: "man",
    fatherSlug: "benjamin",
  },
  {
    slug: "hem",
    name: "Hem",
    description: "Broer van Ammon en op zoek naar het volk van Zeniff.",
    gender: "man",
  },
  {
    slug: "heth-1",
    name: "Heth (middelste Jaredische koning)",
    description: "Onrechtvaardige middelste Jaredische koning die in opstand kwam, zijn vader doodde en hongersnood veroorzaakte, waardoor veel volgelingen naar Zarahemla emigreerden. Zoon van Com, vader van Shez.",
    gender: "man",
    fatherSlug: "com-1",
  },
  {
    slug: "heth-2",
    name: "Heth (Jarediet in gevangenschap)",
    description: "Middelste Jarediet in de lijn van troonopvolging, die zijn hele leven in gevangenschap doorbracht. Zoon van Hearthom.",
    gender: "man",
    fatherSlug: "hearthom",
  },
  {
    slug: "hogepriester-van-gilead",
    name: "Hogepriester van Gilead (naamloos)",
    description: "Naamloze hogepriester van Gilead, die Gilead vermoordde terwijl deze op zijn troon zat, en die op zijn beurt door Lib werd vermoord.",
    gender: "man",
  },
  {
    slug: "himni",
    name: "Himni",
    description: "Jongste zoon van koning Mosiah, ongelovige die de kerk probeerde te vernietigen, bekeerd door een engel, en reisde met zijn broers door Zarahemla om het aangerichte kwaad te herstellen.",
    gender: "man",
    fatherSlug: "mosiah-2",
  },

  // --- Overige personen (I) ---
  {
    slug: "isabel",
    name: "Isabel",
    description: "Een hoer in het land Siron die veel harten stal, en achternagezeten werd door Corianton.",
    gender: "vrouw",
  },
  {
    slug: "jesaja-1",
    name: "Jesaja (Hebreeuwse profeet)",
    description: "Hebreeuwse profeet, uitgebreid geciteerd door Nephi, Jakob en Abinadi.",
    gender: "man",
  },
  {
    slug: "jesaja-2",
    name: "Jesaja (Nephitisch discipel)",
    description: "Een van de twaalf Nephitische discipelen, gekozen door de opgestane Jezus Christus.",
    gender: "man",
  },
  {
    slug: "ishmael-3",
    name: "Ishmael (grootvader van Amulek)",
    description: "Vader van Giddonah en grootvader van Amulek, in de gezagslijn voor het prediken tot het volk van Ammonihah.",
    gender: "man",
  },

  // --- Overige personen (J) ---
  {
    slug: "jakob-1",
    name: "Jakob (bijbelse aartsvader)",
    description: "Bijbelse aartsvader en voorvader van Lehi, wiens naam werd gevonden op de koperen platen van Laban.",
    gender: "man",
  },
  {
    slug: "jakob-3",
    name: "Jakob (Zoramitische bevelhebber)",
    description: "Nephitische afvallige en Zoramitische bevelhebber, die de stad Mulek verliet om een lokmiddel van Teancum te bestrijden en werd verrast door het leger van Lehi. Sneuvelde in de daaropvolgende slag.",
    gender: "man",
  },
  {
    slug: "jakob-4",
    name: "Jakob (Nephitische koning-afvallige)",
    description: "Nephitische afvallige die door een geheime samenzwering tot koning werd gekozen. Beval, toen hij in de minderheid was, zijn volk te vluchten en een koninkrijk in het noorden te stichten.",
    gender: "man",
  },
  {
    slug: "jakom",
    name: "Jakom",
    description: "Eerste zoon van Jared. Vroege Jarediet die nederig voor God wandelde en het koningschap weigerde.",
    gender: "man",
    fatherSlug: "jared-2",
  },
  {
    slug: "jared-2",
    name: "Jared (stichter van de Jarediten)",
    description: "Stichter en rechtschapen eerste leider van de Jarediten. Kwam met zijn broer en vrienden van de toren van Babel. Vader van Jakom, Gilgah, Mahah, Orihah en acht dochters.",
    gender: "man",
  },
  {
    slug: "jared-3",
    name: "Jared (onrechtvaardige koning)",
    description: "Onrechtvaardige middelste Jaredische koning die het koninkrijk van zijn vader Omer greep. Broer van Esrom en Coriantumr, die het koninkrijk terugnamen. Gedood door de bende van Akish.",
    gender: "man",
    fatherSlug: "omer",
  },
  {
    slug: "jarom",
    name: "Jarom",
    description: "Nephitische archiefbewaarder en voornaamste auteur van het boek Jarom, die vele oorlogen zag en treurde over de halsstarrigheid van de Lamanieten. Zoon of afstammeling van Enos, vader van Omni.",
    gender: "man",
    fatherSlug: "enos-2",
  },
  {
    slug: "jeneum",
    name: "Jeneum",
    description: "Nephitische bevelhebber, omgekomen in de laatste slag bij Cumorah.",
    gender: "man",
  },
  {
    slug: "jeremia-2",
    name: "Jeremia (Nephitisch discipel)",
    description: "Een van de twaalf Nephitische discipelen, gekozen door de opgestane Jezus Christus.",
    gender: "man",
  },
  {
    slug: "jezus-christus",
    name: "Jezus Christus",
    description: "Verscheen als opgestaan Wezen aan het Nephitische volk, onderwees en zegende hen. Werd bij naam en titel voorzegd doorheen de hele geschiedenis van Lehi's nakomelingen tot aan zijn verschijning.",
    gender: "man",
  },
  {
    slug: "jonas-1",
    name: "Jonas (zoon van Nephi)",
    description: "Zoon van Nephi en een van de twaalf Nephitische discipelen, gekozen door de opgestane Jezus Christus.",
    gender: "man",
    fatherSlug: "nephi-3",
  },
  {
    slug: "jonas-2",
    name: "Jonas (Nephitisch discipel)",
    description: "Een van de twaalf Nephitische discipelen, gekozen door de opgestane Jezus Christus.",
    gender: "man",
  },
  {
    slug: "josh",
    name: "Josh",
    description: "Nephitische bevelhebber, omgekomen in de laatste slag bij Cumorah.",
    gender: "man",
  },
  {
    slug: "rechter-van-ammonihah",
    name: "Rechter in Ammonihah (naamloos)",
    description: "Naamloze rechter in Ammonihah, van de orde van Nehor. Liet gelovigen verbranden, en Alma en Amulek verhongeren en gevangenzetten. Kwam om toen de gevangenismuren instortten.",
    gender: "man",
  },

  // --- Overige personen (K) ---
  {
    slug: "kib",
    name: "Kib",
    description: "Rechtschapen vroege Jaredische koning en vader van Corihor, die hem gevangen zette, en van Shule, die hem bevrijdde en op de troon herstelde.",
    gender: "man",
  },
  {
    slug: "kim",
    name: "Kim",
    description: "Opstandige middelste Jaredische koning en zoon van Morianton, die door zijn eigen broer gevangen werd genomen. Vader van Levi.",
    gender: "man",
    fatherSlug: "morianton-1",
  },
  {
    slug: "kimnor",
    name: "Kimnor",
    description: "Vroege Jarediet, vader van Akish.",
    gender: "man",
  },
  {
    slug: "koning-der-lamanieten-1",
    name: "Koning der Lamanieten (onderwierp Limhi)",
    description: "Naamloze koning die Limhi en zijn volk onderwierp. Gesneuveld in de strijd tegen het volk van Limhi.",
    gender: "man",
  },
  {
    slug: "koning-der-lamanieten-2",
    name: "Koning der Lamanieten (vader van Lamoni)",
    description: "Naamloze koning, vader van Lamoni en Anti-Nephi-Lehi, bekeerd door Aaron.",
    gender: "man",
  },
  {
    slug: "koning-der-lamanieten-3",
    name: "Koning der Lamanieten (gedood door Amalickiahs knecht)",
    description: "Naamloze koning, gedood door een knecht van Amalickiah. Zijn weduwe werd later door Amalickiah getrouwd.",
    gender: "man",
  },
  {
    slug: "koning-der-lamanieten-4",
    name: "Koning der Lamanieten (bondgenoot van afvalligen)",
    description: "Naamloze koning tot wie Nephitische afvalligen zich wendden. Mogelijk dezelfde als, of opvolger van, Tubaloth.",
    gender: "man",
  },
  {
    slug: "koning-der-lamanieten-5",
    name: "Koning der Lamanieten (correspondeerde met Mormon)",
    description: "Naamloze koning (mogelijk Aaron, of diens naamloze opvolger), die een brief stuurde aan Mormon.",
    gender: "man",
  },
  {
    slug: "kish",
    name: "Kish",
    description: "Middelste Jaredische koning over wie weinig bekend is; vader van Lib en zoon van Corom, twee rechtschapen koningen.",
    gender: "man",
    fatherSlug: "corom",
  },
  {
    slug: "kumen",
    name: "Kumen",
    description: "Een van de twaalf Nephitische discipelen, gekozen door de opgestane Jezus Christus.",
    gender: "man",
  },
  {
    slug: "kumenonhi",
    name: "Kumenonhi",
    description: "Een van de twaalf Nephitische discipelen, gekozen door de opgestane Jezus Christus.",
    gender: "man",
  },

  // --- Overige personen (L) ---
  {
    slug: "lachoneus-1",
    name: "Lachoneus (opperrechter tijdens Giddianhi's dreiging)",
    description: "Elfde bekende Nephitische opperrechter, die een dreigbrief ontving van Giddianhi en daarop zijn volk verzamelde en versterkingen voorbereidde. Stelde Gidgiddoni aan als bevelhebber.",
    gender: "man",
  },
  {
    slug: "lachoneus-2",
    name: "Lachoneus (laatste opperrechter)",
    description: "Zoon van Lachoneus, twaalfde bekende (en laatste) Nephitische opperrechter, wiens volk hoogmoedig en goddeloos werd.",
    gender: "man",
    fatherSlug: "lachoneus-1",
  },
  {
    slug: "lamah",
    name: "Lamah",
    description: "Nephitische bevelhebber, omgekomen in de laatste slag bij Cumorah.",
    gender: "man",
  },
  {
    slug: "laman-2",
    name: "Laman (Lamanitische koning)",
    description: "Lamanitische koning en vader van Laman. Misleidde Zeniff en zette zijn volk tegen hem op.",
    gender: "man",
  },
  {
    slug: "laman-3",
    name: "Laman (zoon van Laman)",
    description: "Zoon van Laman en koning der Lamanieten, die Amulon aan de macht bracht en hem vervolgens onderwierp.",
    gender: "man",
    fatherSlug: "laman-2",
  },
  {
    slug: "laman-4",
    name: "Laman (Nephitische soldaat)",
    description:
      "Nephitische soldaat die door Moroni werd opgezocht omdat hij een rechtstreekse afstammeling van Laman was. Bracht Lamanitische wachters " +
      "aan de drank, waardoor Nephitische gevangenen konden ontsnappen uit de stad Gid.",
    gender: "man",
  },
  {
    slug: "onbenoemde-leider-expeditie",
    name: "Leider van de eerste expeditie (naamloos)",
    description: "Naamloze, bloeddorstige aanvoerder van de eerste van twee expedities die terugkeerden naar het land Nephi, waaraan ook Zeniff deelnam.",
    gender: "man",
  },
  {
    slug: "lehi-2",
    name: "Lehi (zoon van Zoram)",
    description: "Zoon van Zoram, die samen met zijn vader en broer Aha op pad ging om hun gevangen broeders te bevrijden.",
    gender: "man",
    fatherSlug: "zoram-2",
  },
  {
    slug: "lehi-3",
    name: "Lehi (Nephitische bevelhebber)",
    description: "Nephitische bevelhebber (mogelijk dezelfde als Lehi, zoon van Zoram), die Moroni hielp de Lamanieten te verslaan, en later ook Teancum en Moronihah bijstond.",
    gender: "man",
  },
  {
    slug: "lehi-4",
    name: "Lehi (zoon van Helaman)",
    description: "Nephitische zendeling, jongste zoon van Helaman, die samen met zijn broers Nephi en Moronihah instrumenteel was bij de bekering van 8.000 Lamanieten.",
    gender: "man",
    fatherSlug: "helaman-3",
  },
  {
    slug: "lehonti",
    name: "Lehonti",
    description: "Lamanitisch officier die in een val van Amalickiah werd gelokt en vergiftigd.",
    gender: "man",
  },
  {
    slug: "levi-2",
    name: "Levi",
    description: "Rechtschapen middelste Jaredische koning die zich uit gevangenschap vocht en rechtvaardig regeerde. Vader van Corom, zoon van Kim.",
    gender: "man",
    fatherSlug: "kim",
  },
  {
    slug: "lib-1",
    name: "Lib (koning die het land van slangen bevrijdde)",
    description: "Rechtschapen middelste Jaredische koning die het land van slangen bevrijdde en een groot jager werd. Zoon van Kish, vader van Hearthom.",
    gender: "man",
    fatherSlug: "kish",
  },
  {
    slug: "lib-2",
    name: "Lib (broer van Shiz)",
    description: "Boosaardige late Jaredische koning en broer van Shiz, die tegen de laatste Jaredische koning Coriantumr streed om de macht, Gilead vermoordde en door Coriantumr werd gedood.",
    gender: "man",
  },
  {
    slug: "limhah",
    name: "Limhah",
    description: "Nephitische bevelhebber, omgekomen in de laatste slag bij Cumorah.",
    gender: "man",
  },
  {
    slug: "limher",
    name: "Limher",
    description: "Nephitische spion tijdens de Amlicitische veldtocht, samen met Amnor, Manti en Zeram.",
    gender: "man",
  },
  {
    slug: "luram",
    name: "Luram",
    description: "Nephitische soldaat, een van drie \"uitgelezen mannen\" die sneuvelden in de strijd.",
    gender: "man",
  },

  // --- Overige personen (M) ---
  {
    slug: "mahah",
    name: "Mahah",
    description: "Derde zoon van Jared, een vroege Jarediet die nederig voor God wandelde en het koningschap weigerde.",
    gender: "man",
    fatherSlug: "jared-2",
  },
  {
    slug: "manti",
    name: "Manti",
    description: "Nephitische spion tijdens de Amlicitische veldtocht, samen met Amnor, Limher en Zeram.",
    gender: "man",
  },
  {
    slug: "mathoni",
    name: "Mathoni",
    description: "Broer van Mathonihah, en een van de twaalf Nephitische discipelen, gekozen door de opgestane Jezus Christus.",
    gender: "man",
  },
  {
    slug: "mathonihah",
    name: "Mathonihah",
    description: "Broer van Mathoni, en een van de twaalf Nephitische discipelen, gekozen door de opgestane Jezus Christus.",
    gender: "man",
  },
  {
    slug: "morianton-1",
    name: "Morianton (Jaredische koning)",
    description:
      "Rechtvaardige middelste Jaredische koning in de lijn van Ether, die na vele generaties het koninkrijk herstelde en de last van het volk " +
      "verlichtte, hoewel hijzelf van God was afgesneden. Afstammeling van Riplakish; vader van Kim en minstens één andere zoon.",
    gender: "man",
  },
  {
    slug: "morianton-2",
    name: "Morianton (Nephitische verrader)",
    description:
      "Stichter van de Nephitische stad Morianton, Nephitische verrader en aanstichter van het grensgeschil tussen Lehi en Morianton. Probeerde het " +
      "land Lehi binnen te vallen, maar toen hij een dienstmeisje sloeg, vluchtte zij naar Moroni om zijn plannen te verklappen. Werd in de " +
      "daaropvolgende slag door Teancum gedood.",
    gender: "man",
  },
  {
    slug: "mormon-1",
    name: "Mormon (vader van Mormon)",
    description: "Vader van Mormon en een afstammeling van Nephi.",
    gender: "man",
  },
  {
    slug: "moron",
    name: "Moron",
    description:
      "Late Jaredische koning die regeerde in een tijd van grote goddeloosheid en onrust, en zelf ook goddeloos was. Verloor de helft van zijn " +
      "koninkrijk door een opstand en werd, na het te hebben heroverd, volledig omvergeworpen. Zoon van Ethem, vader van Coriantor.",
    gender: "man",
    fatherSlug: "ethem",
  },
  {
    slug: "moronihah-1",
    name: "Moronihah (zoon van bevelhebber Moroni)",
    description: "Rechtschapen Nephitische generaal, zoon van bevelhebber Moroni. Dreef de Lamanieten terug en versloeg de invasie van Coriantumr om de stad Zarahemla te heroveren.",
    gender: "man",
    fatherSlug: "moroni-bevelhebber",
  },
  {
    slug: "moronihah-2",
    name: "Moronihah (generaal bij Cumorah)",
    description: "Nephitische generaal die samen met zijn tienduizend man omkwam in de laatste slag bij Cumorah.",
    gender: "man",
  },
  {
    slug: "mosiah-2",
    name: "Mosiah (koning, zoon van Benjamin)",
    description:
      "Nephitische profeet en koning, en tevens ziener. Oudste zoon van koning Benjamin. Pleitte tegen het einde van zijn leven voor een einde aan " +
      "het koningschap en de invoering van rechters — daarmee de laatste Nephitische koning. Zijn eerst weerspannige zonen (Aaron, Ammon, Himni " +
      "en Omner) bekeerden zich en werden invloedrijke zendelingen.",
    gender: "man",
    fatherSlug: "benjamin",
  },
  {
    slug: "muloki",
    name: "Muloki",
    description: "Nephitische zendeling, metgezel van Aaron en Ammah, gevangengezet in Middoni, bevrijd door Ammon.",
    gender: "man",
  },

  // --- Overige personen (N) ---
  {
    slug: "nephi-2",
    name: "Nephi (opperrechter en zendeling)",
    description: "Invloedrijke Nephitische zendeling, zevende Nephitische opperrechter, zoon van Helaman en broer van Lehi. Trad af als rechter om te prediken, en bekeerde 8.000 Lamanieten.",
    gender: "man",
    fatherSlug: "helaman-3",
  },
  {
    slug: "nephi-3",
    name: "Nephi (discipel)",
    description: "Bekend als Nephi de Discipel, oudste zoon van Nephi. Kreeg de platen onder zijn hoede, bad over de goddeloosheid van het volk, en hoorde de stem van de Heer over Christus' nabije geboorte.",
    gender: "man",
    fatherSlug: "nephi-2",
  },
  {
    slug: "nephi-4",
    name: "Nephi (archiefbewaarder)",
    description: "Eerste archiefbewaarder die de wonderen en vrede documenteerde die twee eeuwen heersten na het bezoek van Christus. Zoon van Nephi, vader van Amos.",
    gender: "man",
    fatherSlug: "nephi-3",
  },
  {
    slug: "nephihah",
    name: "Nephihah",
    description: "Tweede Nephitische opperrechter. Volgde Alma de Jongere op toen deze de rechterstoel overdroeg om zich meer aan zendingswerk te wijden. Zijn zoon Pahoran erfde na zijn dood de rechterstoel.",
    gender: "man",
  },
  {
    slug: "neum",
    name: "Neum",
    description: "Hebreeuwse profeet, geciteerd door Nephi, die de kruisiging van Christus profeteerde.",
    gender: "man",
  },
  {
    slug: "nimrah",
    name: "Nimrah",
    description: "Jaredische zoon van Akish, kleinzoon van Jared via zijn moeder. Vluchtte woedend, omdat zijn vader zijn broer had laten verhongeren, met een kleine groep naar zijn overgrootvader Omer.",
    gender: "man",
    fatherSlug: "akish",
  },
  {
    slug: "nimrod-1",
    name: "Nimrod (bijbelse jager)",
    description: "Grote bijbelse jager naar wie een Mesopotamische vallei zou zijn vernoemd.",
    gender: "man",
  },
  {
    slug: "nimrod-2",
    name: "Nimrod (Jaredische koning)",
    description: "Vroege Jaredische koning die het koninkrijk aan Shule overdroeg en daarvoor grote gunsten terugkreeg. Zoon van Corihor en kleinzoon van Noach.",
    gender: "man",
    fatherSlug: "corihor-2",
  },
  {
    slug: "noah-2",
    name: "Noe (Jaredische koning)",
    description: "Onrechtvaardige vroege Jaredische koning, zoon van Corihor. Kwam in opstand tegen zijn vader, streed tegen Shule en verwierf een deel van het koninkrijk. Gedood door de zonen van Shule. Vader van Cohor.",
    gender: "man",
    fatherSlug: "corihor-1",
  },

  // --- Overige personen (O) ---
  {
    slug: "omer",
    name: "Omer",
    description:
      "Rechtschapen middelste Jaredische koning, zoon van Shule en vader van Emer, Jared, Esrom en Coriantumr. Werd door Jared omvergeworpen en " +
      "bracht de helft van zijn dagen in gevangenschap door, tot zijn zonen het koninkrijk voor hem terugwonnen.",
    gender: "man",
    fatherSlug: "shule",
  },
  {
    slug: "omner",
    name: "Omner",
    description: "Derde zoon van koning Mosiah, ongelovige die de kerk probeerde te vernietigen, bekeerd door een engel, en reisde met zijn broers door Zarahemla om het aangerichte kwaad te herstellen.",
    gender: "man",
    fatherSlug: "mosiah-2",
  },
  {
    slug: "omni",
    name: "Omni",
    description: "Nephitische archiefbewaarder en zoon van Jarom. Vocht met het zwaard om zijn volk te beschermen. Gaf de kroniek door aan zoon Amaron.",
    gender: "man",
    fatherSlug: "jarom",
  },
  {
    slug: "orihah",
    name: "Orihah",
    description: "Eerste Jaredische koning, vierde zoon van Jared. Wandelde nederig en sprak rechtvaardig recht. Kreeg 31 zonen en dochters, onder wie Kib.",
    gender: "man",
    fatherSlug: "jared-2",
  },

  // --- Overige personen (P) ---
  {
    slug: "paanchi",
    name: "Paanchi",
    description:
      "Nephitische opstandeling en zoon van Pahoran, die met zijn broers Pahoran en Pacumeni streed om de rechterstoel. Werd woedend toen zijn " +
      "oudere broer werd aangesteld en veroorzaakte een opstand. Ter dood veroordeeld, wat leidde tot de sluipmoord op zijn broer.",
    gender: "man",
    fatherSlug: "pahoran-1",
  },
  {
    slug: "pachus",
    name: "Pachus",
    description: "Opstandige koning van Nephitische afvalligen in Zarahemla die zich met Ammoron verbond, de vrije mannen uit het land verdreef, tegen Moroni en Pahoran streed en sneuvelde.",
    gender: "man",
  },
  {
    slug: "pacumeni",
    name: "Pacumeni",
    description: "Vijfde Nephitische opperrechter, zoon van Pahoran, broer van Pahoran en mededinger naar de rechterstoel. Verkreeg de rechterstoel kort na de sluipmoord op zijn broer.",
    gender: "man",
    fatherSlug: "pahoran-1",
  },
  {
    slug: "pagag",
    name: "Pagag",
    description: "Oudste zoon van de Broer van Jared, die het aanbod om koning te worden afwees.",
    gender: "man",
    fatherSlug: "brother-of-jared",
  },
  {
    slug: "pahoran-1",
    name: "Pahoran (opperrechter, vader)",
    description:
      "Standvastige derde Nephitische opperrechter, zoon van Nephihah. Gesteund door de vrije mannen; tegengewerkt door de hooggeboren " +
      "koningsgezinden. Vader van Pahoran, Paanchi, Pacumeni en anderen.",
    gender: "man",
    fatherSlug: "nephihah",
  },
  {
    slug: "pahoran-2",
    name: "Pahoran (opperrechter, zoon)",
    description: "Vierde Nephitische opperrechter. Oudste van drie zonen van Pahoran die om de rechterstoel streden. Vermoord door de binnendringende Gadianton-rover Kishkumen.",
    gender: "man",
    fatherSlug: "pahoran-1",
  },

  // --- Overige personen (Q) ---
  {
    slug: "koningin-1",
    name: "Koningin (vrouw van Lamoni)",
    description: "Vrouw van Lamoni, die rouwde toen ze dacht dat haar man dood was, Ammon liet halen, en bij haar bekering in tongen sprak. Werd door Abish tot leven gewekt.",
    gender: "vrouw",
  },
  {
    slug: "koningin-2",
    name: "Koningin (moeder van Lamoni)",
    description: "Moeder van Lamoni, die boos was op Aaron toen haar echtgenoot in elkaar zakte, en zich bekeerde toen hij weer opstond en het volk ging onderwijzen.",
    gender: "vrouw",
  },
  {
    slug: "koningin-3",
    name: "Koningin (weduwe van een Lamanitische koning)",
    description: "Weduwe van de Lamanitische koning die door Amalickiah werd gedood. Liet zich ompraten dat de dood door de knechten van de koning was toegebracht, en trouwde met Amalickiah, die daarna koning werd.",
    gender: "vrouw",
  },
  {
    slug: "koningin-4",
    name: "Koningin (vrouw van Ammoron)",
    description: "Vrouw van Ammoron, die van de dood van Amalickiah hoorde voordat ze terugkeerde naar de strijd tegen de Nephieten.",
    gender: "vrouw",
  },

  // --- Overige personen (R) ---
  {
    slug: "riplakish",
    name: "Riplakish",
    description: "Jaredische koning die zijn volk zwaar belastte, degenen die niet werkten liet doden, en tijdens een opstand werd gedood. Zoon van Shez en broer van Shez.",
    gender: "man",
    fatherSlug: "shez-1",
  },

  // --- Overige personen (S) ---
  {
    slug: "samuel-1",
    name: "Samuel (Hebreeuwse profeet)",
    description: "Hebreeuwse profeet en ziener die volgens het Boek van Mormon een van de velen was die van Christus getuigden.",
    gender: "man",
  },
  {
    slug: "seantum",
    name: "Seantum",
    description: "Broedermoordenaar-broer van de Nephitische rechter Seezoram. Lid van de Gadianton-bende; zijn moord op zijn broer werd door Nephi via ingeving onthuld.",
    gender: "man",
  },
  {
    slug: "seezoram",
    name: "Seezoram",
    description: "Broer van Seantum en lid van de Gadianton-bende, tiende bekende Nephitische opperrechter, uiteindelijk opgevolgd door Lachoneus. Niet te verwarren met Cezoram, een andere opperrechter.",
    gender: "man",
  },
  {
    slug: "knecht-van-amalickiah",
    name: "Knecht van Amalickiah (naamloos)",
    description: "Naamloze knecht van Amalickiah, die Lehonti vergiftigde en waarschijnlijk ook de Lamanitische koning doodde.",
    gender: "man",
  },
  {
    slug: "knecht-van-helaman-3",
    name: "Knecht van Helaman (naamloos)",
    description:
      "Naamloze spion van Helaman binnen de roversbende, die ontdekte dat de Gadianton-rover Kishkumen van plan was Helaman te vermoorden, deed " +
      "alsof hij de aanvaller naar de rechterstoel leidde, maar stak hem in het hart en onthulde zo het complot.",
    gender: "man",
  },
  {
    slug: "dienares-van-morianton-2",
    name: "Dienares van Morianton (naamloos)",
    description: "Naamloze dienares van Morianton, die na door hem geslagen te zijn naar het kamp van Moroni vluchtte en zijn plannen om naar het noorden te vluchten verklapte.",
    gender: "vrouw",
  },
  {
    slug: "seth-2",
    name: "Seth",
    description: "Late Jarediet in de lijn van troonopvolging, die na de dood van zijn vader in gevangenschap leefde. Zoon van Shiblom, vader van Ahah.",
    gender: "man",
    fatherSlug: "shiblom-1",
  },
  {
    slug: "shared",
    name: "Shared",
    description: "Jaredische legeraanvoerder en broer van Gilead, die tegen Coriantumr en diens zonen streed om het koninkrijk. Vocht drie dagen tegen Coriantumr, verwondde hem ernstig, maar verloor daarbij zelf het leven.",
    gender: "man",
  },
  {
    slug: "shem-2",
    name: "Shem",
    description: "Nephitische bevelhebber, omgekomen in de laatste slag bij Cumorah.",
    gender: "man",
  },
  {
    slug: "shemnon",
    name: "Shemnon",
    description: "Een van de twaalf Nephitische discipelen, gekozen door de opgestane Jezus Christus.",
    gender: "man",
  },
  {
    slug: "shez-1",
    name: "Shez (Jaredische koning)",
    description: "Rechtschapen middelste Jaredische koning die zijn opstandige naamgenoot-zoon overleefde en het koninkrijk herbouwde. Zoon of afstammeling van Heth, vader van Riplakish en Shez.",
    gender: "man",
    fatherSlug: "heth-1",
  },
  {
    slug: "shez-2",
    name: "Shez (opstandige zoon)",
    description: "Opstandige zoon van Shez, gedood door een rover. Broer van Riplakish.",
    gender: "man",
    fatherSlug: "shez-1",
  },
  {
    slug: "shiblom-1",
    name: "Shiblom (Jaredische koning)",
    description: "Rechtschapen late Jaredische koning en zoon van Com, die tegen een opstandige broer streed en sneuvelde. Vader van Seth.",
    gender: "man",
    fatherSlug: "com-2",
  },
  {
    slug: "shiblom-2",
    name: "Shiblom (bevelhebber bij Cumorah)",
    description: "Nephitische bevelhebber, omgekomen in de laatste slag bij Cumorah.",
    gender: "man",
  },
  {
    slug: "shiz",
    name: "Shiz",
    description:
      "Jaredische legeraanvoerder en broer van Lib. Zwoer het bloed van zijn broer te wreken, doodde vrouwen en kinderen en verwoestte steden. " +
      "Coriantumr sloeg terug en onthoofdde hem uiteindelijk — hun strijd betekende het einde van de Jaredische beschaving.",
    gender: "man",
  },
  {
    slug: "zoon-van-cezoram",
    name: "Zoon van Cezoram (naamloos)",
    description: "Naamloze zoon van Cezoram, negende Nephitische rechter, vermoord op de rechterstoel, net als zijn vader.",
    gender: "man",
    fatherSlug: "cezoram",
  },
  {
    slug: "shule",
    name: "Shule",
    description:
      "Rechtschapen vroege Jaredische koning. Geboren in gevangenschap nadat zijn broer Corihor het koninkrijk van hun vader Kib had ingepikt. " +
      "Bracht het koninkrijk aan zijn vader terug en werd uiteindelijk zelf koning.",
    gender: "man",
    fatherSlug: "kib",
  },

  // --- Overige personen (T) ---
  {
    slug: "teomner",
    name: "Teomner",
    description: "Nephitische legerofficier. Nam met Helaman en Gid deel aan een hinderlaag om Manti te heroveren.",
    gender: "man",
  },
  {
    slug: "timotheus",
    name: "Timotheüs",
    description: "Broer van Nephi, uit de dood opgewekt, en een van de twaalf Nephitische discipelen, gekozen door de opgestane Jezus Christus.",
    gender: "man",
  },
  {
    slug: "tubaloth",
    name: "Tubaloth",
    description: "Lamanitische koning, zoon van Ammoron, de vorige koning. Stelde Coriantumr aan om zijn legers te leiden.",
    gender: "man",
    fatherSlug: "ammoron",
  },

  // --- Overige personen (U) ---
  {
    slug: "usurpator-jarediet",
    name: "Usurpator (Jaredische koning)",
    description: "Late Jaredische koning, afstammeling van de broer van Jared en een \"machtig man\" met onduidelijke band tot Moron, die hij omverwierp, of tot Coriantor, die hij gevangen hield.",
    gender: "man",
  },

  // --- Overige personen (W) ---
  {
    slug: "vrouwen-van-amulon",
    name: "Vrouwen van Amulon en zijn broeders (naamloos)",
    description: "Naamloze vrouwen van Amulon en zijn \"broeders\", dochters van Lamanieten die het gedrag en de namen van hun vaders verwierpen.",
    gender: "vrouw",
  },
  {
    slug: "eerste-vrouw-van-coriantum-1",
    name: "Eerste vrouw van Coriantum (naamloos)",
    description: "Naamloze eerste vrouw van Coriantum, die 102 jaar oud werd. Ze kreeg geen kinderen.",
    gender: "vrouw",
  },
  {
    slug: "tweede-vrouw-van-coriantum-1",
    name: "Tweede vrouw van Coriantum (naamloos)",
    description: "Naamloze tweede vrouw van Coriantum, die moeder werd van meerdere zonen en dochters, onder wie Com.",
    gender: "vrouw",
  },
  {
    slug: "vrouw-van-ishmael",
    name: "Vrouw van Ishmael (naamloos)",
    description: "Naamloze vrouw van Ishmael, die met haar gezin uit Jeruzalem vertrok. Haar dochters trouwden met de zonen van Lehi en Zoram.",
    gender: "vrouw",
  },
  {
    slug: "vrouw-van-nephi",
    name: "Vrouw van Nephi (naamloos)",
    description: "Naamloze vrouw van Nephi, een dochter van Ishmael, die haar man verdedigde toen hij werd aangevallen.",
    gender: "vrouw",
    fatherSlug: "ishmael",
  },
  {
    slug: "vrouw-van-zoram",
    name: "Vrouw van Zoram (naamloos)",
    description: "Naamloze vrouw van Zoram, oudste dochter van Ishmael.",
    gender: "vrouw",
    fatherSlug: "ishmael",
  },

  // --- Overige personen (Z) ---
  {
    slug: "zarahemla-mulekiet",
    name: "Zarahemla (leider van de Mulekieten)",
    description: "Leider van de kolonie van Mulek, afstammeling van Mulek. Ontdekt door Mosiah, verheugde zich te vernemen van het bestaan van de koperen platen met het verslag van de Joden. Naamgever van een volk, twee steden en een land.",
    gender: "man",
  },
  {
    slug: "zedekia",
    name: "Zedekia",
    description: "Laatste koning van Juda vóór de verwoesting van Jeruzalem door Nebukadnezar II, veelvuldig genoemd in het Boek van Mormon, en daar aangeduid als de vader van Mulek.",
    gender: "man",
  },
  {
    slug: "zedekia-2",
    name: "Zedekia (Nephitisch discipel)",
    description: "Een van de twaalf Nephitische discipelen, gekozen door de opgestane Jezus Christus.",
    gender: "man",
  },
  {
    slug: "zemnarihah",
    name: "Zemnarihah",
    description: "Leider van de Gadianton-bende, opvolger van Giddianhi. Belegerde de Nephieten, kreeg gebrek aan voorraden, werd afgesneden door Gidgiddoni, gevangengenomen en opgehangen.",
    gender: "man",
  },
  {
    slug: "zenephi",
    name: "Zenephi",
    description: "Militair bevelhebber die de voorraden van weduwen en kinderen wegnam en hen aan hun lot overliet.",
    gender: "man",
  },
  {
    slug: "zenock",
    name: "Zenock",
    description: "Apocriefe profeet uit het oude Israël. Voorspelde de kruisiging van Christus, getuigde van Gods barmhartigheid, en werd geciteerd door Alma.",
    gender: "man",
  },
  {
    slug: "zenos",
    name: "Zenos",
    description: "Apocriefe profeet uit het oude Israël. Voorspelde drie dagen van duisternis bij Christus' kruisiging en de vergadering van Israël, geciteerd door Jakob. Gedood om de vrijmoedigheid van zijn getuigenis.",
    gender: "man",
  },
  {
    slug: "zerahemnah",
    name: "Zerahemnah",
    description:
      "Lamanitische bevelhebber die verbitterde Amalekieten en Zoramieten als hoofdaanvoerders aanstelde om haat tegen de Nephieten op te wekken. " +
      "Werd door Moroni's leger geïntimideerd, weigerde eerst de eed om de strijd te staken, maar zwichtte na verdere strijd.",
    gender: "man",
  },
  {
    slug: "zeram",
    name: "Zeram",
    description: "Nephitische legerofficier, een van de spionnen (samen met Amnor, Limher en Manti) die het kamp van de Amlicieten in de gaten hielden.",
    gender: "man",
  },
  {
    slug: "zoram-2",
    name: "Zoram (Nephitisch bevelhebber)",
    description: "Hoofdaanvoerder van de Nephitische legers, vader van Lehi en Aha. Zocht profetisch advies bij Alma om gevangengenomen mensen op te sporen. Versloeg de Lamanieten bij de rivier Sidon en bevrijdde de gevangenen.",
    gender: "man",
  },
  {
    slug: "zoram-3",
    name: "Zoram (antichrist)",
    description: "Een antichrist. Leider van de afvallige Nephitische sekte, de Zoramieten, die Korihor doodtrapten. Zette aan tot afgodendienst, tot ontsteltenis van Alma.",
    gender: "man",
  },
];
