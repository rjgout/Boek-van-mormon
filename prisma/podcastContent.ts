// Handmatig samengestelde content bij een podcastaflevering van "Geloof je
// dat ook?" — gebaseerd op een door de eigenaar aangeleverd transcript.
// De vragen zijn eigen samenvattingen/parafrases van wat er besproken wordt,
// geen letterlijke overname van het transcript. De BOM_CONNECTION-vragen
// verwijzen naar de al bestaande zelf geschreven Alma 5-parafrase in
// prisma/content.ts (zie de auteursrechtnotitie daar).

export interface PodcastComprehensionMultipleChoice {
  type: "MULTIPLE_CHOICE";
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface PodcastComprehensionSequence {
  type: "SEQUENCE";
  prompt: string;
  items: string[]; // in de juiste volgorde
}

export interface PodcastComprehensionTrueFalse {
  type: "TRUE_FALSE";
  prompt: string;
  answer: boolean;
}

export type PodcastComprehensionExercise =
  | PodcastComprehensionMultipleChoice
  | PodcastComprehensionSequence
  | PodcastComprehensionTrueFalse;

export interface PodcastEpisodeSeed {
  number: number;
  title: string;
  summary: string;
  listenUrl?: string;
  content: PodcastComprehensionExercise[];
  bomConnection: PodcastComprehensionExercise[];
}

export const podcastEpisodes: PodcastEpisodeSeed[] = [
  {
    number: 127,
    title: "Geloofsartikel 9: doorlopende openbaring",
    summary:
      "Koos en Raphael bespreken het negende geloofsartikel — dat God nog vele grote en belangrijke dingen zal openbaren — en wat een openbaring nou eigenlijk herkenbaar maakt. Koos vertelt over het moment dat het Boek van Mormon voor hem 'waar' werd, bij Alma 5.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel staat in deze aflevering centraal?",
        options: [
          "Geloofsartikel 9 — dat God nog vele grote en belangrijke dingen zal openbaren",
          "Geloofsartikel 4 — geloof, bekering en doop",
          "Geloofsartikel 13 — eerlijk, trouw en kuis zijn",
          "Geloofsartikel 1 — geloof in God de eeuwige Vader",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar was Raphael deze zomer op vakantie?",
        options: ["Denemarken", "De Verenigde Staten", "Frankrijk", "Zweden"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos is enthousiast over de aangekondigde verandering in het vergaderschema van de kerk.",
        answer: false,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waardoor merk je volgens Raphael dat iets echt een openbaring van God is?",
        options: [
          "Door de invloed/het getuigenis van de Heilige Geest",
          "Doordat het in de krant staat",
          "Doordat iedereen het er direct mee eens is",
          "Doordat het een wonder is dat iedereen ziet",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Koos en Raphael praten over hun vakanties",
          "Ze bespreken geloofsartikel 9 over doorlopende openbaring",
          "Koos vertelt zijn persoonlijke ervaring met Alma 5",
          "Ze bespreken de aangekondigde verandering in het kerkschema",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt:
          "Koos noemt Alma 5 als het hoofdstuk waarbij het Boek van Mormon voor hem persoonlijk 'waar' werd. Welke vraag stelt Alma daar volgens onze samenvatting aan het volk?",
        options: [
          "Of zij een geestelijke wedergeboorte in hun hart hadden ervaren",
          "Of zij hun offergaven op tijd hadden betaald",
          "Of zij een zwaard hadden gesmeed voor de oorlog",
          "Of zij een droom hadden gehad die nacht",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke tweede, vergelijkbare vraag stelt Alma volgens Alma 5?",
        options: [
          "Of zij het beeld van God in hun gelaat konden dragen zonder zich te schamen",
          "Of zij bereid waren te vasten voor een week",
          "Of zij hun huizen wilden delen met vreemdelingen",
          "Of zij de koperen platen hadden gelezen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 5 wordt een boom die geen goede vrucht draagt, gespaard voor later.",
        answer: false,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit Alma 5 in de juiste volgorde.",
        items: [
          "Alma spreekt tot het volk in de stad Zarahemla",
          "Hij vraagt of zij een geestelijke wedergeboorte hebben ervaren",
          "Hij vraagt of zij Gods beeld in hun gelaat dragen zonder schaamte",
          "Hij waarschuwt dat een vruchteloze boom wordt omgehakt",
        ],
      },
    ],
  },
  {
    // Titel/samenvatting zijn hier bewust een kale placeholder: de
    // podcastfeed-sync (src/lib/podcastFeed.ts, draait vlak na deze import
    // in src/lib/seed.ts) overschrijft ze toch met de echte titel/omschrijving
    // uit de RSS-feed — die is leidend qua benaming, niet dit bestand.
    number: 128,
    title: "Aflevering 128",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar praten Koos en Raphael in deze aflevering vooral over?",
        options: [
          "De halfjaarlijkse algemene conferentie van de kerk",
          "Het vertalen van het Boek van Mormon",
          "De geschiedenis van de zending in Utah",
          "Het bouwen van een nieuw kerkgebouw",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoeveel sessies telt de algemene conferentie op dit moment?",
        options: ["Vier", "Vijf", "Zes", "Acht"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Vroeger was er ook nog een aparte sessie op zaterdagavond, die inmiddels is afgeschaft.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat kreeg Raphael ooit als 'inspiratiebron' toegewezen voor een eigen toespraak in zijn wijk?",
        options: [
          "Een toespraak uit een eerdere algemene conferentie",
          "Een hoofdstuk uit het Boek van Mormon",
          "Een lied uit het kerkliedboek",
          "Een persoonlijk verhaal van de bisschop",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze manieren waarop Koos en Raphael vroeger de conferentie volgden in de juiste (chronologische) volgorde.",
        items: [
          "Uitzending via de radio",
          "Videoband (VHS) die met de post kwam",
          "Satellietschotel bij de wijk",
          "Livestream via internet",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke drie voorwaarden noemt Moroni in Moroni 10 om een antwoord van God te krijgen of iets waar is?",
        options: [
          "Een oprecht hart, een eerlijke bedoeling en geloof in Christus",
          "Vasten, bidden en een offergave brengen",
          "Het boek driemaal lezen en het navertellen aan een vriend",
          "Een droom hebben en die opschrijven",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Door welke macht zegt Moroni dat die waarheid aan je geopenbaard zal worden?",
        options: [
          "Door de macht van de Heilige Geest",
          "Door een engel die verschijnt",
          "Door een droom die je 's nachts krijgt",
          "Door een stem die je hoort in de tempel",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 10 kun je door de macht van de Heilige Geest de waarheid van alle dingen kennen, niet alleen van het Boek van Mormon.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen uit Moroni's aansporing in Moroni 10 in de juiste volgorde.",
        items: [
          "Lees de kroniek en overweeg in je hart hoe barmhartig God is geweest",
          "Vraag God in de naam van Christus of deze dingen waar zijn",
          "Vraag met een oprecht hart, een eerlijke bedoeling en geloof in Christus",
          "Ontvang de waarheid geopenbaard door de macht van de Heilige Geest",
        ],
      },
    ],
  },
  {
    // Titel/samenvatting: kale placeholder, zie de toelichting bij aflevering
    // 128 hierboven — de podcastfeed-sync overschrijft deze toch.
    number: 126,
    title: "Aflevering 126",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Met welke stichting werken gasten Lisette en Sheila in deze aflevering vooral samen?",
        options: ["Stichting Babyspullen", "De Voedselbank", "Jantje Beton", "Het Rode Kruis"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat doet Stichting Babyspullen precies?",
        options: [
          "Ze maken babystartpakketten voor aanstaande moeders die in armoede leven",
          "Ze bouwen speeltuinen voor arme wijken",
          "Ze geven gratis kinderopvang aan alleenstaande ouders",
          "Ze verzorgen zwangerschapscursussen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Sheila vertelt dat de kerk een deel van het gedoneerde geld inhoudt als vergoeding voor de organisatie.",
        answer: false,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoeveel baby's worden er volgens Lisette dagelijks in armoede geboren in Nederland?",
        options: ["5", "15", "35", "70"],
        correctIndex: 2,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Lisette en Sheila stellen zichzelf voor",
          "Ze vertellen over het Strength of Women-evenement van 2024",
          "Ze leggen de landelijke inzamelactie voor Stichting Babyspullen uit",
          "Koos vertelt over de wet van de tiende en het beginsel van vasten",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt koning Benjamin in Mosiah 4 dat je moet doen als een bedelaar je om hulp vraagt?",
        options: [
          "Hem van je overvloed geven, en hem niet tevergeefs laten smeken",
          "Hem wegsturen, want zijn armoede is zijn eigen schuld",
          "Hem alleen helpen als hij eerst laat zien dat hij zich bekeerd heeft",
          "Hem doorverwijzen naar de overheid",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke reden geeft koning Benjamin waarom niemand het recht heeft om te oordelen wie hulp \"verdient\"?",
        options: [
          "Omdat wij allemaal zelf bedelaars zijn, afhankelijk van God voor alles wat we hebben",
          "Omdat de wet dat verbiedt",
          "Omdat armoede altijd door onrecht komt",
          "Omdat rijkdom een teken van Gods ongenoegen is",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Mosiah 4 blijft iemand die een bedelaar afwijst met de gedachte \"dat is zijn eigen schuld\" zonder gevolgen, zolang hij zelf niets te verwijten valt.",
        answer: false,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen van koning Benjamin in Mosiah 4 in de juiste volgorde.",
        items: [
          "Hij roept op om de noodlijdende te helpen met wat je zelf bezit",
          "Hij waarschuwt tegen de gedachte dat armoede altijd iemands eigen schuld is",
          "Hij legt uit dat we allen bedelaars zijn, afhankelijk van God voor alles",
          "Hij zegt dat je naar vermogen moet geven, in wijsheid en ordelijkheid",
        ],
      },
    ],
  },
  {
    number: 125,
    title: "Aflevering 125",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk onderwerp staat in deze aflevering centraal, als vervolg op een eerdere aflevering?",
        options: [
          "De verwachtingen die Hemelse Vader van ons heeft, en onze verwachtingen van Hem",
          "De geschiedenis van het eerste visioen",
          "Het kiezen van een zendingsgebied",
          "Het opvoeden van kinderen zonder geloof",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vindt het woord \"verwachting\" eigenlijk niet helemaal passend voor wat hij voor zijn eigen kinderen voelt — hij noemt het liever \"hoop\".",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarin kun je volgens Koos en Raphael persoonlijke aanwijzingen over Gods verwachtingen van jou terugvinden?",
        options: ["Een patriarchale zegen", "Een droom", "Een horoscoop", "Een priesterschapsinterview"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vertelt Raphael over zijn zus, na haar ernstige auto-ongeluk?",
        options: [
          "Ze kreeg een zegen, ontwaakte uit coma, maar is niet meer helemaal de oude geworden",
          "Ze overleed enkele dagen na het ongeluk",
          "Ze herstelde volledig zonder enige blijvende gevolgen",
          "Ze weigerde een priesterschapszegen te ontvangen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken wat een patriarchale zegen zegt over verwachtingen",
          "Koos legt uit dat hij zijn kinderen liever geluk gunt dan verwachtingen oplegt",
          "Raphael vertelt over de zegen die zijn zus kreeg na haar ongeluk",
          "Ze concluderen dat sommige antwoorden pas later in het leven komen",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarmee vergelijkt Alma het geloof in Alma 32?",
        options: [
          "Met een zaadje dat je in je hart moet planten en laten groeien",
          "Met een steen die nooit verandert",
          "Met een rivier die altijd dezelfde kant op stroomt",
          "Met een lamp die je nooit hoeft bij te vullen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 32 is geloof hetzelfde als een volmaakte kennis van iets hebben.",
        answer: false,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat moet je volgens Alma doen om te ontdekken of het woord goed is?",
        options: [
          "Het woord in je hart planten en de proef op de som nemen",
          "Wachten tot iemand anders het je vertelt",
          "Het bewijzen met wetenschappelijk onderzoek",
          "Het pas geloven nadat je een wonder hebt gezien",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen uit Alma's gelijkenis van het zaadje in Alma 32 in de juiste volgorde.",
        items: [
          "Je plant het zaadje/woord en geeft het geen ongeloof",
          "Het zaadje begint te zwellen en te ontspruiten",
          "Je verzorgt de boom met ijver, geduld en geloof",
          "Uiteindelijk pluk je de vrucht, die uiterst kostbaar is",
        ],
      },
    ],
  },
  {
    number: 124,
    title: "Aflevering 124",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel bespreken Koos en Raphael in deze aflevering?",
        options: ["Geloofsartikel 8", "Geloofsartikel 4", "Geloofsartikel 9", "Geloofsartikel 13"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt geloofsartikel 8 over de Bijbel en het Boek van Mormon?",
        options: [
          "De Bijbel is het woord van God voor zover juist vertaald; het Boek van Mormon is het woord van God",
          "Beide boeken zijn woordelijk letterlijk gedicteerd door engelen",
          "Alleen het Boek van Mormon is het woord van God",
          "Beide boeken zijn menselijke verzinsels zonder goddelijke inspiratie",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos legt uit dat Nephi zijn kroniek soms wel 35 jaar na de gebeurtenissen zelf opschreef, door inspiratie van de Geest.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom staat er bij de Bijbel wél \"voor zover juist vertaald\", maar niet bij het Boek van Mormon?",
        options: [
          "Omdat het Boek van Mormon rechtstreeks door inspiratie vertaald is, terwijl de Bijbel eeuwenlang is overgeschreven en herzien",
          "Omdat de Bijbel helemaal niet vertaald hoeft te worden",
          "Omdat het Boek van Mormon geen vertaling is, maar oorspronkelijk in het Nederlands geschreven is",
          "Omdat er geen verschil is tussen beide boeken",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze lezen geloofsartikel 8 voor en bespreken wat \"het woord van God\" betekent",
          "Ze bespreken hoe Nephi door inspiratie kon opschrijven wat 35 jaar eerder gebeurde",
          "Ze bespreken de verloren pagina's van de vertaling van het Boek van Mormon",
          "Ze bespreken waarom bij de Bijbel \"voor zover juist vertaald\" staat en bij het Boek van Mormon niet",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 1 Nephi 11 legt een engel aan Nephi uit waar de ijzeren roede uit Lehi's droom voor staat. Waarvoor staat die?",
        options: [
          "Het woord van God",
          "Het priesterschap",
          "De liefde van God",
          "De tempel",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar leidt de ijzeren roede volgens 1 Nephi 11 naartoe?",
        options: [
          "Naar de boom des levens",
          "Naar het grote en ruime gebouw",
          "Naar de rivier van vuil water",
          "Naar het land van belofte",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 1 Nephi 11 zijn de wateren waar de roede naartoe leidt een zinnebeeld van de liefde van God.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit Lehi's droom en de uitleg ervan in 1 Nephi 11 in de juiste volgorde.",
        items: [
          "Een engel toont Nephi een visioen dat lijkt op de droom van zijn vader",
          "Hij ziet de Zoon van God onder de mensen komen",
          "De engel legt uit dat de ijzeren roede het woord van God is",
          "De roede voert naar de boom des levens, bij de wateren die Gods liefde voorstellen",
        ],
      },
    ],
  },
  {
    number: 123,
    title: "Aflevering 123",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk onderwerp bespreken Koos en Raphael in deze aflevering, te beginnen met herinneringen aan Sinterklaas?",
        options: [
          "Verwachtingen, en wat er gebeurt als die niet uitkomen",
          "Het vieren van kerstfeest binnen de kerk",
          "Het geven van cadeaus als liefdadigheid",
          "De geschiedenis van Nederlandse feestdagen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vertelt dat hij ooit zijn baan kwijtraakte omdat een teamlid een belangrijke deadline niet haalde.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat gebeurde er toen Koos lage verwachtingen had van een stagiair?",
        options: [
          "De stagiair overtrof zijn verwachtingen, wat Koos blij verraste",
          "De stagiair voldeed precies aan de lage verwachtingen",
          "De stagiair stelde teleur, zoals verwacht",
          "Koos had helemaal geen stagiair die periode",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is volgens Koos de relatie tussen de hoogte van een verwachting en teleurstelling?",
        options: [
          "Hoe hoger de verwachting, hoe zwaarder de teleurstelling als die niet uitkomt",
          "Verwachtingen hebben geen enkel verband met teleurstelling",
          "Lage verwachtingen leiden juist tot de grootste teleurstelling",
          "Teleurstelling hangt alleen af van geluk, niet van verwachtingen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze herinneren zich hun kinderlijke verwachtingen rond Sinterklaas",
          "Ze bespreken verwachtingen op het werk en de gevolgen als die niet worden waargemaakt",
          "Koos vertelt over een stagiair die zijn lage verwachtingen overtrof",
          "Ze concluderen dat je je verwachtingen kunt bijstellen om teleurstelling te beperken",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Koos noemt dat teleurstelling hoort bij het \"tegenstellingenpatroon\" van het leven. In welk hoofdstuk van het Boek van Mormon legt Lehi dit principe uit aan zijn zoon Jakob?",
        options: ["2 Nephi 2", "Alma 32", "Mosiah 4", "Moroni 10"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt Lehi in 2 Nephi 2 dat er móét zijn, wil er ooit gerechtigheid of goddeloosheid, heiligheid of ellende kunnen bestaan?",
        options: [
          "Een tegenstelling in alle dingen",
          "Een tempel op aarde",
          "Een profeet die leeft",
          "Een geschreven wet",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Lehi in 2 Nephi 2 kon de mens niet zelfstandig handelen (agency uitoefenen), tenzij hij door het één of het ander verlokt werd.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen van Lehi's redenering in 2 Nephi 2 in de juiste volgorde.",
        items: [
          "Hij legt uit dat er een tegenstelling in alle dingen moet zijn",
          "Hij redeneert dat zonder wet er geen zonde en geen gerechtigheid kan bestaan",
          "Hij legt uit dat God de mens zelfstandig liet handelen",
          "Hij zegt dat de mens niet kon handelen zonder door iets verlokt te worden",
        ],
      },
    ],
  },
  {
    number: 122,
    title: "Aflevering 122",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke diepe theologische vraag staat in deze aflevering centraal?",
        options: [
          "Wat maakt een God eigenlijk een God?",
          "Waarom bestaat er lijden in de wereld?",
          "Hoe oud is de aarde volgens de Schriften?",
          "Wie schreef het boek Genesis?",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zeggen Koos en Raphael over hoe Jezus Christus en de Heilige Geest hun status als God hebben gekregen?",
        options: [
          "Ze zijn door Hemelse Vader benoemd/geroepen tot hun taak",
          "Ze zijn dat altijd al geweest, net als Hemelse Vader",
          "Ze werden God door menselijke aanbidding",
          "Niemand van hen is werkelijk een God",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Koos en Raphael zou je, als je de \"elementen kunt beheersen\" zoals in hun gedachte-experiment, daarmee automatisch een God worden.",
        answer: false,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom is Satan volgens Koos geen echte God, ook al heeft hij zichzelf zo uitgeroepen?",
        options: [
          "Omdat hij zijn macht ontleent aan het kwaad, en niet door God benoemd is",
          "Omdat hij geen kennis heeft",
          "Omdat hij geen naam heeft",
          "Omdat hij nooit heeft bestaan",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken het verschil tussen Hemelse Vader, Jezus Christus en de Heilige Geest",
          "Ze filosoferen over een gedachte-experiment: het beheersen van de elementen",
          "Ze bespreken waarom Satan zichzelf god noemt, maar het niet is",
          "Ze bespreken het idee dat mensen ooit zelf een God kunnen worden",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 3 Nephi 12 (de leer op de tempel) zegt Christus dat Hij wil dat wij net zo worden als wie?",
        options: [
          "Volmaakt, zoals Hij en de Vader in de hemel volmaakt zijn",
          "Volmaakt, zoals de engelen",
          "Volmaakt, zoals de profeten van weleer",
          "Christus zegt dat volmaaktheid onmogelijk is voor mensen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 3 Nephi 12 zijn de oude dingen (de wet van Mozes) weggedaan en alle dingen nieuw geworden door Christus.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is volgens deze tekst in 3 Nephi 12 het gevolg van kinderen van de Vader in de hemel worden?",
        options: [
          "Je wordt geroepen om net zo volmaakt te worden als Hij",
          "Je hoeft de geboden niet meer te houden",
          "Je krijgt automatisch alle antwoorden op je vragen",
          "Je wordt vrijgesteld van beproevingen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken van Christus in 3 Nephi 12 in de juiste volgorde.",
        items: [
          "Hij roept op om kinderen van de Vader in de hemel te zijn",
          "Hij zegt dat oude dingen (de wet van Mozes) zijn weggedaan",
          "Hij zegt dat alle dingen nieuw zijn geworden in Hem",
          "Hij roept op om volmaakt te zijn, zoals Hij en de Vader volmaakt zijn",
        ],
      },
    ],
  },
  {
    number: 121,
    title: "Aflevering 121",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel bespreken Koos en Raphael in deze aflevering?",
        options: ["Geloofsartikel 7 (de gaven van de Geest)", "Geloofsartikel 3", "Geloofsartikel 10", "Geloofsartikel 12"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke drie aparte gaven noemen ze naast elkaar: profetie, openbaring en...?",
        options: ["Visioenen", "Genezing", "Talen", "Vertaling"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Raphael en Koos krijgt iedereen precies dezelfde gaven van God toebedeeld.",
        answer: false,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarvoor wordt gewijde olijfolie gebruikt, zoals besproken bij de gave van gezondmaking?",
        options: [
          "Om iemand te zalven bij een zegen voor de zieken",
          "Om de doopvont te reinigen",
          "Om kaarsen te maken voor de tempel",
          "Om brood te bakken voor het avondmaal",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze lezen geloofsartikel 7 voor en bespreken wat een \"gave\" precies is",
          "Ze bespreken de gave van talen en zendelingen die snel een taal leren",
          "Ze bespreken profetie, openbaring en visioenen als aparte gaven",
          "Ze bespreken de gave van gezondmaking en het zalven met gewijde olie",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Raphael noemt de droom van Lehi en Nephi over de boom des levens als voorbeeld van een visioen. In welk hoofdstuk begint deze droom?",
        options: ["1 Nephi 8", "Alma 32", "Mosiah 4", "3 Nephi 12"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe smaakte de vrucht van de boom volgens Lehi's beschrijving in 1 Nephi 8?",
        options: [
          "Zoeter dan alles wat hij ooit had geproefd",
          "Bitter, maar toch waardevol",
          "Zout, als water uit de zee",
          "Smaakloos, maar met een aangename geur",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "In 1 Nephi 8 raken sommige mensen in een mist van duisternis hun weg kwijt en dwalen ze af van het pad naar de boom.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit Lehi's droom in 1 Nephi 8 in de juiste volgorde.",
        items: [
          "Lehi ziet een boom met begerenswaardige vrucht",
          "Hij proeft de vrucht en verlangt dat zijn gezin er ook van neemt",
          "Er komt een mist van duisternis op, waardoor mensen de weg kwijtraken",
          "Sommigen grijpen de ijzeren roede vast en klampen zich eraan vast op weg naar de boom",
        ],
      },
    ],
  },
  {
    number: 120,
    title: "Aflevering 120",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is het hoofdonderwerp van deze aflevering?",
        options: [
          "Wat het woord \"heilige\" precies betekent",
          "De geschiedenis van de eerste apostelen",
          "Het vieren van kerkelijke feestdagen",
          "De organisatie van de tempel",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Koos legt uit dat het woord \"heilig\" (Hebreeuws: kadosh) letterlijk betekent...",
        options: ["Toewijden / apart zetten", "Volmaakt zijn", "Overleden zijn", "Gedoopt zijn"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "In de katholieke traditie worden mensen meestal pas na hun overlijden heilig verklaard, terwijl het Nieuwe Testament levende gelovigen al \"heiligen\" noemt.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat wordt bedoeld met \"de Sabbatdag heiligen\"?",
        options: [
          "De dag apart zetten en toewijden aan God, in plaats van aan alledaagse bezigheden",
          "Nooit meer buiten mogen komen op zondag",
          "Een speciale maaltijd bereiden voor de kerkleiders",
          "Elke zondag een nieuwe heilige aanwijzen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Koos vertelt hoe hij het woord \"heilige\" kende vanuit zijn katholieke jeugd",
          "Raphael legt de Hebreeuwse betekenis van \"heilig\" (kadosh) uit",
          "Ze bespreken de naam \"De Kerk van Jezus Christus van de Heiligen der Laatste Dagen\"",
          "Koos vertelt over zijn eigen proces van heiliging, met een voorbeeld uit het verkeer",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Mosiah 3 zegt koning Benjamin dat de natuurlijke mens een vijand van God is, tenzij hij zich overgeeft aan de Heilige Geest en...",
        options: [
          "Een heilige wordt door de verzoening van Christus",
          "Zich terugtrekt uit de maatschappij",
          "Zich aan strenge vastenwetten houdt",
          "Alle bezittingen wegdoet",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe wordt iemand die de natuurlijke mens aflegt volgens Mosiah 3:19 als een kind — welke eigenschappen worden genoemd?",
        options: [
          "Onderworpen, zachtmoedig, ootmoedig, geduldig, vol liefde",
          "Streng, veeleisend, ongeduldig",
          "Onafhankelijk en op zichzelf",
          "Rijk en succesvol",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens koning Benjamin is de natuurlijke mens sinds de val van Adam een vijand van God geweest.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen uit Mosiah 3:19 in de juiste volgorde.",
        items: [
          "De natuurlijke mens is van nature een vijand van God",
          "Hij geeft zich over aan de ingevingen van de Heilige Geest",
          "Hij legt de natuurlijke mens af door de verzoening van Christus",
          "Hij wordt als een kind: onderworpen, zachtmoedig en vol liefde",
        ],
      },
    ],
  },
  {
    number: 119,
    title: "Aflevering 119",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke centrale vraag stellen Koos en Raphael zichzelf in deze aflevering?",
        options: [
          "Wat is geloof eigenlijk, en hoe verschilt dat van weten?",
          "Hoe kies je een zendingsgebied?",
          "Wat is het verschil tussen doop en bevestiging?",
          "Hoe organiseer je een gemeenteactiviteit?",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is volgens Koos en Raphael het verschil tussen geloof en kennis?",
        options: [
          "Geloof is overtuigd zijn zonder volledige zekerheid; kennis heb je niet meer nodig te geloven",
          "Geloof en kennis zijn precies hetzelfde",
          "Kennis is altijd zwakker dan geloof",
          "Geloof bestaat alleen bij kinderen, kennis alleen bij volwassenen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos zegt dat hij vaak liever getuigt van het effect dat zijn geloof in zijn leven heeft, dan simpelweg te zeggen \"ik weet het\".",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom zijn we volgens Raphael en Koos naar de aarde gestuurd zonder herinnering aan het voorbestaan?",
        options: [
          "Om geloof te kunnen oefenen",
          "Omdat herinneringen technisch onmogelijk zijn",
          "Om straf te ondergaan voor keuzes in het voorbestaan",
          "Om gelijk te zijn aan dieren",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken of \"geloven\" iets is wat iedereen doet, ook atheïsten",
          "Ze bespreken het verschil tussen geloof en kennis",
          "Ze bespreken getuigenissen waarin mensen zeggen \"ik weet\" in plaats van \"ik geloof\"",
          "Ze concluderen dat het hele plan van zaligheid draait om het oefenen van geloof",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe omschrijft Moroni geloof in Ether 12?",
        options: [
          "Hopen op iets dat je niet ziet",
          "Volledige, wetenschappelijke zekerheid hebben",
          "Een gevoel dat na verloop van tijd altijd verdwijnt",
          "Iets wat alleen profeten kunnen hebben",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Ether 12:6 ontvang je pas een getuigenis nádat je geloof op de proef is gesteld — niet ervoor.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wanneer toonde Christus zich volgens Ether 12 aan de mensen na zijn opstanding?",
        options: [
          "Pas nadat zij geloof in Hem hadden",
          "Alleen aan mensen die nog nooit van Hem gehoord hadden",
          "Aan iedereen, ongeacht geloof",
          "Alleen aan zijn twaalf apostelen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen van Moroni in Ether 12 in de juiste volgorde.",
        items: [
          "Geloof is hopen op iets dat je niet ziet",
          "Je ontvangt geen getuigenis vóórdat je geloof op de proef is gesteld",
          "Christus toonde zich pas aan mensen die al geloof in Hem hadden",
          "Zo kunnen ook wij deelgenoot worden van die hemelse gave, door geloof",
        ],
      },
    ],
  },
  {
    number: 118,
    title: "Aflevering 118",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel staat in deze aflevering centraal?",
        options: ["Geloofsartikel 6 (kerkorganisatie)", "Geloofsartikel 2", "Geloofsartikel 11", "Geloofsartikel 13"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke ambten noemt geloofsartikel 6 als onderdeel van dezelfde organisatie als de vroegchristelijke kerk?",
        options: [
          "Apostelen, profeten, herders, leraars, evangelisten",
          "Alleen bisschoppen en priesters",
          "Alleen de paus en kardinalen",
          "Alleen de twaalf apostelen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Koos en Raphael heet de kerk officieel \"De Kerk van Jezus Christus van de Heiligen der Laatste Dagen\" omdat de kerk van Christus is, niet van de heiligen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk voorbeeld noemen ze van voortdurende openbaring in het Nieuwe Testament, om de vroege kerk te laten groeien?",
        options: [
          "De openbaring dat het evangelie ook aan niet-Joden gebracht mocht worden",
          "De openbaring om de tempel in Jeruzalem te herbouwen",
          "De openbaring om een nieuwe kalender in te voeren",
          "De openbaring om Grieks als kerktaal te gebruiken",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze lezen geloofsartikel 6 voor en bespreken de ambten die erin genoemd worden",
          "Ze bespreken waarom de kerk \"van Jezus Christus\" heet, en niet \"Mormoonse kerk\"",
          "Ze bespreken hoe de kerk na de apostelen verdween en later hersteld werd",
          "Ze bespreken voortdurende openbaring, met voorbeelden uit het Nieuwe Testament",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Moroni 6 wordt beschreven hoe de kerk onder de Nephieten georganiseerd was. Welke ambtsdragers worden daar genoemd?",
        options: ["Ouderlingen, priesters en leraren", "Alleen koningen", "Alleen profeten", "Ridders en edelen"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom kwamen de leden van de kerk volgens Moroni 6 dikwijls samen?",
        options: [
          "Om te vasten, te bidden en met elkaar te spreken over het welzijn van hun ziel, en om het avondmaal te nemen",
          "Om alleen belastingen te innen",
          "Om oorlogsplannen te bespreken",
          "Om alleen feest te vieren",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 6 werd niemand tot de doop toegelaten, tenzij die zich oprecht van zijn zonden had bekeerd.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze beschrijvingen van de vroege kerk uit Moroni 6 in de juiste volgorde.",
        items: [
          "Mensen werden pas gedoopt na oprechte bekering",
          "Na de doop werden ze bij het volk van de kerk gerekend en hun naam opgeschreven",
          "De leden kwamen vaak samen om te vasten, te bidden en te spreken",
          "De bijeenkomsten werden geleid door de macht van de Heilige Geest",
        ],
      },
    ],
  },
  {
    number: 117,
    title: "Aflevering 117",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk bijbelverhaal, uit het \"Kom en Volg mij\"-lesprogramma, bespreken Koos en Raphael in deze aflevering?",
        options: ["David en Goliath", "Noach en de ark", "Jozef en zijn broers", "Daniël in de leeuwenkuil"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom besloot David om tegen Goliath te vechten?",
        options: [
          "Hij kon niet verdragen dat Goliath het volk en de God van Israël bespotte",
          "De koning dwong hem ertoe",
          "Hij wilde beroemd worden",
          "Hij verloor een weddenschap",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "David weigerde het harnas van koning Saul te dragen omdat hij er niet aan gewend was en er niet in kon lopen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar had David geoefend met een slinger en stenen, voordat hij tegen Goliath vocht?",
        options: [
          "Als schaapherder, tegen leeuwen en beren die de kudde aanvielen",
          "Als soldaat in het leger van koning Saul",
          "Tijdens een speciale training aan het hof",
          "Hij had nooit eerder een slinger gebruikt",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken het verhaal van David en Goliath",
          "Ze bespreken de afstammingslijn van David naar Christus",
          "Ze filosoferen over voorbestemming versus keuzevrijheid",
          "Koos vertelt een persoonlijk verhaal over een \"toevallige\" vondst als zegening",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 13 wordt uitgelegd dat hogepriesters al \"sedert de grondlegging der wereld\" geroepen en voorbereid waren, wegens hun...",
        options: [
          "Buitengewone geloof en goede werken",
          "Afkomst en familienaam",
          "Rijkdom en aanzien",
          "Leeftijd",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is volgens Alma 13 de reden dat sommigen deze heilige roeping wél kregen en anderen niet?",
        options: [
          "Ieder had oorspronkelijk gelijke kansen; sommigen verkozen de Geest te verwerpen door verstoktheid van hart",
          "Het was volledig willekeurig",
          "Alleen wie rijk geboren werd, kon geroepen worden",
          "Iedereen kreeg exact dezelfde roeping",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 13 waren de hogepriesters vanaf het begin al hetzelfde als hun broeders, met dezelfde vrije keuze.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen uit Alma 13 over voorbeschikking in de juiste volgorde.",
        items: [
          "Aanvankelijk waren alle mensen gelijk, met dezelfde vrije keuze",
          "Sommigen oefenden buitengewoon geloof en goede werken uit",
          "Zij werden, naar Gods voorkennis, al vanaf de grondlegging der wereld voorbereid",
          "Zij werden geroepen en geordend tot het heilige priesterschap",
        ],
      },
    ],
  },
  {
    number: 116,
    title: "Aflevering 116",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke vraag stelt Koos aan het begin van deze aflevering, die het hele gesprek op gang brengt?",
        options: [
          "Geniet jij nog wel een beetje van het leven?",
          "Wat is jouw favoriete Bijbelboek?",
          "Wil je ooit zendingspresident worden?",
          "Welke muziek luister je het liefst?",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom drinken Koos en Raphael geen alcohol, koffie of thee?",
        options: [
          "Vanwege het Woord van Wijsheid, een leefregel van hun kerk",
          "Omdat het wettelijk verboden is in Nederland",
          "Omdat ze er allergisch voor zijn",
          "Omdat hun dokter het heeft afgeraden",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vertelt dat hij het idee dat je alcohol nodig hebt om iets gezellig te maken, herkent bij vrienden die geen lid van de kerk zijn.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe omschrijft Koos zijn eigen definitie van \"zonde\"?",
        options: [
          "God niet goed genoeg of niet vaak genoeg betrekken in je leven — \"zonder\" God leven",
          "Elke overtreding van de Nederlandse wet",
          "Iets wat alleen kerkleiders kunnen begaan",
          "Uitsluitend het drinken van alcohol",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken waarvan ze zelf genieten in het leven",
          "Ze bespreken het Woord van Wijsheid en het beeld dat buitenstaanders daarvan hebben",
          "Ze bespreken of geboden je vrijheid beperken of juist beschermen",
          "Ze bespreken of God wil dat we van het leven genieten",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt Lehi in 2 Nephi 2:25 over het doel waarom mensen bestaan?",
        options: [
          "Adam viel, opdat de mensen zouden zijn; en de mensen zijn, opdat zij vreugde zullen hebben",
          "Mensen bestaan alleen om te lijden en te boeten",
          "Mensen bestaan om zich zoveel mogelijk af te zonderen van de wereld",
          "Mensen bestaan om rijkdom te vergaren",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 2 Nephi 2 zijn mensen, na verlost te zijn van de val, vrij om zelfstandig te handelen en te kiezen tussen vrijheid en eeuwig leven, of gevangenschap en dood.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is er nodig, volgens 2 Nephi 2, om de mensenkinderen van de val te verlossen?",
        options: [
          "De komst van de Messias in de volheid der tijden",
          "Het bouwen van tempels",
          "Het houden van de wet van Mozes",
          "Het bereiken van rijkdom en aanzien",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen uit 2 Nephi 2 in de juiste volgorde.",
        items: [
          "Adam viel, opdat de mensen zouden bestaan",
          "De mensen bestaan opdat zij vreugde zullen hebben",
          "De Messias verlost de mensenkinderen van de val",
          "Zij worden vrij om zelfstandig te kiezen tussen vrijheid en gevangenschap",
        ],
      },
    ],
  },
  {
    number: 115,
    title: "Aflevering 115",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel bespreken Koos en Raphael in deze aflevering?",
        options: [
          "Geloofsartikel 5 (roeping door profetie en handoplegging)",
          "Geloofsartikel 1",
          "Geloofsartikel 8",
          "Geloofsartikel 12",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is nodig, volgens geloofsartikel 5, om het evangelie te mogen prediken en verordeningen te bedienen?",
        options: [
          "Geroepen worden door profetie en handoplegging van iemand met het juiste gezag",
          "Een universitaire theologische opleiding",
          "Minstens tien jaar lidmaatschap van de kerk",
          "Een aanbeveling van de burgemeester",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael legt uit dat hij, ook al draagt hij het priesterschap, zijn zesjarige zoon niet zomaar zelf het priesterschap mag geven zonder toestemming van iemand met de sleutels.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Koos leest een voorbeeld voor uit Numeri 27, waarin Mozes door handoplegging wie aanstelt als zijn opvolger?",
        options: ["Jozua", "Aäron", "Kaleb", "Eleazar"],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze lezen geloofsartikel 5 voor en bespreken wat \"gezag\" precies inhoudt",
          "Ze bespreken het voorbeeld van Mozes die Jozua door handoplegging aanstelt",
          "Ze bespreken hoe Joseph Smith en Oliver Cowdery het priesterschap terug ontvingen",
          "Ze bespreken waarom de zoon van Joseph Smith geen automatische opvolger werd",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Moroni 3 wordt beschreven hoe discipelen priesters en leraren ordenden. Wat deden ze eerst, voordat ze de handen oplegden?",
        options: [
          "Zij baden tot de Vader in de naam van Christus",
          "Zij vastten veertig dagen",
          "Zij reisden naar Jeruzalem",
          "Zij wachtten op een droom",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In wiens naam ordenden de discipelen volgens Moroni 3 een priester of leraar?",
        options: ["In de naam van Jezus Christus", "In hun eigen naam", "In de naam van de koning", "Zonder een naam te noemen"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 3 ordenden de discipelen priesters en leraren door de macht van de Heilige Geest, die in hen was.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen van een ordening in Moroni 3 in de juiste volgorde.",
        items: [
          "De discipelen bidden tot de Vader in de naam van Christus",
          "Zij leggen de handen op het hoofd van de persoon",
          "Zij ordenen hem in de naam van Jezus Christus tot priester of leraar",
          "Dit gebeurt door de macht van de Heilige Geest die in hen is",
        ],
      },
    ],
  },
  {
    number: 114,
    title: "Aflevering 114",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke gasten schuiven in deze aflevering aan bij Koos en Raphael?",
        options: [
          "David en Kevin, makers van de Belgische podcast \"De Kast van Mormon\"",
          "Twee zendingspresidenten uit Utah",
          "Een historicus en een archeoloog",
          "Twee muzikanten van het kerkkoor",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is het \"Jesus Loves You\"-initiatief dat David beschrijft?",
        options: [
          "Gratis plastic poppetjes die mensen weggeven aan wie steun kan gebruiken",
          "Een jaarlijkse liefdadigheidsloop",
          "Een gratis Bijbel-app",
          "Een reeks kerstkaarten",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "David vertelt dat hij als wetenschapper en computeringenieur het Boek van Mormon onderzocht en tot de conclusie kwam dat de meest simpele verklaring is dat het goddelijke openbaring is.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom kozen David en Kevin ervoor om de naam van hun kerk wél expliciet in hun podcastnaam en -omschrijving te noemen?",
        options: [
          "Om heel bewust het nieuws over hun kerk in een positief daglicht te kunnen behandelen",
          "Omdat het verplicht was door de kerk",
          "Om reclame-inkomsten te verhogen",
          "Om verwarring met andere podcasts te voorkomen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "David en Kevin stellen zichzelf en hun podcast voor",
          "David vertelt zijn bekeringsverhaal als voormalig atheïstische wetenschapper",
          "David vertelt over het \"Jesus Loves You\"-poppetjesinitiatief",
          "Kevin sluit af met een uitnodiging gebaseerd op Moroni 10",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Kevin citeert aan het eind van de aflevering Moroni 10:3-5. Waartoe spoort Moroni de lezer daar toe aan?",
        options: [
          "Om God in de naam van Christus te vragen of het Boek van Mormon waar is",
          "Om het boek driemaal te lezen voordat je het gelooft",
          "Om naar een profeet te reizen voor bevestiging",
          "Om te wachten op een droom",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Met welke drie dingen moet je die vraag volgens Moroni 10:4 stellen om een antwoord te ontvangen?",
        options: [
          "Een oprecht hart, een eerlijke bedoeling en geloof in Christus",
          "Een getuige, een notaris en een advocaat",
          "Vasten, een offer en een gelofte",
          "Geduld, geld en tijd",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 10:5 kun je door de macht van de Heilige Geest de waarheid van alle dingen kennen, niet alleen van het Boek van Mormon.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen uit Moroni's aansporing in Moroni 10 in de juiste volgorde.",
        items: [
          "Bedenk hoe barmhartig de Heer is geweest sinds de schepping van Adam",
          "Vraag God, de eeuwige Vader, in de naam van Christus of het waar is",
          "Vraag met een oprecht hart, een eerlijke bedoeling en geloof in Christus",
          "Ontvang de waarheid geopenbaard door de macht van de Heilige Geest",
        ],
      },
    ],
  },
  {
    number: 113,
    title: "Aflevering 113",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Uit welk bijbelboek leest Koos aan het begin van deze aflevering, waarin Mozes zijn laatste woorden aan het volk geeft?",
        options: ["Deuteronomium", "Genesis", "Exodus", "Numeri"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat gebeurde er met de eerste stenen tafelen die Mozes van de berg meebracht?",
        options: [
          "Mozes gooide ze kapot uit woede over het gouden kalf",
          "Ze werden gestolen door de Filistijnen",
          "Ze smolten in de zon",
          "Ze werden in de ark van het verbond bewaard en nooit meer gezien",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos en Raphael geloven dat de tweede set stenen tafelen een eenvoudigere versie van de wet bevatte dan de eerste set.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke lastige vraag stellen Koos en Raphael zich over \"de andere wang toekeren\"?",
        options: [
          "Of het christelijk is om altijd maar alles over je heen te laten komen",
          "Of je wel of niet naar de kerk mag gaan zonder tien te betalen",
          "Of je wel mag werken op zondag",
          "Of je kinderen wel opvoeding mogen krijgen buiten de kerk",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken Mozes' laatste boodschap in Deuteronomium",
          "Ze bespreken de twee sets stenen tafelen met de tien geboden",
          "Ze bespreken overeenkomsten tussen de oudtestamentische tabernakel en de tempel van nu",
          "Ze bespreken of \"de andere wang toekeren\" betekent dat je alles moet accepteren",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 3 Nephi 12 (de leer op de tempel) leert Christus over \"de andere wang toekeren\". Wat zegt Hij precies?",
        options: [
          "Het kwaad niet te weerstaan, en wie u op de rechterwang slaat, ook de andere toe te keren",
          "Om altijd onmiddellijk terug te vechten",
          "Om conflicten volledig te vermijden",
          "Om een rechtszaak aan te spannen tegen wie je kwaad doet",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat leert Christus in datzelfde hoofdstuk over hoe je met je vijanden moet omgaan?",
        options: [
          "Heb uw vijanden lief, zegen hen die u vervloeken en bid voor wie u vervolgen",
          "Vermijd vijanden volledig en negeer ze",
          "Beantwoord kwaad met kwaad, oog om oog",
          "Vraag de rechter om wraak te nemen namens jou",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 3 Nephi 12 is het doel van het liefhebben van je vijanden dat je kinderen wordt van je Vader in de hemel.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze leringen van Christus uit 3 Nephi 12 in de juiste volgorde.",
        items: [
          "Weersta het kwaad niet, en keer de andere wang toe",
          "Geef aan wie van u vraagt, en wend u niet af van wie wil lenen",
          "Heb uw vijanden lief en zegen wie u vervloeken",
          "Zo wordt u kinderen van uw Vader in de hemel",
        ],
      },
    ],
  },
  {
    number: 112,
    title: "Aflevering 112",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel bespreken Koos en Raphael in deze aflevering?",
        options: [
          "Geloofsartikel 4 (de eerste beginselen en verordeningen)",
          "Geloofsartikel 7",
          "Geloofsartikel 10",
          "Geloofsartikel 3",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zijn volgens geloofsartikel 4 de vier eerste beginselen en verordeningen van het evangelie?",
        options: [
          "Geloof in Jezus Christus, bekering, doop door onderdompeling, handoplegging voor de Heilige Geest",
          "Vasten, offergaven, tempeldienst, zending",
          "Gebed, schriftstudie, tiende, kerkbezoek",
          "Doop, avondmaal, huwelijk, begrafenis",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael vergelijkt de doop met een sleutel die het pad opent dat terugleidt naar Hemelse Vader — niet het einddoel zelf, maar het begin.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom nemen leden van de kerk volgens Koos en Raphael elke week het avondmaal?",
        options: [
          "Om hun doopverbond te vernieuwen en dat verbond levend te houden",
          "Omdat het verplicht is door de wet",
          "Om hun lidmaatschap opnieuw te bevestigen elke maand",
          "Om een nieuwe naam te ontvangen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze lezen geloofsartikel 4 voor en bespreken de volgorde van de vier beginselen",
          "Ze bespreken waarom de doop gekoppeld is aan vergeving van zonden",
          "Ze bespreken het avondmaal als vernieuwing van het doopverbond",
          "Ze concluderen dat de doop een begin is, geen eindpunt",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 2 Nephi 31 legt Nephi \"de leer van Christus\" uit. Wat noemt hij als de poort waardoor je moet binnengaan?",
        options: [
          "Bekering en doop door onderdompeling",
          "Het betalen van tiende",
          "Het bouwen van een tempel",
          "Het reizen naar Jeruzalem",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat gebeurt er volgens 2 Nephi 31 nadat je door de poort bent gegaan en de Heilige Geest hebt ontvangen?",
        options: [
          "Je moet met standvastig geloof in Christus voortgaan tot het einde",
          "Dan is alles klaar en hoef je niets meer te doen",
          "Dan mag je zelf bepalen of je nog geboden houdt",
          "Dan begint het proces helemaal opnieuw",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 2 Nephi 31 is er geen andere weg of naam onder de hemel gegeven waardoor de mens behouden kan worden in het koninkrijk van God.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen uit Nephi's \"leer van Christus\" in 2 Nephi 31 in de juiste volgorde.",
        items: [
          "Je gaat door de poort: bekering en doop",
          "Je ontvangt de Heilige Geest",
          "Je streeft standvastig voorwaarts, met hoop en liefde",
          "Je volhardt tot het einde en ontvangt het eeuwige leven",
        ],
      },
    ],
  },
  {
    number: 111,
    title: "Aflevering 111",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke prikkelende vraag stelt Koos aan het begin van deze aflevering, naar aanleiding van zijn Bijbellezing in Exodus?",
        options: [
          "Vindt Raphael dat God humor heeft?",
          "Waarom werden er geen vrouwelijke profeten geroepen?",
          "Waarom duurde de schepping zes dagen?",
          "Waarom mocht Mozes het beloofde land niet in?",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat gebeurde er toen Mozes zijn staf op de grond gooide, op Gods aanwijzing?",
        options: ["De staf werd een slang", "De staf brak in tweeën", "De staf werd goud", "Er niets"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Toen het volk in de woestijn klaagde over honger, stuurde God zowel manna als kwartels.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat gebeurde er nadat het volk bleef klagen en God vurige (giftige) slangen stuurde?",
        options: [
          "Mozes maakte een koperen slang; wie ernaar keek, werd genezen",
          "Het volk moest veertig dagen vasten als straf",
          "Alle slangen verdwenen vanzelf na een week",
          "Mozes bad en de slangen werden onmiddellijk gedood",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit Exodus, zoals besproken in de aflevering, in de juiste volgorde.",
        items: [
          "Mozes' staf verandert in een slang bij de brandende struik",
          "De tien plagen treffen Egypte, en de Israëlieten vertrekken",
          "Het volk klaagt in de woestijn over honger en dorst",
          "Vurige slangen bijten het klagende volk, en de koperen slang geneest hen",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 33 legt Alma uit waar de koperen slang van Mozes een zinnebeeld van was. Waarvan?",
        options: [
          "Van Christus — wie op Hem vertrouwt en \"kijkt\", zal genezen worden",
          "Van de wet van Mozes in het algemeen",
          "Van de duivel die overwonnen moet worden",
          "Van de twaalf stammen van Israël",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom kwamen sommigen om, ondanks dat de genezing zo eenvoudig was als kijken naar de slang?",
        options: [
          "Wegens de verstoktheid van hun hart wilden zij niet kijken",
          "Ze waren te ver weg om het te zien",
          "De slang was op dat moment kapot",
          "Ze waren al genezen voordat ze konden kijken",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 33 zouden mensen, als ze eenvoudig genezen konden worden door hun ogen op te slaan, dat zeker snel doen — tenzij hun hart verstokt is.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen van Alma over de koperen slang in Alma 33 in de juiste volgorde.",
        items: [
          "Mozes richtte in de wildernis een zinnebeeld op",
          "Wie ernaar keek, leefde",
          "Velen weigerden te kijken, wegens de verstoktheid van hun hart",
          "Alma roept op de ogen op te slaan en in de Zoon van God te geloven",
        ],
      },
    ],
  },
  {
    number: 110,
    title: "Aflevering 110",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel bespreken Koos en Raphael in deze aflevering?",
        options: [
          "Geloofsartikel 3 (redding door de verzoening en gehoorzaamheid)",
          "Geloofsartikel 6",
          "Geloofsartikel 9",
          "Geloofsartikel 12",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt geloofsartikel 3 over hoe de mensheid gered kan worden?",
        options: [
          "Door de verzoening van Christus, én door gehoorzaamheid aan de wetten en verordeningen van het evangelie",
          "Alleen door één keer te verklaren dat je Christus accepteert",
          "Alleen door goede werken, zonder dat Christus nodig is",
          "Door geboorte in een bepaald land",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos legt uit dat sommige andere christelijke stromingen geloven dat je alleen Christus als redder hoeft te accepteren, zonder verdere verordeningen — iets waarin hun kerk dus verschilt.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke verordening noemen Koos en Raphael als absolute noodzaak om in het koninkrijk van God te komen?",
        options: ["Doop", "Het huwelijk", "Vasten", "Tempelbezoek"],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze lezen geloofsartikel 3 voor en bespreken wat opvalt",
          "Ze bespreken hoe dit verschilt van \"eenmalig accepteren is genoeg\"-geloofsopvattingen",
          "Ze proberen te achterhalen welke \"wetten\" precies bedoeld worden",
          "Ze concluderen dat geloof zonder werken dood is",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke beroemde uitspraak doet Nephi in 2 Nephi 25:23 over genade en eigen inspanning?",
        options: [
          "Wij weten dat wij, na alles wat wij kunnen doen, door genade worden gered",
          "Genade is niet nodig als je genoeg goede werken doet",
          "Alleen wie de wet van Mozes volledig houdt, wordt gered",
          "Redding is volledig onafhankelijk van Christus",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom bleven Nephi en zijn volk de wet van Mozes onderhouden, terwijl ze al in Christus geloofden?",
        options: [
          "Ze zagen ernaar uit naar Christus, totdat de wet vervuld zou zijn, en hielden de wet vanwege de geboden",
          "Ze wisten nog niets van Christus",
          "De wet van Mozes had niets met Christus te maken",
          "Ze deden het uit angst voor straf, niet uit geloof",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 2 Nephi 25:26 schreven Nephi en de zijnen over Christus, verheugden zij zich in Christus en profeteerden zij over Christus, opdat hun kinderen zouden weten op welke bron zij konden vertrouwen voor vergeving.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen uit 2 Nephi 25 in de juiste volgorde.",
        items: [
          "Nephi's volk gelooft in Christus, maar houdt ook de wet van Mozes",
          "Zij zien standvastig naar Christus uit, totdat de wet vervuld zal zijn",
          "Zij schrijven, prediken en profeteren over Christus",
          "Zij worden, na alles wat zij kunnen doen, door genade gered",
        ],
      },
    ],
  },
  {
    number: 109,
    title: "Aflevering 109",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke vraag van een luisteraar bespreken Koos en Raphael in deze aflevering?",
        options: [
          "Is geen seks voor het huwelijk wel zo'n goed idee?",
          "Mag je trouwen zonder kerkelijke plechtigheid?",
          "Hoeveel kinderen moet je krijgen?",
          "Mag je scheiden als lid van de kerk?",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is volgens Koos het verschil tussen de twee grote geboden en de vijf wetten?",
        options: [
          "De twee geboden (God en je naaste liefhebben) vallen onder de wet van het evangelie, één van de vijf wetten",
          "Er is helemaal geen verschil",
          "De vijf wetten zijn ouder dan de twee geboden",
          "De twee geboden gelden alleen voor profeten",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael legt uit dat een huwelijk voor de wet, zonder tempelverzegeling, in hun geloofsovertuiging niet \"voor tijd en alle eeuwigheid\" geldt.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom is exclusiviteit (alleen seks met je huwelijkspartner) volgens Raphael belangrijk?",
        options: [
          "Het beschermt het gezin en de relatie tegen schade van buitenaf",
          "Het heeft geen enkele functie, het is puur een regel",
          "Het is alleen belangrijk voor de kerkleider, niet voor gewone leden",
          "Het voorkomt uitsluitend financiële problemen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken de luisteraarsvraag over seks voor het huwelijk",
          "Ze bespreken het verschil tussen de twee geboden en de vijf wetten",
          "Ze bespreken wat een eeuwig huwelijk (verzegeling) anders maakt dan een gewoon huwelijk",
          "Ze bespreken waarom exclusiviteit een relatie beschermt",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Jakob 2 waarschuwt Jakob het volk streng tegen onkuisheid. Wat zegt de Heer daar via Jakob over de kuisheid van vrouwen?",
        options: [
          "Ik, de Heer God, schep behagen in de kuisheid der vrouwen",
          "Kuisheid is alleen belangrijk voor priesters",
          "Kuisheid is een menselijke uitvinding, geen goddelijk gebod",
          "Alleen mannen hoeven kuis te zijn",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe noemt Jakob hoererij (onkuisheid) in dit hoofdstuk?",
        options: ["Een gruwel in Gods ogen", "Een klein foutje zonder gevolgen", "Een privékwestie die niemand aangaat", "Een wettelijk toegestane keuze"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Jakob 2 waarschuwt de Heer dat het land vervloekt zal worden als het volk zijn geboden, waaronder kuisheid, niet onderhoudt.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen van Jakob over kuisheid in Jakob 2 in de juiste volgorde.",
        items: [
          "Jakob spreekt het volk streng toe over hun zonden",
          "Hij zegt dat de Heer behagen schept in de kuisheid der vrouwen",
          "Hij noemt hoererij een gruwel in Gods ogen",
          "Hij waarschuwt dat het land vervloekt wordt als de geboden niet onderhouden worden",
        ],
      },
    ],
  },
  {
    number: 108,
    title: "Aflevering 108",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wie is de gast in deze aflevering, een voormalig directeur/collega van Raphael?",
        options: ["Erik van 't Hoff", "David en Kevin", "Lisette en Sheila", "Ouderling Renlund"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk begrip had Erik, opgegroeid in een ander kerkgenootschap, nog nooit eerder gehoord?",
        options: [
          "Het celestiale koninkrijk (en de andere graden van heerlijkheid)",
          "De doop",
          "Het gebed",
          "Kerstmis",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Erik vertelt dat hij, na veel nadenken over ingewikkelde theologische details, steeds meer teruggrijpt naar de twee grote geboden: God liefhebben en je naaste liefhebben.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoeveel jaar zaten er volgens Koos ongeveer tussen de laatste profeet in het Boek van Mormon en het eerste visioen van Joseph Smith?",
        options: ["Ongeveer 1400 jaar", "Ongeveer 100 jaar", "Ongeveer 50 jaar", "Ongeveer 3000 jaar"],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Erik stelt zich voor en vertelt hoe hij Raphael kent",
          "Ze bespreken de graden van heerlijkheid en de Godheid",
          "Ze bespreken veranderingen die Erik in zijn eigen kerk heeft meegemaakt",
          "Ze bespreken het idee van een herstelde kerk via Joseph Smith",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 3 Nephi 11 verschijnt Christus aan het volk op het Amerikaanse continent. Wat zegt de stem van de Vader vlak voordat Christus neerdaalt?",
        options: [
          "Ziet mijn geliefde Zoon, in wie Ik mijn welbehagen heb; luistert naar Hem",
          "Vernietig deze stad, want zij is goddeloos",
          "Keer terug naar Jeruzalem",
          "Bouw hier een tempel",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe stelt Christus zichzelf voor aan het volk in 3 Nephi 11?",
        options: [
          "Ik ben Jezus Christus, die volgens het getuigenis der profeten in de wereld zou komen",
          "Ik ben een engel, gezonden om jullie te waarschuwen",
          "Ik ben Mozes, teruggekeerd om de wet te herhalen",
          "Ik ben een van de twaalf apostelen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 3 Nephi 11 daalde Christus neer, gekleed in een wit gewaad, en stond Hij in het midden van het volk.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit 3 Nephi 11 in de juiste volgorde.",
        items: [
          "Het volk hoort een stem uit de hemel die zij eerst niet begrijpen",
          "De stem van de Vader zegt: luistert naar Hem",
          "Zij zien een Man in een wit gewaad uit de hemel neerdalen",
          "Hij stelt zich voor als Jezus Christus",
        ],
      },
    ],
  },
  {
    number: 107,
    title: "Aflevering 107",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is de bijzondere opzet van deze aflevering, samen met Renco en Dick van een andere podcast?",
        options: [
          "Ze hebben elkaars kerkdiensten bezocht en wisselen hun ervaringen uit",
          "Ze nemen samen een liveshow op voor een groot publiek",
          "Ze bespreken een gezamenlijk goede-doelenactie",
          "Ze interviewen een kerkhistoricus",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat viel Koos vooral positief op tijdens zijn bezoek aan de Verrijzeniskerk?",
        options: [
          "De hoeveelheid mensen en gezinnen, de gebeden van de gastvrouw en de preek",
          "De korte duur van de dienst",
          "Het ontbreken van muziek",
          "De strenge kledingvoorschriften",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vond het ongemakkelijk dat sommige mensen tijdens de liederen gingen staan en anderen niet, omdat dat in zijn eigen kerk altijd voor iedereen gelijk verloopt.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarover ging de preek die Raphael als \"stevig\" ervoer?",
        options: [
          "Of je een echte volgeling van Christus bent, of slechts meeloopt met de menigte",
          "De geschiedenis van de kerkhervorming",
          "Het belang van tienden geven",
          "De opbouw van het Oude Testament",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Koos en Raphael vertellen over hun verwachtingen vooraf",
          "Ze bespreken de grootte van de kerk, de muziek en het staan tijdens liederen",
          "Ze bespreken de preek over discipelschap",
          "Ze bespreken wat ze uit elkaars kerk zouden willen meenemen (zoals het avondmaal)",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Koos noemt het avondmaal een teken van het verbond. In Mosiah 5 legt koning Benjamin uit welke naam je op je neemt bij dat verbond. Welke?",
        options: ["De naam van Christus", "De naam van de profeet", "Je eigen doopnaam", "De naam van je stam"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat worden de mensen genoemd die dit verbond sluiten, volgens Mosiah 5:7?",
        options: [
          "Kinderen van Christus, zijn zonen en dochters",
          "Alleen dienstknechten, zonder verdere relatie",
          "Vreemdelingen die nog niet welkom zijn",
          "Verre bekenden",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Mosiah 5:8 is er geen andere naam gegeven waardoor redding komt dan de naam van Christus.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen uit Mosiah 5 in de juiste volgorde.",
        items: [
          "Het volk sluit een verbond met God",
          "Zij worden geestelijk verwekt en kinderen van Christus genoemd",
          "Zij nemen de naam van Christus op zich",
          "Wie dat doet, zal ter rechterhand van God worden bevonden",
        ],
      },
    ],
  },
  {
    number: 106,
    title: "Aflevering 106",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk nieuws bespreken Koos en Raphael in deze aflevering?",
        options: [
          "Een wereldwijde wijziging in het zondagsprogramma van de kerk, vanaf september",
          "Een nieuwe tempel die gebouwd gaat worden in Nederland",
          "Een nieuwe editie van het Boek van Mormon",
          "Een wijziging in de doopleeftijd",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat verandert er concreet aan het lesprogramma vanaf september?",
        options: [
          "Zondagsschool en priesterschap/ZTV worden weer beide elke week gegeven, binnen twee uur, dus korter per les",
          "Er komt een derde uur bij, terug naar drie uur totaal",
          "Alle lessen worden volledig online gegeven",
          "Er komen helemaal geen lessen meer, alleen nog een preek",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos is aanvankelijk sceptisch en denkt dat 25 minuten per les te kort is om echt tot verdieping te komen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat stellen Koos en Raphael gekscherend voor als \"oplossing\" voor de korte lestijd?",
        options: [
          "Hun eigen podcast afspelen tijdens de les, gevolgd door nabespreking",
          "De lessen helemaal afschaffen",
          "Alleen nog schriftelijke huiswerkopdrachten geven",
          "De diensten weer naar drie uur verlengen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Raphael vertelt over het nieuwsbericht met de programmawijziging",
          "Ze kijken terug op de eerdere wijziging van drie naar twee uur kerkdienst",
          "Ze bespreken de nieuwe, kortere lestijden en of dat gaat werken",
          "Ze grappen over hun podcast als vervanging voor lesvoorbereiding",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 2 Nephi 28:30 wordt gesproken over hoe God zijn kinderen onderwijst. Hoe wordt dat daar omschreven?",
        options: [
          "Regel op regel, voorschrift op voorschrift, hier een weinig en daar een weinig",
          "In één keer alles volledig geopenbaard, zonder verdere aanpassing",
          "Alleen via droom en visioen, nooit via gewone instructie",
          "Uitsluitend via geschreven brieven van apostelen",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat belooft de Heer volgens 2 Nephi 28:30 aan wie zijn voorschriften ter harte neemt?",
        options: [
          "Hij zal hun meer geven, en zij zullen wijsheid leren",
          "Hij zal hen meteen alle geheimen onthullen",
          "Hij zal geen verdere voorschriften meer geven",
          "Hij zal hen rijkdom schenken",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 2 Nephi 28:31 is het niet verkeerd om naar voorschriften van mensen te luisteren, zolang die door de macht van de Heilige Geest gegeven worden.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen uit 2 Nephi 28:30-31 in de juiste volgorde.",
        items: [
          "God geeft zijn kinderen regel op regel, voorschrift op voorschrift",
          "Gezegend zijn zij die naar zijn voorschriften luisteren",
          "Wie ontvangt, zal Hij meer geven",
          "Vervloekt is wie vertrouwt op voorschriften zonder de macht van de Heilige Geest",
        ],
      },
    ],
  },
  {
    number: 105,
    title: "Aflevering 105",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke mijlpaal vieren Koos en Raphael in deze aflevering?",
        options: ["Het tweejarig bestaan van hun podcast", "Hun 500e aflevering", "De start van hun eigen kerkgebouw", "Een prijs voor beste podcast"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wie noemt Raphael als hoogtepunt van het afgelopen jaar, die hij persoonlijk mocht ontmoeten?",
        options: [
          "Ouderling Renlund, een van de twaalf apostelen",
          "De profeet van de kerk zelf",
          "Een bekende Nederlandse acteur",
          "Zijn eigen overgrootvader",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael vertelt dat er tijdens de ringconferentie geen foto's, video of audio-opnames gemaakt mochten worden van de toespraken van de apostel.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk toekomstig doel kondigt Koos aan voor het volgende jaar van de podcast?",
        options: [
          "Een crowdfundingactie om samen naar de open dag van de Salt Lake tempel te gaan",
          "Het stoppen met de podcast",
          "Het overstappen naar alleen tekstberichten, geen audio meer",
          "Het verkopen van de podcast aan een groot mediabedrijf",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze vieren het tweejarig bestaan en blikken terug op hun doelen",
          "Raphael vertelt over zijn ontmoeting met ouderling Renlund",
          "Ze bespreken hun tempelbezoeken in Rome, Zwitserland en Frankfurt",
          "Koos kondigt het plan aan om naar de open dag van de Salt Lake tempel te gaan",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Koos verwacht dat bij de wederkomst van Christus \"iedereen het zal zien\". In 3 Nephi 1 wordt een teken beschreven dat door het hele continent werd waargenomen. Welk teken?",
        options: [
          "Een hele nacht zonder duisternis, zo licht als op klaarlichte dag",
          "Een aardbeving die drie dagen duurde",
          "Een zwerm sprinkhanen die de oogst vernietigde",
          "Een zonsverduistering die een week duurde",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe reageerden mensen die de profeten niet hadden geloofd, toen dit teken zich voordeed volgens 3 Nephi 1?",
        options: [
          "Velen vielen ter aarde als dood, uit angst en besef van hun ongerechtigheid",
          "Niemand merkte er iets van",
          "Ze vierden meteen een groot feest",
          "Ze verlieten per direct het land",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 3 Nephi 1 probeerde Satan na dit teken leugens te verspreiden om mensen te laten twijfelen aan wat ze hadden gezien.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit 3 Nephi 1 in de juiste volgorde.",
        items: [
          "De zon gaat onder, maar er komt geen duisternis",
          "Het volk beseft dat de Zoon van God spoedig zal verschijnen",
          "De volgende ochtend gaat de zon weer normaal op",
          "Satan verspreidt leugens om het geloof in het teken te ondermijnen",
        ],
      },
    ],
  },
  {
    number: 104,
    title: "Aflevering 104",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel staat in deze aflevering centraal?",
        options: [
          "Geloofsartikel 2: de mens zal worden gestraft voor zijn eigen zonde en niet voor Adams overtreding",
          "Geloofsartikel 4: geloof, bekering, doop en de gave van de Heilige Geest",
          "Geloofsartikel 9: God zal nog vele grote en gewichtige zaken openbaren",
          "Geloofsartikel 13: eerlijk, trouw en deugdzaam zijn",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos en Raphael leggen uit dat de kerk de traditionele leer van de erfzonde, waarbij mensen al schuldig geboren worden aan Adams overtreding, afwijst.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe omschrijven Koos en Raphael de geestelijke dood die door de val van Adam ontstond?",
        options: [
          "Als scheiding van God, een noodzakelijk onderdeel van het heilsplan en niet als een straf",
          "Als een straf die alle mensen persoonlijk verdienen vanaf hun geboorte",
          "Als het letterlijk sterven van de geest, zodat die niet meer bestaat",
          "Als iets dat alleen ongelovigen treft",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Koos gebruikt een voorbeeld met zijn kinderen om het verschil tussen straf en gevolg uit te leggen. Waarover gaat dat voorbeeld?",
        options: [
          "Het inleveren van telefoonprivileges als natuurlijk gevolg van gedrag, niet als willekeurige straf",
          "Het verplicht laten meehelpen in de tuin",
          "Het geven van extra zakgeld bij goed gedrag",
          "Het samen kijken van een film als beloning",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken geloofsartikel 2 en de val van Adam",
          "Ze leggen uit waarom de kerk erfzonde afwijst",
          "Koos vertelt zijn voorbeeld over telefoonprivileges om straf en gevolg te onderscheiden",
          "Ze speculeren over andere werelden met hun eigen Adam en Eva",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Moroni 8 schrijft Mormon aan zijn zoon Moroni over kleine kinderen. Wat zegt hij over de vervloeking van Adam?",
        options: [
          "Die is in Christus van kleine kinderen weggenomen, zodat die geen macht meer over hen heeft",
          "Die blijft op alle mensen rusten totdat zij zich laten dopen",
          "Die geldt alleen voor volwassenen, niet voor kinderen",
          "Die kan alleen worden weggenomen door goede werken",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 8 is het een ernstige spotternij voor het aangezicht van God om kleine kinderen te dopen, omdat zij niet in staat zijn om zonde te bedrijven.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt Mormon in Moroni 8 over wie bekering en doop wél nodig hebben?",
        options: [
          "Alleen zij die toerekeningsvatbaar zijn en in staat om zonde te bedrijven",
          "Alle mensen zonder uitzondering, vanaf hun geboorte",
          "Alleen mensen die nooit naar de kerk zijn geweest",
          "Niemand, want iedereen is al gered",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Moroni 8 in de juiste volgorde.",
        items: [
          "Christus kwam niet om rechtvaardigen maar om zondaars tot bekering te roepen",
          "De vervloeking van Adam is in Christus van kleine kinderen weggenomen",
          "Het is spotternij voor God om kleine kinderen te dopen",
          "Bekering is voor hen die onder de vervloeking van een gebroken wet staan",
        ],
      },
    ],
  },
  {
    number: 103,
    title: "Aflevering 103",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar begint Raphael de aflevering mee, voordat hij het zelf meteen weer terugtrekt?",
        options: [
          "Dat hij heeft uitgerekend wanneer Christus terugkomt",
          "Dat hij een nieuwe openbaring heeft ontvangen",
          "Dat de wereld dit jaar nog vergaat",
          "Dat hij een nieuwe kerk wil oprichten",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Raphael en Koos betekent de wederkomst van Christus dat de aarde letterlijk ophoudt te bestaan.",
        answer: false,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke gelijkenis gebruikt Koos om uit te leggen dat er ook onder gelovigen een tweedeling zal zijn vlak voor de wederkomst?",
        options: [
          "De gelijkenis van de tien jonkvrouwen (vijf wijze en vijf dwaze)",
          "De gelijkenis van de verloren zoon",
          "De gelijkenis van de barmhartige Samaritaan",
          "De gelijkenis van het mosterdzaadje",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat noemen Koos en Raphael als reden waarom wij nu meer tekenen des tijds lijken waar te nemen dan mensen 200 jaar geleden?",
        options: [
          "Wij kunnen informatie over gebeurtenissen zoals oorlogen veel sneller en breder tot ons krijgen",
          "Er zijn nu daadwerkelijk veel meer oorlogen dan ooit tevoren",
          "De profetieën waren vroeger nog niet opgeschreven",
          "Mensen geloofden vroeger de profeten helemaal niet",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Raphael grapt over het berekenen van de wederkomst van Christus",
          "Ze bespreken hoe tekenen des tijds zoals oorlogen sneller bekend worden dan vroeger",
          "Koos legt de gelijkenis van de tien jonkvrouwen uit als beeld van een tweedeling onder gelovigen",
          "Ze bespreken profeten zoals Nelson en Hinckley die woorden voor onze tijd hebben nagelaten",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Mormon 8 spreekt Moroni rechtstreeks tot de lezers van onze tijd. Welke tekenen noemt hij die er \"zullen worden gehoord\" in onze dagen?",
        options: [
          "Oorlogen, geruchten van oorlogen en aardbevingen op verschillende plaatsen",
          "Alleen vrede en voorspoed over de hele aarde",
          "Een wereldwijde hongersnood als enig teken",
          "Het verdwijnen van alle kerken tegelijk",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Moroni schrijft in Mormon 8 dat hij spreekt \"alsof gij aanwezig zijt\", ook al is de lezer er op het moment van schrijven niet.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat verwijt Moroni in Mormon 8 aan kerken en hun leden in de laatste dagen?",
        options: [
          "Dat zij hun geld, bezit en fraaie kleding meer liefhebben dan de armen en behoeftigen",
          "Dat zij te weinig gebouwen bezitten",
          "Dat zij te veel tijd besteden aan bijbelstudie",
          "Dat zij te weinig muziek gebruiken in hun diensten",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze tekenen uit Mormon 8 in de volgorde waarin Moroni ze noemt.",
        items: [
          "Het bloed der heiligen roept tot de Heer wegens geheime verenigingen",
          "Kerkleiders verheffen zich in de hoogmoed van hun hart",
          "Er wordt gehoord van branden, orkanen en rook in vreemde landen",
          "Er wordt gehoord van oorlogen, geruchten van oorlogen en aardbevingen",
        ],
      },
    ],
  },
  {
    number: 102,
    title: "Aflevering 102",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel bespreken Koos en Raphael in deze aflevering?",
        options: [
          "Het eerste: wij geloven in God, de eeuwige Vader, en in Zijn Zoon, Jezus Christus, en in de Heilige Geest",
          "Het derde: door de verzoening van Christus kan de gehele mensheid worden gered",
          "Het vijfde: een mens moet geroepen worden door profetie",
          "Het tiende: de letterlijke vergadering van Israël",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Koos en Raphael leert het eerste geloofsartikel dat God de Vader, Jezus Christus en de Heilige Geest drie afzonderlijke personen zijn, in plaats van één persoon in drie vormen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe verdelen Koos en Raphael de rollen van God de Vader en Jezus Christus in het gesprek?",
        options: [
          "God de Vader vertegenwoordigt de rechtvaardigheid, Christus de barmhartigheid",
          "God de Vader vertegenwoordigt de barmhartigheid, Christus de rechtvaardigheid",
          "Beiden vertegenwoordigen precies dezelfde rol zonder enig verschil",
          "God de Vader doet alleen wonderen, Christus doet alleen onderwijzen",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom kon God de Vader volgens Koos niet zelf, zonder Christus, simpelweg alle zonden vergeven?",
        options: [
          "Omdat hij dan zijn eigen wet van gerechtigheid zou breken en daardoor niet langer God zou kunnen zijn",
          "Omdat hij daar geen tijd voor had",
          "Omdat alleen engelen zonden mogen vergeven",
          "Omdat Satan dat wettelijk zou kunnen tegenhouden",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken het ontstaan van de dertien geloofsartikelen",
          "Koos leest het eerste geloofsartikel voor",
          "Ze bespreken waarom God de Vader niet zelf de rol van Christus kon vervullen",
          "Raphael benadrukt dat wij daadwerkelijk kinderen van God zijn",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 42 legt Alma aan zijn zoon Corianton uit waarom barmhartigheid de gerechtigheid niet zomaar terzijde kan schuiven. Wat zou er volgens hem gebeuren als dat wel kon?",
        options: [
          "Dan zou God ophouden God te zijn",
          "Dan zou er niets veranderen, want het maakt geen verschil",
          "Dan zou Satan direct de macht overnemen",
          "Dan zou er geen wet meer nodig zijn voor wie dan ook",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 42 verzoent God zelf de zonden van de wereld, zodat Hij zowel een volmaakt rechtvaardig als een barmhartig God kan zijn.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat gebeurt er volgens Alma 42 met wie zich werkelijk bekeert?",
        options: [
          "De barmhartigheid maakt aanspraak op hen, dankzij de verzoening",
          "Zij worden alsnog voor eeuwig van Gods tegenwoordigheid afgesneden",
          "Zij hoeven niet meer geoordeeld te worden naar hun werken",
          "Zij worden automatisch engelen zonder opstanding",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen uit Alma's uitleg in Alma 42 in de juiste volgorde.",
        items: [
          "De hele mensheid is gevallen en bevindt zich in de greep der gerechtigheid",
          "Het plan van barmhartigheid kan alleen worden verwezenlijkt door een verzoening",
          "God verzoent zelf de zonden van de wereld om aan beide eisen te voldoen",
          "Alleen de werkelijk boetvaardigen worden uiteindelijk gered",
        ],
      },
    ],
  },
  {
    number: 101,
    title: "Aflevering 101",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar staat het getal '101' in deze aflevering symbool voor, volgens Raphael?",
        options: [
          "De eerste stappen om iets te leren, zoals bij een introductiecursus",
          "Het aantal jaren dat de kerk al bestaat",
          "Het honderdeneen-ste geloofsartikel",
          "Een verwijzing naar hoofdstuk 101 van het Boek van Mormon",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat raadt Raphael iemand aan die voor het eerst meer over Christus wil leren?",
        options: [
          "Begin met het lezen van de vier evangeliën in het Nieuwe Testament, als een soort biografie",
          "Begin met het uit het hoofd leren van de dertien geloofsartikelen",
          "Begin met het lezen van Openbaringen",
          "Begin met het bezoeken van een tempel",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Koos betekent bekering in gewone taal zoiets als: je leven dagelijks een beetje bijsturen zodat Christus daar een groter onderdeel van wordt.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe beschrijft Koos het verschil tussen de 'natuurlijke mens' en de 'geestelijke mens' na een verandering van hart?",
        options: [
          "De geestelijke, goddelijke mens krijgt de overhand op de egoïstische, natuurlijke mens",
          "De natuurlijke mens verdwijnt helemaal en keert nooit meer terug",
          "Beide blijven precies even sterk, er verandert niets",
          "De geestelijke mens bestaat alleen na de opstanding",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze verdelen luisteraars in groepen op basis van hun achtergrond met het christendom",
          "Raphael raadt aan om te beginnen met de vier evangeliën als biografie van Christus",
          "Koos legt uit wat de diepere vrede en vreugde is die Christus te bieden heeft",
          "Ze bespreken hoe je Christus zou uitleggen aan iemand uit een niet-christelijk land",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 5 vraagt Alma aan de leden van de kerk of zij een bepaalde verandering hebben ondervonden. Welke?",
        options: [
          "Die machtige verandering van hart",
          "Een verandering van uiterlijk voorkomen",
          "Een verandering van woonplaats",
          "Een verandering van naam",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 5 werd er in de harten van de vaderen een machtige verandering teweeggebracht doordat zij zich verootmoedigden en hun vertrouwen stelden in God, waarna zij tot het einde toe getrouw bleven.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vraagt Alma in Alma 5:14 letterlijk aan zijn broeders in de kerk?",
        options: [
          "Of zij geestelijk uit God geboren zijn en zijn beeld in hun gelaat hebben ontvangen",
          "Of zij hun tienden al hebben betaald",
          "Of zij alle geloofsartikelen uit hun hoofd kennen",
          "Of zij al een tempel hebben bezocht",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen uit Alma 5 in de juiste volgorde.",
        items: [
          "Alma herinnert aan hoe de vaderen door hun geloof een machtige verandering ondergingen",
          "Hij vraagt of de leden zelf die machtige verandering in hun hart hebben ondervonden",
          "Hij vraagt of zij gestemd zijn het lied der verlossende liefde te zingen",
          "Hij vraagt of zij dat gevoel op dit moment nog steeds bij zich dragen",
        ],
      },
    ],
  },
  {
    number: 100,
    title: "Aflevering 100",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke mijlpaal vieren Koos en Raphael in deze aflevering?",
        options: [
          "Hun honderdste aflevering, exclusief de extra Vaderdag-special",
          "Hun eerste verjaardag als podcast",
          "Hun duizendste luisteraar",
          "Het einde van de podcast",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael vertelt dat hij zijn toespraken altijd volledig woord voor woord uitschrijft, terwijl Koos zijn toespraken juist uit het hoofd doet.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar komt Raphaels zenuwachtigheid voor het geven van toespraken en getuigenissen volgens hemzelf vooral vandaan?",
        options: [
          "Faalangst, met name de angst voor wat andere mensen van hem denken",
          "Een gebrek aan voorbereiding",
          "Een negatieve ervaring in zijn jeugd met spreken in het openbaar",
          "Het feit dat hij de taal niet goed beheerst",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe legt Koos uit waar faalangst vandaan komt, en hoe Satan daarmee omgaat?",
        options: [
          "Faalangst komt voort uit de natuurlijke mens, en Satan probeert die om die te versterken en te misbruiken",
          "Faalangst wordt rechtstreeks door Satan zelf gecreëerd, zonder enige rol van de natuurlijke mens",
          "Faalangst heeft niets te maken met de natuurlijke mens of Satan, het is puur toeval",
          "Faalangst verdwijnt automatisch zodra iemand gedoopt wordt",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze blikken terug op honderd afleveringen podcast",
          "Ze bespreken hoe zij hun toespraken en getuigenissen voorbereiden",
          "Raphael vertelt over zijn faalangst en angst voor andermans mening",
          "Koos legt uit hoe Satan de natuurlijke mens en faalangst probeert te misbruiken",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Moroni 8 zegt Mormon dat hij met vrijmoedigheid en gezag van God spreekt, en dat hij niet vreest wat de mens kan doen. Waarom niet, volgens hem?",
        options: [
          "Omdat de volmaakte liefde alle vrees uitdrijft",
          "Omdat hij nooit bang is geweest van nature",
          "Omdat niemand hem ooit tegenspreekt",
          "Omdat hij zijn woorden altijd woord voor woord had opgeschreven",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 8 is Mormon vervuld met naastenliefde, waardoor voor hem alle kinderen gelijk zijn en hij hen allen met een volmaakte liefde liefheeft.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat noemt Mormon in Moroni 8:16 als het lot van wie de wegen des Heren verdraaien, als zij zich niet bekeren?",
        options: [
          "Zij zullen verloren gaan",
          "Zij worden meteen vergeven zonder gevolgen",
          "Zij mogen alsnog in het koninkrijk komen",
          "Er wordt met geen woord over hen gerept",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Moroni 8 in de juiste volgorde.",
        items: [
          "Wee hun die de wegen des Heren verdraaien, tenzij zij zich bekeren",
          "Mormon spreekt met vrijmoedigheid en gezag van God",
          "De volmaakte liefde drijft alle vrees uit",
          "Mormon is vervuld met naastenliefde voor alle kinderen gelijk",
        ],
      },
    ],
  },
  {
    number: 99,
    title: "Aflevering 99",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke gelijkenis brengt Koos naar voren omdat het toevallig hun 99ste aflevering is?",
        options: [
          "De gelijkenis van het verloren schaap, waarbij de herder 99 schapen achterlaat om het ene te zoeken",
          "De gelijkenis van de verloren zoon",
          "De gelijkenis van de tien jonkvrouwen",
          "De gelijkenis van de zaaier",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael vertelt een verhaal over een vader die een spoorwissel moet vasthouden, waardoor hij moet kiezen tussen het redden van zijn eigen zoon of van alle treinpassagiers, als beeld voor het offer van Hemelse Vader.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is volgens Raphael de kern van een getuigenis, zoals gegeven tijdens een vasten- en getuigenisvergadering?",
        options: [
          "Getuigen van de waarheid van een evangeliebeginsel, vaak aan de hand van een persoonlijke ervaring",
          "Een officieel certificaat laten zien van een afgeronde cursus",
          "Een uitgeschreven toespraak van minstens tien minuten voorlezen",
          "Alleen navertellen wat de bisschop heeft gezegd",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarover ontstaat een discussie tussen Koos en Raphael naar aanleiding van wat een luisteraar in de kerk had gezegd?",
        options: [
          "Of \"wees volmaakt\" eigenlijk \"wees één met God\" zou moeten betekenen, in plaats van perfectie zonder fouten",
          "Of de kerk een nieuw gebouw nodig heeft",
          "Of de doop op negenjarige leeftijd zou moeten plaatsvinden",
          "Of muziek wel of niet is toegestaan tijdens de dienst",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Koos brengt de gelijkenis van het verloren schaap ter sprake vanwege de 99ste aflevering",
          "Raphael vertelt het verhaal van de vader bij de spoorwissel",
          "Ze leggen uit wat een getuigenis inhoudt en hoe een vasten- en getuigenisvergadering werkt",
          "Ze bespreken de discussie over volmaaktheid en het voorbestaan",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 3 Nephi 15 vertelt Christus aan het volk in Amerika over \"andere schapen\" die niet van deze kudde zijn. Wie bedoelt Hij daarmee?",
        options: [
          "Henzelf, want Hij moet ook hen leiden, zodat er één kudde en één herder zal zijn",
          "Alleen de Romeinen",
          "Alleen de engelen in de hemel",
          "Niemand, het is puur symbolisch zonder werkelijke groep",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 3 Nephi 15 hoorden de mensen in Amerika zowel de stem van Christus als dat zij Hem zagen, waardoor zij tot zijn schapen worden gerekend.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom had Christus in Jeruzalem niet meer over de andere schapen (het volk in Amerika) verteld, volgens 3 Nephi 15?",
        options: [
          "Omdat de Vader Hem gebood daar niets meer over te zeggen, wegens hun halsstarrigheid en ongeloof",
          "Omdat Hij het gewoon vergeten was",
          "Omdat er geen tijd meer over was",
          "Omdat niemand daar ooit naar gevraagd had",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken van Christus uit 3 Nephi 15 in de juiste volgorde.",
        items: [
          "Hij zegt dat Hij nog andere schapen heeft, die niet van die kudde zijn",
          "Hij legt uit dat Hij hen ook moet leiden, en zij zullen zijn stem horen",
          "Hij legt uit waarom het volk in Jeruzalem niets van hen afwist",
          "Hij zegt dat het volk in Amerika zijn stem heeft gehoord en Hem heeft gezien",
        ],
      },
    ],
  },
  {
    number: 98,
    title: "Aflevering 98",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke vraag stelt Raphael centraal in deze aflevering, over het lijden van Christus?",
        options: [
          "Of het lijden van Christus buiten de Hof van Gethsemane, zoals de geseling en de kruisiging, ook voor onze zonden was",
          "Of Christus wel echt bestaan heeft",
          "Of Christus meer dan één keer is gestorven",
          "Of het lijden van Christus alleen symbolisch bedoeld was",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos en Raphael concluderen dat het verzoeningswerk voor de vergeving van zonden al was afgerond in de Hof van Gethsemane, en dat wat daarna kwam het lijden was dat ieder onschuldig veroordeeld mens had kunnen ondergaan.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat deed Christus volgens Koos en Raphael in de periode tussen zijn dood en zijn opstanding?",
        options: [
          "Hij ging naar het geestenrijk om het evangelie te laten verkondigen aan wie het nog niet gehoord had",
          "Hij bleef drie dagen volledig bewusteloos zonder enige activiteit",
          "Hij keerde meteen na zijn dood terug naar de aarde in een opgestaan lichaam",
          "Hij verscheen meteen aan zijn discipelen in Jeruzalem",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is bijzonder aan het opgestane lichaam van Christus, in vergelijking met de lichamen die andere mensen ooit zullen terugkrijgen?",
        options: [
          "Christus behoudt zijn littekens, terwijl andere mensen een volmaakt lichaam zonder mankementen terugkrijgen",
          "Christus heeft geen lichaam, andere mensen wel",
          "Alleen Christus kan na de opstanding nog eten",
          "Christus' lichaam is onzichtbaar voor mensen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Raphael herinnert aan de allereerste aflevering over het lijden van Christus",
          "Ze bespreken of het lijden buiten Gethsemane ook voor onze zonden was",
          "Ze bespreken wat Christus deed in de periode tussen zijn dood en opstanding",
          "Ze bespreken waarom Christus zijn littekens na de opstanding behoudt",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 7 profeteert Alma dat Christus pijnen, ziekten en zwakheden van zijn volk op zich zal nemen. Met welk doel, volgens vers 12?",
        options: [
          "Opdat zijn binnenste met barmhartigheid vervuld zal worden, zodat Hij naar het vlees weet hoe zijn volk te hulp te komen",
          "Alleen om zijn eigen kracht te tonen aan de mensen",
          "Om zelf nooit meer pijn te hoeven voelen",
          "Om andere profeten overbodig te maken",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 7 zal Christus ook de dood op zich nemen, om de banden des doods die zijn volk binden los te maken.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt Alma in vers 13 over hoe de Zoon van God lijdt?",
        options: [
          "Hij lijdt naar het vlees om de zonden van zijn volk op zich te nemen en hun overtredingen uit te wissen",
          "Hij lijdt alleen in de geest, nooit naar het vlees",
          "Hij lijdt niet echt, het is alleen een verhaal",
          "Hij laat anderen voor hem lijden",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze profetische uitspraken uit Alma 7 in de juiste volgorde.",
        items: [
          "Hij zal pijnen, benauwingen en allerlei verzoekingen doorstaan",
          "Hij zal de pijnen en ziekten van zijn volk op zich nemen",
          "Hij zal de dood op zich nemen om de banden des doods los te maken",
          "De Zoon van God lijdt naar het vlees om de zonden van zijn volk uit te wissen",
        ],
      },
    ],
  },
  {
    number: 97,
    title: "Aflevering 97",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk voorbeeld gebruikt Raphael om te beargumenteren dat je eerst goed voor jezelf moet zorgen voordat je een ander kan helpen?",
        options: [
          "Het zuurstofmasker in het vliegtuig, dat je eerst zelf moet opdoen voordat je een ander helpt",
          "Het voorbeeld van de barmhartige Samaritaan",
          "Het voorbeeld van de rijke jongeling",
          "Het voorbeeld van de wijze en dwaze bouwer",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos legt uit dat een eerdere poging om de wet van toewijding (de \"Verenigde Orde\") te leven historisch niet goed functioneerde.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk beeld gebruikt Koos om uit te leggen hoe Christus mensen volgens hem het liefst helpt?",
        options: [
          "Door mensen te leren vissen, zodat zij daarna voor zichzelf kunnen zorgen",
          "Door mensen altijd meteen alles te geven wat ze nodig hebben",
          "Door mensen nooit te helpen, zodat ze zelfredzaam worden",
          "Door alleen rijke mensen te helpen",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vertelt Raphael over zijn ervaring met het sneeuwvrij maken van de oprit van zijn buren?",
        options: [
          "Een andere buurman vroeg zich af waarom hij dat deed, aangezien niemand erom gevraagd had",
          "Zijn buren hadden er specifiek om gevraagd",
          "Hij deed het alleen voor geld",
          "De gemeente had hem daartoe verplicht",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken of Christus meer links of rechts georiëteerd zou zijn",
          "Ze bespreken de wet van toewijding en waarom die historisch niet goed werkte",
          "Raphael vertelt het verhaal over het sneeuwvrij maken van de oprit van de buren",
          "Ze bespreken wat het echt betekent om je naaste lief te hebben",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 4 Nephi wordt beschreven hoe het volk leefde nadat Christus in Amerika was verschenen. Wat hadden zij, volgens vers 3?",
        options: [
          "Alle dingen gemeenschappelijk, zodat er geen armen en rijken meer waren",
          "Ieder zijn eigen bezit, strikt gescheiden van de rest",
          "Een systeem van slavernij voor wie niet meewerkte",
          "Geen enkele vorm van bezit of eigendom, zelfs geen voedsel",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 4 Nephi 1 was er onder dat volk geen twist, omdat de liefde voor God in hun hart woonde.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe worden de Nephieten en Lamanieten na verloop van tijd in 4 Nephi beschreven?",
        options: [
          "Als één volk, kinderen van Christus en erfgenamen van het koninkrijk van God",
          "Als nog steeds twee compleet gescheiden volkeren in permanente oorlog",
          "Als een volk dat alleen uit rovers en moordenaars bestond",
          "Als een volk zonder enige vorm van geloof",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze beschrijvingen uit 4 Nephi 1 in de juiste volgorde.",
        items: [
          "Het gehele volk was tot de Heer bekeerd en behandelde elkaar rechtvaardig",
          "Zij hadden alle dingen gemeenschappelijk, zonder armen of rijken",
          "Er was geen twist meer wegens de liefde voor God in hun hart",
          "Zij werden gezegend en voorspoedig gemaakt gedurende meer dan honderd jaar",
        ],
      },
    ],
  },
  {
    number: 96,
    title: "Aflevering 96",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat noemen Koos en Raphael zichzelf, gezien het onderwerp van hun podcast en de taal waarin ze spreken?",
        options: [
          "Een niche binnen een niche binnen een niche",
          "De grootste podcast van Nederland",
          "Een wereldwijd fenomeen",
          "Een kerkelijk radioprogramma",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vertelt dat de plaatselijke Stadskerk met kerst duizenden bezoekers trekt over meerdere diensten, terwijl hun eigen wijk met kerst juist extra rustig is.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk voorbeeld gebruikt Raphael, over president Hinckley en een glas sinaasappelsap, om uit te leggen waarom mensen het evangelie niet makkelijker delen?",
        options: [
          "Dat je iets waar je zelf enorm van geniet, toch niet vanzelfsprekend met een ander deelt",
          "Dat sinaasappelsap symbool staat voor de Heilige Geest",
          "Dat je nooit iets moet delen zonder dat erom gevraagd wordt",
          "Dat gulheid altijd tot last leidt",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom vertelt Koos dat hij op zijn werk terughoudend is om over zijn geloof of gevoelige onderwerpen te spreken?",
        options: [
          "Hij heeft als manager eerder negatieve ervaringen gehad waarbij collega's dat tegen hem gebruikten",
          "Zijn werkgever verbiedt elk gesprek over geloof volledig",
          "Hij vindt het geloof zelf niet belangrijk genoeg om over te praten",
          "Hij heeft er nooit eerder over nagedacht",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken dat ze in een niche van een niche zitten met hun podcast",
          "Ze vergelijken hun eigen kerkopkomst met de drukte bij de Stadskerk met kerst",
          "Raphael vertelt het voorbeeld van president Hinckley en het glas sinaasappelsap",
          "Ze bespreken het idee om een laagdrempelige, makkelijk deelbare aflevering te maken",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 3 Nephi 14 spreekt Christus over een enge poort en een smalle weg. Wat zegt Hij daarover?",
        options: [
          "Smal is de weg die tot het leven leidt, en weinigen zijn er die hem vinden",
          "Alle wegen leiden uiteindelijk tot hetzelfde doel",
          "De brede weg en de smalle weg komen op hetzelfde neer",
          "Iedereen vindt de smalle weg vanzelf, zonder moeite",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 3 Nephi 14 zijn er velen die door de wijde poort ingaan, op de brede weg die tot vernietiging leidt.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarvoor waarschuwt Christus zijn toehoorders direct na de uitspraak over de smalle weg, in 3 Nephi 14?",
        options: [
          "Voor valse profeten die in schaapsklederen komen, maar van binnen roofzuchtige wolven zijn",
          "Voor het eten van onrein voedsel",
          "Voor het reizen naar vreemde landen",
          "Voor het te lang bidden",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit 3 Nephi 14 in de juiste volgorde.",
        items: [
          "Wijd is de poort en breed is de weg die tot vernietiging leidt",
          "Smal is de weg die tot het leven leidt, en weinigen vinden hem",
          "Wacht u voor valse profeten in schaapsklederen",
          "Gij zult hen kennen aan hun vruchten",
        ],
      },
    ],
  },
  {
    number: 95,
    title: "Aflevering 95",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar begint het gesprek over hoogmoed mee, in deze aflevering?",
        options: [
          "Raphaels voorkeur voor merkkleding zoals Tommy Hilfiger",
          "Een discussie over dure auto's",
          "Een discussie over grote huizen",
          "Een discussie over dure vakanties",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos omschrijft hoogmoed als alles wat jou van God afhoudt, of het gevoel dat je Hem niet nodig hebt of het zelfs beter weet dan Hem.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat noemt Raphael als voorbeeld van hoogmoed die niet met geestelijke zaken te maken heeft?",
        options: [
          "Het gevoel dat hij te goed zou zijn voor werk zoals vuilnis ophalen of het schoffelen van gemeentetuinen",
          "Het bezitten van een dure auto",
          "Het wonen in een groot huis",
          "Het reizen naar het buitenland",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar zijn Koos en Raphael het aan het einde van de aflevering over eens, wanneer het gaat om hoogmoed en bekering?",
        options: [
          "Dat bekering een continu, dagelijks proces van bijsturen is, ook op een dag die goed leek te gaan",
          "Dat je maar één keer in je leven hoeft te bekeren van hoogmoed",
          "Dat hoogmoed alleen bij rijke mensen voorkomt",
          "Dat hoogmoed onmogelijk te vermijden is en dus geen probleem is",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken merkkleding en of dat op zichzelf al hoogmoedig is",
          "Koos geeft zijn definitie van hoogmoed als alles wat je van God afhoudt",
          "Ze bespreken of we ooit een punt bereiken waarop we Christus niet meer nodig hebben",
          "Raphael noemt het voorbeeld van werk dat hij als \"onder zijn niveau\" zou zien",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Helaman 12 wordt beschreven hoe mensen zich gedragen zodra het hun voorspoedig gaat. Wat gebeurt er dan vaak, volgens vers 2?",
        options: [
          "Zij verstokken hun hart en vergeten de Heer, hun God",
          "Zij worden vanzelf nog dankbaarder richting God",
          "Zij geven automatisch meer aan de armen",
          "Zij bidden juist vaker en intensiever",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Helaman 12:5 zijn mensenkinderen vlug om zich in hoogmoed te verheffen, maar traag om aan de Heer te denken en zijn raadgevingen op te volgen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat willen mensen volgens Helaman 12:6 vaak niet, ondanks Gods grote goedheid en barmhartigheid?",
        options: [
          "Dat Hij over hen heerst, hen regeert en hun leidsman is",
          "Dat Hij hen zegent met voorspoed",
          "Dat Hij hun gebeden beantwoordt",
          "Dat Hij profeten stuurt",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Helaman 12 in de juiste volgorde.",
        items: [
          "De Heer zegent en maakt voorspoedig wie hun vertrouwen in Hem stellen",
          "Juist bij voorspoed verstokken mensen hun hart en vergeten zij de Heer",
          "Mensenkinderen zijn vlug om zich in hoogmoed te verheffen",
          "Zij willen niet dat de Heer, ondanks zijn goedheid, hun leidsman is",
        ],
      },
    ],
  },
  {
    number: 94,
    title: "Aflevering 94",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke vraag van een luisteraar staat in deze aflevering centraal?",
        options: [
          "Is er eeuwig geluk voor iedereen?",
          "Bestaat de hel echt?",
          "Waarom zijn er zoveel religies?",
          "Wat gebeurt er met dieren na de dood?",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael legt uit dat de kerk gelooft in tussenstadia na de dood, zoals een geestenwereld en paradijs, in plaats van een direct oordeel naar hemel of hel.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat oppert Raphael als mogelijke bron van blijvend ongeluk voor wie in een lagere graad van heerlijkheid terechtkomt?",
        options: [
          "Het besef van je eigen gemiste potentieel en de keuzes die daartoe leidden",
          "Het ontbreken van muziek in die graad van heerlijkheid",
          "Het feit dat er geen zonlicht zou zijn",
          "Het feit dat er geen andere mensen zouden zijn",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarmee vergelijkt Raphael de verschillende graden van heerlijkheid, om uit te leggen dat je gelukkig kan zijn ook al bereik je niet het hoogste niveau?",
        options: [
          "Met de verschillende niveaus van het Nederlandse schoolsysteem, zoals vmbo en vwo",
          "Met verschillende sporten",
          "Met verschillende talen",
          "Met verschillende beroepen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Koos introduceert de luisteraarsvraag over eeuwig geluk voor iedereen",
          "Raphael legt de tussenstadia na de dood uit, zoals geestenwereld en paradijs",
          "Ze bespreken of spijt over gemist potentieel eeuwig ongeluk kan betekenen",
          "Raphael vergelijkt de graden van heerlijkheid met schoolniveaus",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 41 legt Alma aan zijn zoon Corianton uit wat herstelling niet betekent. Wat zegt hij daarover in vers 10?",
        options: [
          "Denk niet dat je van zonde tot geluk zult worden hersteld, want goddeloosheid heeft nooit geluk betekend",
          "Herstelling betekent dat alle zonden vanzelf worden vergeven zonder gevolgen",
          "Herstelling betekent dat iedereen precies hetzelfde terugkrijgt, ongeacht wat hij deed",
          "Herstelling is alleen van toepassing op lichamelijke genezing",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 41:11 bevindt wie in een natuurlijke, vleselijke staat verkeert zich in een staat die in strijd is met de aard van geluk.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe legt Alma in vers 13 de betekenis van het woord herstelling uit?",
        options: [
          "Goed voor wat goed is, kwaad voor wat kwaad is; rechtvaardig voor wat rechtvaardig is, barmhartig voor wat barmhartig is",
          "Alleen kwaad wordt teruggegeven, nooit iets goeds",
          "Alleen goede daden worden herinnerd, kwade daden worden vergeten",
          "Herstelling geldt alleen voor de allerbeste mensen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Alma 41 in de juiste volgorde.",
        items: [
          "Goddeloosheid heeft nooit geluk betekend",
          "Wie in een vleselijke staat verkeert, is in strijd met de aard van het geluk",
          "Herstelling betekent goed voor goed, kwaad voor kwaad teruggeven",
          "Wat gij van u laat uitgaan, zal weer tot u terugkeren",
        ],
      },
    ],
  },
  {
    number: 93,
    title: "Aflevering 93",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke uitspraak over God gebruikt Koos om het gesprek in deze aflevering te openen?",
        options: [
          "God is dezelfde gisteren, heden en in de toekomst, God is onveranderlijk",
          "God verandert elke dag van gedaante",
          "God heeft nooit een plan gehad",
          "God is precies zoals de mens",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos en Raphael zijn het erover eens dat God wel degelijk groeit en zich ontwikkelt, terwijl zijn karakter en aard onveranderlijk blijven.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk voorbeeld gebruikt Raphael om uit te leggen hoe hij Gods alwetendheid over onze keuzes ziet, zonder dat dit onze keuzevrijheid wegneemt?",
        options: [
          "Dat God, net als bij een wiskundige som, precies weet hoe iemand zal kiezen zonder dat de uitkomst van tevoren vastligt",
          "Dat God helemaal niets weet over de toekomst",
          "Dat God iedereen dwingt om dezelfde keuze te maken",
          "Dat keuzevrijheid alleen bestaat in de hemel, niet op aarde",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat concluderen Koos en Raphael over waarom God ons vandaag de dag nog steeds levende profeten geeft?",
        options: [
          "Omdat Zijn basisprincipes niet veranderen, maar de wereld en haar uitdagingen wel, waardoor actuele leiding nodig blijft",
          "Omdat de Bijbel niet meer waardevol is",
          "Omdat God zijn mening steeds weer volledig omgooit",
          "Omdat profeten alleen nodig waren in het Oude Testament",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken Koos' voorkeur om weinig te veranderen, met zijn oude iPhone als voorbeeld",
          "Koos stelt de vraag of God veranderlijk of onveranderlijk is",
          "Ze bespreken Gods alwetendheid tegenover onze keuzevrijheid",
          "Ze concluderen dat Gods basisprincipes niet veranderen, maar zijn geboden en hulpmiddelen wel",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Mormon 9 haalt Mormon aan dat God dezelfde is gisteren, heden en voor eeuwig. Wat zegt hij daarbij over verandering in God?",
        options: [
          "Er is in Hem geen verandering of zweem van ommekeer",
          "God verandert net zo vaak als de seizoenen",
          "God verandert alleen op belangrijke feestdagen",
          "God verandert steeds mee met de mode van de tijd",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Mormon 9:10 zou een god die verandert en in wie een zweem van ommekeer is, geen god van wonderen zijn.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zou er volgens Mormon 9:19 gebeuren als God zou veranderen?",
        options: [
          "Dan zou Hij ophouden God te zijn",
          "Dan zou er niets aan de hand zijn",
          "Dan zou Hij juist machtiger worden",
          "Dan zouden de wonderen alleen maar toenemen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Mormon 9 in de juiste volgorde.",
        items: [
          "God is dezelfde gisteren, heden en voor eeuwig, zonder zweem van ommekeer",
          "Een god die verandert, is geen god van wonderen",
          "Mormon toont de God van Abraham, Isaak en Jakob als God van wonderen",
          "God verandert niet, anders zou Hij ophouden God te zijn",
        ],
      },
    ],
  },
  {
    number: 92,
    title: "Aflevering 92",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke vier stappen noemen Koos en Raphael als basis van het evangelie, voordat het \"volharden tot het einde\" begint?",
        options: [
          "Geloof, bekering, doop en de gave van de Heilige Geest",
          "Geloof, hoop, naastenliefde en nederigheid",
          "Doop, tempelbezoek, tiende betalen en vasten",
          "Gebed, schriftstudie, tempelbezoek en dienstbetoon",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vertelt het verhaal van Paulus, die eerst christenen vervolgde voordat hij zich op de weg naar Damascus tot Christus bekeerde.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe verklaart Koos dat God bij sommige mensen, zoals Paulus of Alma de Jongere, lijkt in te grijpen in hun keuzevrijheid?",
        options: [
          "Omdat zij in het voorsterfelijk leven al geordend waren voor een belangrijke rol die zij moesten vervullen",
          "Omdat God willekeurig bepaalde mensen uitkiest zonder enige reden",
          "Omdat zij daar zelf specifiek om gevraagd hadden",
          "Omdat hun ouders daarvoor hadden betaald",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke game gebruikt Raphael als beeld voor hoe God zegeningen soms juist aan wie \"achteraan\" ligt geeft, zoals bij Paulus?",
        options: [
          "Mario Kart, waarbij je een krachtige kogel alleen krijgt als je ver achteraan rijdt",
          "Schaken, waarbij de koningin de sterkste stukken heeft",
          "Voetbal, waarbij de aanvoerder altijd wint",
          "Monopoly, waarbij je met dobbelstenen speelt",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken de vier stappen van geloof, bekering, doop en de Heilige Geest",
          "Ze bespreken de verwarring rond de geest van Christus en de drie personen van de Godheid",
          "Koos vertelt over de bekering van Paulus en Alma de Jongere",
          "Raphael gebruikt het Mario Kart-voorbeeld om oneerlijk lijkende zegeningen te verklaren",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 3 Nephi 27 legt Christus zijn evangelie uit aan zijn discipelen in Amerika. Wat gebeurt er met wie zich bekeert, laat dopen en tot het einde volhardt?",
        options: [
          "Christus zal hem onschuldig houden voor het aangezicht van de Vader op de dag van het oordeel",
          "Hij moet zich daarna nog een tweede keer laten dopen",
          "Hij hoeft zich daarna nergens meer aan te houden",
          "Hij wordt meteen een engel zonder verdere ontwikkeling",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 3 Nephi 27:17 wordt wie niet tot het einde volhardt, omgehakt en in het vuur geworpen, wegens de gerechtigheid van de Vader.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat noemt Christus in 3 Nephi 27:13 als de kern van zijn evangelie?",
        options: [
          "Dat Hij in de wereld is gekomen om de wil van zijn Vader te doen, die Hem gezonden heeft",
          "Dat Hij alleen gekomen is om wonderen te verrichten",
          "Dat Hij vooral gekomen is om de wet van Mozes te herbevestigen",
          "Dat Hij gekomen is om een nieuw volk te stichten los van Israël",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit 3 Nephi 27 in de juiste volgorde.",
        items: [
          "Christus legt uit dat Hij gekomen is om de wil van zijn Vader te doen",
          "Wie zich bekeert en laat dopen en tot het einde volhardt, wordt onschuldig gehouden",
          "Wie niet tot het einde volhardt, wordt omgehakt en in het vuur geworpen",
          "Niets onreins kan zijn koninkrijk ingaan, behalve wie getrouw is tot het einde",
        ],
      },
    ],
  },
  {
    number: 91,
    title: "Aflevering 91",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke bijzondere gebeurtenis vertelt Koos dat hij net heeft meegemaakt in een tempel in Zwitserland?",
        options: [
          "Zijn eigen huwelijksverzegeling met zijn vrouw",
          "De doop van zijn kind",
          "Zijn eigen ordinatie tot priester",
          "Een patriarchale zegen voor zijn vrouw",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos legt uit dat het altaar in de tempel symbolisch voor Christus staat, en dat hij en zijn vrouw daar hun handen op legden tijdens de verzegeling.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Tot welke stam van Israël behoren Koos en Raphael volgens hun patriarchale zegen?",
        options: [
          "De stam van Efraïm",
          "De stam van Juda",
          "De stam van Levi",
          "De stam van Benjamin",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vertelt Raphael over het volk dat al vóór de Nephieten en Lamanieten in Amerika aankwam, en wiens verslag ook in het Boek van Mormon is opgenomen?",
        options: [
          "Zij kwamen van de toren van Babel en hun taal werd niet verward",
          "Zij kwamen rechtstreeks uit het oude Egypte",
          "Zij spraken dezelfde taal als de Nephieten",
          "Zij lieten helemaal geen enkel geschreven verslag na",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Koos vertelt over zijn huwelijksverzegeling in de tempel in Zwitserland",
          "Ze bespreken het verbondsvolk en de stammen van Israël",
          "Ze bespreken de patriarchale zegen en de stam van Efraïm",
          "Raphael vertelt over het volk van de toren van Babel in het Boek van Mormon",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Ether 1 wordt verteld hoe de broer van Jered de Heer aanroept bij de toren van Babel. Wat vraagt hij?",
        options: [
          "Dat de Heer hun taal niet zal verwarren, zodat zij elkaars woorden kunnen blijven verstaan",
          "Dat de Heer hen onmiddellijk naar Amerika zal verplaatsen",
          "Dat de Heer de toren zelf zal laten instorten",
          "Dat de Heer hen rijkdom zal geven voor de reis",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Ether 1 had de Heer medelijden met Jered en zijn broer, zodat hun taal niet werd verward toen de talen van de rest van het volk wel werden verward.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vraagt Jered aan zijn broer nadat hun eigen taal gespaard was gebleven?",
        options: [
          "Om de Heer opnieuw aan te roepen, zodat ook de taal van hun vrienden gespaard zou blijven",
          "Om meteen op reis te gaan zonder verder iets te vragen",
          "Om de Heer te vragen alle andere talen alsnog te herstellen",
          "Om zelf een nieuwe toren te bouwen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit Ether 1 in de juiste volgorde.",
        items: [
          "De Heer verwart de taal van het volk bij de grote toren",
          "Jered vraagt zijn broer de Heer aan te roepen zodat hun taal niet verward wordt",
          "De Heer heeft medelijden en hun taal wordt niet verward",
          "Jered vraagt zijn broer opnieuw te bidden, ook voor hun vrienden en gezinnen",
        ],
      },
    ],
  },
  {
    number: 90,
    title: "Aflevering 90",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk voorbeeld van technologie-afhankelijkheid vertelt Raphael, waarbij collega's zonder een bepaalde dienst niet meer konden werken?",
        options: [
          "Een storing bij een grote DNS-provider, waardoor ook ChatGPT uitviel",
          "Een stroomstoring die een hele week duurde",
          "Het verlies van alle bedrijfsgegevens",
          "Een hackaanval op de bedrijfswebsite",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael is voorstander van een minimumleeftijd voor social media, zoals in Australië al is ingevoerd, en vergelijkt dit met bestaande leeftijdsgrenzen voor alcohol en wapenbezit.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe legt Raphael uit dat algoritmes van social-mediaplatforms werken?",
        options: [
          "Ze laten je steeds meer content zien van het soort waar je al naar kijkt, zodat je langer op het platform blijft",
          "Ze laten willekeurig gekozen content zien, zonder enig patroon",
          "Ze tonen altijd evenveel positieve als negatieve content",
          "Ze stoppen automatisch na een vast aantal minuten",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk advies geven Koos en Raphael om social media juist ten goede te gebruiken?",
        options: [
          "Bewust christelijke kanalen volgen, zodat het algoritme ook die content gaat voorschotelen",
          "Helemaal stoppen met alle vormen van techniek",
          "Alleen nog maar op zondag naar de telefoon kijken",
          "Alle social media-accounts direct verwijderen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken hoe afhankelijk we zijn geworden van stroom en internet",
          "Ze bespreken een leeftijdsgrens voor social media, vergelijkbaar met alcohol of wapenbezit",
          "Koos vertelt over verontrustende filmpjes die zijn zoon hem liet zien",
          "Ze bespreken hoe je social media juist ten goede kan gebruiken, zoals vasten van je telefoon",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Moroni 7 legt Mormon uit hoe je kunt onderscheiden of iets van God is of van de duivel. Wat is het criterium, volgens vers 13?",
        options: [
          "Wat uitnodigt en verlokt om voortdurend goed te doen en God lief te hebben, is door God ingegeven",
          "Alleen wat spectaculair en indrukwekkend is, komt van God",
          "Alleen wat door kerkleiders wordt goedgekeurd, komt van God",
          "Alles wat populair is, komt automatisch van God",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 7:16 wordt de Geest van Christus aan ieder mens gegeven, zodat hij goed van kwaad kan onderscheiden.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt Mormon in Moroni 7:17 over hoe de duivel te werk gaat?",
        options: [
          "Hij overreedt geen enkel mens om goed te doen, hij en zijn engelen niet",
          "Hij overreedt mensen soms tot iets goeds, om ze daarna te misleiden",
          "Hij doet vooral zijn best om mensen te laten bidden",
          "Hij heeft geen enkele invloed op menselijke keuzes",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Moroni 7 in de juiste volgorde.",
        items: [
          "Alle dingen die goed zijn, komen van God, en wat slecht is, komt van de duivel",
          "Het is ons gegeven te oordelen, zodat we goed van kwaad kunnen onderscheiden",
          "De Geest van Christus wordt aan ieder mens gegeven om dat onderscheid te maken",
          "De duivel overreedt geen enkel mens om goed te doen",
        ],
      },
    ],
  },
  {
    number: 89,
    title: "Aflevering 89",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wie zijn de gasten in deze bijzondere aflevering, met wie Koos en Raphael eerder al eens hun kerkbezoek bespraken?",
        options: [
          "Renco en Dick, makers van een andere geloofspodcast, die de kerk van Koos en Raphael hadden bezocht",
          "Twee zendelingen uit Amerika",
          "De bisschop van hun eigen wijk",
          "Twee wetenschappers die onderzoek doen naar religie",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Renco en Dick vertellen dat zij bij het kerkbezoek van Koos en Raphaels kerk een jeugdwerkprogramma over de geschiedenis van de kerk meemaakten, wat een ander beeld gaf dan een reguliere dienst.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk praktisch verschil rond het avondmaal viel Renco op, vergeleken met zijn eigen kerk?",
        options: [
          "Bij Koos en Raphaels kerk blijven de korsten aan het brood zitten, terwijl die bij Renco's kerk eraf gehaald worden",
          "Bij Koos en Raphaels kerk wordt er nooit brood gebruikt",
          "Bij Renco's kerk wordt het avondmaal elke week gevierd",
          "Bij Koos en Raphaels kerk zit er geen enkele betekenis achter het avondmaal",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom kozen Koos en Raphael er lange tijd voor om niet expliciet de naam van hun kerk te noemen in hun podcast?",
        options: [
          "Ze wilden niet dat luisteraars zouden denken dat het een podcast namens de kerk zelf was",
          "Ze schaamden zich voor hun geloof",
          "Ze wisten zelf de officiële naam niet goed",
          "De kerkleiding had het hun verboden",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Renco en Dick vertellen over hun bezoek aan de kerk van Koos en Raphael",
          "Ze bespreken waarom Koos en Raphael later pas de naam van hun kerk gingen noemen",
          "Ze vergelijken het onderwijsprogramma en de lesstructuur van de kerk met andere kerken",
          "Ze spreken af dat Koos en Raphael op hun beurt de kerken van Renco en Dick gaan bezoeken",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 2 Nephi 26 wordt beschreven hoe God alle mensen uitnodigt tot Hem te komen. Wie sluit Hij daarbij uit, volgens vers 33?",
        options: [
          "Niemand; Hij verwerpt niemand die tot Hem komt, zwart of blank, slaaf of vrije, man of vrouw",
          "Iedereen die niet tot een bepaalde kerk behoort",
          "Alleen mensen die nooit gedoopt zijn geweest",
          "Alleen mensen buiten het volk van Israël",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 2 Nephi 26:33 zijn allen voor God gelijk, zowel de Joden als de andere volken.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt 2 Nephi 26:33 over hoe de Heer te werk gaat onder de mensenkinderen?",
        options: [
          "Hij doet niets, tenzij het de mensenkinderen duidelijk is",
          "Hij handelt altijd in het geheim, zonder dat mensen het ooit kunnen begrijpen",
          "Hij doet alleen dingen die door één bepaalde kerk goedgekeurd zijn",
          "Hij houdt zich volledig afzijdig van de mensheid",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachten uit 2 Nephi 26:33 in de juiste volgorde.",
        items: [
          "Geen van de ongerechtigheden in de wereld komt van de Heer",
          "Hij nodigt allen uit om tot Hem te komen en deel te hebben aan zijn goedheid",
          "Hij verwerpt niemand die tot Hem komt, ongeacht afkomst",
          "Allen zijn voor God gelijk, zowel Joden als andere volken",
        ],
      },
    ],
  },
  {
    number: 88,
    title: "Aflevering 88",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk gebod staat centraal in het gesprek van Koos en Raphael in deze aflevering?",
        options: [
          "Gij zult niet doden",
          "Gij zult de sabbatdag heiligen",
          "Gij zult niet stelen",
          "Gij zult geen andere goden voor mijn aangezicht hebben",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos wijst erop dat het Boek van Mormon net als het Oude Testament veel oorlogen bevat, waarbij het volk van God zich verdedigt tegen aanvallers.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat bespreken Koos en Raphael over de context van 'gij zult niet doden', zoals bij zelfverdediging of het leger?",
        options: [
          "Dat het gaat om de intentie, en dat je bijvoorbeeld geen weerloze tegenstander alsnog mag afmaken",
          "Dat het gebod nooit ergens een uitzondering kent, zelfs niet bij zelfverdediging",
          "Dat het gebod alleen geldt binnen je eigen familie",
          "Dat het gebod inmiddels is afgeschaft",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk advies geven Koos en Raphael aan het einde van de aflevering, mocht iemand denken een ingeving van God te krijgen om iemand te doden of zichzelf iets aan te doen?",
        options: [
          "Twijfel daaraan, overleg met kerkelijke leiders en bel een hulplijn, want dat komt niet van God",
          "Volg die ingeving zonder verder na te denken",
          "Bespreek het alleen met vrienden, nooit met een hulplijn",
          "Negeer het gevoel volledig en praat er met niemand over",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken voorbeelden uit de schriften waarin doden door God werd opgedragen",
          "Ze bespreken zelfverdediging, oorlog en de doodstraf",
          "Raphael bespreekt het verhaal van Nephi die Laban moest doden",
          "Ze sluiten af met het advies om nooit zomaar een ingeving tot doden te vertrouwen",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 1 Nephi 4 dringt de Geest er bij Nephi op aan om Laban te doden. Wat is Nephi's eerste reactie, volgens vers 10?",
        options: [
          "Hij deinst terug, want hij heeft nog nooit het bloed van een mens vergoten",
          "Hij doet het onmiddellijk zonder enige aarzeling",
          "Hij weigert volledig en loopt weg",
          "Hij vraagt zijn broers om het in zijn plaats te doen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 1 Nephi 4:13 zegt de Geest tegen Nephi dat het beter is dat één mens omkomt dan dat een hele natie in ongeloof verkommert en verloren gaat.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke redenen noemt de Geest in 1 Nephi 4:11 om Laban te doden?",
        options: [
          "Laban had geprobeerd Nephi van het leven te beroven, gehoorzaamde de geboden niet en had hun bezit gestolen",
          "Laban had gewoon toevallig pech",
          "Laban had nooit iemand kwaad gedaan",
          "Laban was de koning van het land",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit 1 Nephi 4 in de juiste volgorde.",
        items: [
          "De Geest dringt er bij Nephi op aan om Laban te doden",
          "Nephi deinst terug, want hij heeft nog nooit iemands bloed vergoten",
          "De Geest legt uit dat de Heer Laban in Nephi's handen heeft overgeleverd",
          "Nephi gehoorzaamt de stem van de Geest en doodt Laban met zijn eigen zwaard",
        ],
      },
    ],
  },
  {
    number: 87,
    title: "Aflevering 87",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke disclaimer benadrukken Koos en Raphael aan het begin van deze aflevering?",
        options: [
          "Dat zij niet namens de kerk spreken, ook al zijn zij er lid van",
          "Dat de podcast officieel wordt gesponsord door de kerk",
          "Dat zij vanaf nu alleen nog Engels gaan spreken",
          "Dat zij stoppen met de podcast",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vertelt over Joseph Smith en de bouw van de Kirtland-tempel, en ziet daarin een bewijs dat Joseph Smith een profeet was, ondanks dat hij ook fouten maakte.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke gelijkenis vindt Koos moeilijk te begrijpen, waarbij vijf van de tien jonkvrouwen buitengesloten worden?",
        options: [
          "De gelijkenis van de tien jonkvrouwen met hun olielampen",
          "De gelijkenis van de verloren zoon",
          "De gelijkenis van de barmhartige Samaritaan",
          "De gelijkenis van het mosterdzaadje",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk voorbeeld gebruiken Koos en Raphael om te laten zien dat zelfs dezelfde waarheid op een misleidende manier verteld kan worden, zoals Satan soms doet?",
        options: [
          "Dat Satan tegen Mozes zei dat hij een mensenzoon is, vlak nadat God hem had verteld dat hij Gods zoon is",
          "Dat Satan altijd volledig liegt, zonder ooit een waar woord te spreken",
          "Dat Satan nooit met profeten spreekt",
          "Dat Satan alleen in dromen verschijnt",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze herhalen hun disclaimer dat ze niet namens de kerk spreken",
          "Ze bespreken of een profeet fouten en zonden kan maken",
          "Koos vertelt over Joseph Smith en de bouw van de Kirtland-tempel",
          "Ze bespreken hun favoriete gelijkenissen en waarom Christus in gelijkenissen sprak",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Ether 4 belooft Christus dat wie zijn woorden gelooft, bezocht zal worden met openbaringen van zijn Geest. Wat zal die persoon dan doen, volgens vers 11?",
        options: [
          "Hij zal weten en getuigen, want door de Geest zal hij weten dat deze dingen waar zijn",
          "Hij zal meteen alle antwoorden op elke vraag krijgen",
          "Hij hoeft daarna nooit meer te bidden",
          "Hij zal onmiddellijk profeet worden",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Ether 4:12 komt alles wat mensen ertoe beweegt het goede te doen, van Christus, want het goede komt van niemand anders dan van Hem.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe noemt Christus zichzelf in Ether 4:12?",
        options: [
          "Het licht en het leven en de waarheid der wereld",
          "Alleen een boodschapper van de Vader, zonder eigen gezag",
          "Een gewone profeet zoals andere profeten",
          "Een engel die de Vader dient",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Ether 4 in de juiste volgorde.",
        items: [
          "Wie de woorden van Christus gelooft, zal Hij bezoeken met openbaringen van zijn Geest",
          "Door die Geest zal hij weten dat de dingen waar zijn",
          "Alles wat mensen tot het goede beweegt, komt van Christus",
          "Christus nodigt de andere volken uit om tot Hem te komen voor grotere kennis",
        ],
      },
    ],
  },
  {
    number: 86,
    title: "Aflevering 86",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke centrale vraag stelt Koos aan Raphael aan het begin van deze aflevering?",
        options: [
          "Ben jij rijk?",
          "Ben jij gelukkig getrouwd?",
          "Ben jij tevreden met je baan?",
          "Geloof jij in wonderen?",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael vertelt over een tempelervaring waarin Adam en Eva aan Satan zeggen dat ze niet ingaan op zijn aanbod, omdat ze al genoeg hebben voor hun onderhoud.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke twee grappen vertellen Koos en Raphael over mensen die aardse rijkdom mee willen nemen naar het hiernamaals?",
        options: [
          "Een grap over goud op zolder verstoppen en een grap over een koffer vol goudstaven bij de hemelpoort",
          "Een grap over een man die zijn auto mee wilde nemen naar de hemel",
          "Een grap over iemand die zijn huis wilde verkopen aan Petrus",
          "Een grap over een rijke man die zijn testament kwijt was",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat noemt Koos als de ware rijkdom die je wel kunt meenemen naar het leven hierna?",
        options: [
          "Je relaties, je kennis en de karaktereigenschappen die je hebt ontwikkeld",
          "Je bankrekening en al je bezittingen",
          "Je functietitel en carrière",
          "Je verzameling waardevolle spullen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken hoe goedgelovig je moet zijn tegenover mensen en AI-chatbots",
          "Koos stelt de vraag of Raphael zichzelf rijk vindt",
          "Ze bespreken de tempelervaring waarin Adam en Eva Satans aanbod afwijzen",
          "Ze concluderen dat je als kind en erfgenaam van God uiteindelijk alles kunt ontvangen",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Jakob 2 leert Jakob het volk over rijkdom. Wat moeten zij zoeken vóórdat zij naar rijkdom streven, volgens vers 18?",
        options: [
          "Het koninkrijk van God",
          "Een groter huis",
          "Meer aanzien in de gemeenschap",
          "Een hogere positie in het leger",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Jakob 2:19 mag je pas rijkdom nastreven nadat je hoop in Christus hebt verkregen, en dan met de bedoeling om er goed mee te doen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke doelen noemt Jakob 2:19 voor het gebruiken van verkregen rijkdom?",
        options: [
          "De naakten kleden, de hongerigen voeden, gevangenen bevrijden en zieken en noodlijdenden helpen",
          "Alleen het vergroten van je eigen aanzien",
          "Het opbouwen van een zo groot mogelijk persoonlijk vermogen",
          "Het financieren van oorlogen tegen vijandige volken",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Jakob 2 in de juiste volgorde.",
        items: [
          "Acht uw broeders als uzelf en wees vrijgevig met uw bezit",
          "Zoek het koninkrijk Gods voordat gij naar rijkdom streeft",
          "Verkrijg eerst hoop in Christus",
          "Streef daarna naar rijkdom met de bedoeling goed te doen",
        ],
      },
    ],
  },
  {
    number: 85,
    title: "Aflevering 85",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk cijfer geeft Raphael aan zijn eigen leven op dit moment, toen Koos ernaar vroeg?",
        options: [
          "Een negen",
          "Een tien",
          "Een zes",
          "Een drie",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vindt dat 'weest gij volmaakt' verkeerd vertaald is, en dat het eigenlijk zou moeten gaan om één zijn met God, zoals in het hogepriesterlijk gebed van Christus.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke vergelijking gebruikt Koos om uit te leggen hoe zonde en bekering werken?",
        options: [
          "Een creditcard die gevuld wordt met dingen die niet goed gingen, en die alleen door Christus op nul gezet kan worden",
          "Een spaarpot die je vult met goede werken totdat die vol is",
          "Een bibliotheekboek dat je op tijd moet inleveren",
          "Een puzzel die je stukje voor stukje moet afmaken",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarover zijn Koos en Raphael het aan het einde eens, als het gaat om het doel van dit leven?",
        options: [
          "Dat het doel niet is om volmaakt te worden, maar om te leren en steeds weer terug te keren naar Christus",
          "Dat het doel is om zoveel mogelijk aardse bezittingen te verzamelen",
          "Dat het doel is om nooit meer een fout te maken",
          "Dat het doel is om zo snel mogelijk het leven te beëindigen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken online reviews en waarom één ster zelden terecht is",
          "Ze bespreken het geloofsartikel over 'weest gij volmaakt' en of dat een verkeerde vertaling is",
          "Koos legt de creditcard-vergelijking uit voor zonde en bekering",
          "Ze bespreken waarom Satans plan makkelijker was, maar geen keuzevrijheid bood",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 34 spoort Amulek het volk aan om hun bekering niet uit te stellen. Wat noemt hij dit leven, volgens vers 32?",
        options: [
          "De tijd voor de mens om zich voor te bereiden God te ontmoeten en zijn arbeid te verrichten",
          "Een tijd zonder enig belang voor de eeuwigheid",
          "Een tijd die volledig losstaat van het leven hierna",
          "Een periode die voor iedereen precies even lang duurt",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 34:33 komt er een 'nacht van duisternis' na dit leven, waarin geen arbeid meer verricht kan worden als je je tijd nu niet nuttig besteedt.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt Alma 34:34 over de geest die je lichaam bezit op het moment dat je uit dit leven vertrekt?",
        options: [
          "Diezelfde geest zal macht hebben om je lichaam in de eeuwige wereld te bezitten",
          "Die geest verdwijnt volledig en heeft geen enkele invloed meer",
          "Die geest wordt automatisch vervangen door een compleet nieuwe geest",
          "Die geest heeft geen enkel verband met wie je hierna zult zijn",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze aansporingen uit Alma 34 in de juiste volgorde.",
        items: [
          "Treed naar voren en laat uw hart niet langer verstokt zijn",
          "Dit leven is de tijd om u voor te bereiden God te ontmoeten",
          "Stel de dag van uw bekering niet uit tot het einde",
          "Anders komt de nacht van duisternis waarin geen arbeid kan worden verricht",
        ],
      },
    ],
  },
  {
    number: 84,
    title: "Aflevering 84",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar ergert Koos zich aan, als het gaat om hoe zijn kerk soms door anderen wordt gezien?",
        options: [
          "Dat mensen zeggen dat zijn kerk geen christelijke kerk zou zijn",
          "Dat mensen de kerkdiensten te lang vinden duren",
          "Dat mensen denken dat de kerk geen liederen zingt",
          "Dat mensen denken dat de kerk geen tempels heeft",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael legt uit dat de bijnaam 'mormonen' oorspronkelijk als scheldnaam werd gebruikt, verwijzend naar het Boek van Mormon, en dat de kerk sinds 2018 weer bewust de officiële naam gebruikt.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom kunnen Koos en Raphael zich niet vinden in het argument dat een kerk met meer geschriften dan alleen de Bijbel 'niet van God' zou zijn?",
        options: [
          "Omdat de Bijbel zelf oorspronkelijk uit meer boeken bestond en God vandaag de dag nog steeds openbaringen geeft",
          "Omdat de Bijbel toch niet meer relevant is",
          "Omdat alle christelijke kerken het daar toch al mee eens zijn",
          "Omdat er geen enkel verband is tussen de Bijbel en het Boek van Mormon",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat noemt Raphael als het belangrijkste verschil tussen hun kerk en andere christelijke kerken?",
        options: [
          "Dat zij geloven dat Christus door een levende profeet zijn kerk vandaag de dag nog rechtstreeks bestuurt",
          "Dat alleen hun kerk in Jezus Christus gelooft",
          "Dat andere kerken helemaal geen leiders hebben",
          "Dat hun kerk als enige de tien geboden erkent",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Koos ergert zich eraan dat mensen zeggen dat zijn kerk geen christelijke kerk is",
          "Ze bespreken de herkomst en geschiedenis van de bijnaam 'mormonen'",
          "Ze bespreken waarom er meer geschriften dan alleen de Bijbel kunnen bestaan",
          "Raphael legt uit wat hun kerk onderscheidt van andere christelijke kerken",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 2 Nephi 29 profeteert Nephi dat velen zullen zeggen: \"Een Bijbel! Wij hebben een Bijbel en er kan niet nog méér Bijbel zijn.\" Hoe reageert de Heer daarop, volgens vers 8?",
        options: [
          "Hij vraagt waarom zij morren, terwijl Hij dezelfde woorden tot verschillende naties spreekt",
          "Hij geeft hun meteen gelijk en stopt met verdere openbaring",
          "Hij zegt dat de Bijbel de enige tekst is die ooit nodig zal zijn",
          "Hij negeert de vraag volledig",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 2 Nephi 29:9 zegt de Heer dat zijn werk nog niet voltooid is, en dat het feit dat Hij al één woord heeft gesproken niet betekent dat Hij er geen tweede kan spreken.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt 2 Nephi 29:10 over de veronderstelling dat de Bijbel alle woorden van God bevat?",
        options: [
          "Dat is een verkeerde veronderstelling; God kan meer hebben laten opschrijven",
          "Dat is volledig juist, er is niets meer te verwachten",
          "De Bijbel bevat inderdaad letterlijk elk woord van God",
          "Dit onderwerp wordt in dit vers niet besproken",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit 2 Nephi 29 in de juiste volgorde.",
        items: [
          "Velen zullen zeggen: een Bijbel, wij hebben een Bijbel en hebben niet meer nodig",
          "De Heer vraagt waarom zij morren omdat zij meer van zijn woord zullen ontvangen",
          "Zijn werk is nog niet voleindigd, noch zal het dat zijn vóór het einde van het mensdom",
          "Wie een Bijbel heeft, moet niet veronderstellen dat die al Gods woorden bevat",
        ],
      },
    ],
  },
  {
    number: 83,
    title: "Aflevering 83",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom gingen Koos en Raphael dit weekend, tijdens de algemene conferentie, allebei naar een andere kerk?",
        options: [
          "Omdat er tijdens een algemene-conferentieweekend geen reguliere avondmaalsdienst in hun eigen wijk is",
          "Omdat hun eigen kerkgebouw gesloten was voor renovatie",
          "Omdat ze allebei verhuisd waren naar een andere stad",
          "Omdat ze uit nieuwsgierigheid nooit meer naar hun eigen kerk wilden",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vertelt dat hij bij de andere kerk drie kwartier moest blijven staan tijdens een lange muzikale sessie met een volledige band.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat viel Koos en Raphael allebei op tijdens hun kerkbezoek, wat ze aan elkaar bekenden?",
        options: [
          "Dat ze allebei de behoefte voelden om zelf iets te zeggen of een toespraak te geven",
          "Dat ze zich allebei erg verveelden",
          "Dat ze allebei de muziek verschrikkelijk vonden",
          "Dat ze allebei precies wisten welke kerk het was",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is de conclusie van Koos en Raphael over waarom Christus, als hij zijn kerk zou stichten, niet meerdere verschillende kerken zou hebben?",
        options: [
          "Omdat het onlogisch is dat Christus meerdere kerken zou managen, terwijl zijn leer maar één is",
          "Omdat er wettelijk maar één kerk per land is toegestaan",
          "Omdat andere kerken geen gebouwen hebben",
          "Omdat andere kerken de Bijbel niet gebruiken",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken de opbouw van de algemene conferentie en hoe ze die volgen",
          "Ze vertellen over hun bezoek aan andere kerken dat weekend",
          "Ze bespreken de behoefte die ze allebei voelden om zelf iets te zeggen",
          "Ze concluderen dat Christus maar één kerk zou stichten en leiden",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 3 Nephi 11 geeft Christus zijn leer aan het volk in Amerika. Wat zegt Hij over woordenstrijd omtrent zijn leer, in vers 28-29?",
        options: [
          "Er mag geen woordenstrijd zijn, want de geest van twisten is niet van Hem maar van de duivel",
          "Woordenstrijd is juist een goed teken van betrokkenheid",
          "Hij moedigt debat over zijn leer juist aan",
          "Hij zegt daar niets specifieks over",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 3 Nephi 11:32 getuigen de Vader, de Zoon en de Heilige Geest van elkaar, en gebiedt de Vader alle mensen overal zich te bekeren en in Christus te geloven.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt Christus in 3 Nephi 11:40 over wie meer of minder verkondigt dan zijn leer en dat als zijn leer vestigt?",
        options: [
          "Die persoon is uit den boze en bouwt op een zanderig fundament",
          "Die persoon wordt daar automatisch voor beloond",
          "Dat maakt voor de uiteindelijke uitkomst geen enkel verschil",
          "Christus zegt dat dit juist verrijkend kan zijn",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit 3 Nephi 11 in de juiste volgorde.",
        items: [
          "Christus gebiedt dat er geen woordenstrijd over de punten van zijn leer zal zijn",
          "De geest van twisten is niet van Christus maar van de duivel",
          "Dit is de leer die de Vader aan Christus heeft gegeven",
          "Wie meer of minder verkondigt en dat als zijn leer vestigt, bouwt op een zanderig fundament",
        ],
      },
    ],
  },
  {
    number: 82,
    title: "Aflevering 82",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar draait het gesprek in deze aflevering vooral om?",
        options: [
          "Of je de weg naar het eeuwige leven voor jezelf bewandelt, of dat je daar anderen bij nodig hebt",
          "Of je beter alleen of samen kunt reizen",
          "Of de podcast een betaalde baan zou kunnen worden",
          "Of engelen wel of niet bestaan",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos legt uit dat hij, ook na zijn scheiding, het huwelijksverbond met zijn ex-partner niet heeft verbroken, zodat zij zelf altijd de mogelijkheid behoudt om er via dat verbond zegeningen aan te ontlenen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat noemt Koos als bron van hulp die we niet altijd kunnen zien, naast de mensen om ons heen?",
        options: [
          "Beschermengelen en geestelijke begeleiders",
          "Alleen wetenschappelijke instanties",
          "Alleen de overheid",
          "Niets, hij gelooft niet in onzichtbare hulp",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat concluderen Koos en Raphael over of je ooit echt alleen bent?",
        options: [
          "Dat je nooit echt alleen bent, dankzij de Heilige Geest en de mensen om je heen die willen helpen",
          "Dat iedereen uiteindelijk toch helemaal alleen voor zijn eigen redding staat",
          "Dat je alleen niet alleen bent als je getrouwd bent",
          "Dat eenzaamheid volledig onvermijdelijk is",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken of ze de podcast ooit tot een betaalde baan zouden kunnen maken",
          "Koos legt uit dat de weg naar het eeuwige leven wel voor jezelf is, maar niet alleen",
          "Raphael vertelt over het verzegelingsverbond en de individuele keuze daarin",
          "Ze bespreken beschermengelen en of ze zich ooit echt alleen hebben gevoeld",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Mosiah 18 doopt Alma het volk bij de wateren van Mormon. Waartoe verklaren zij zich bereid, volgens vers 8?",
        options: [
          "Elkaars lasten te dragen, opdat zij licht zullen zijn",
          "Alleen voor zichzelf te zorgen",
          "Zich volledig van de rest van het volk af te zonderen",
          "Nooit meer met anderen te spreken over hun geloof",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Mosiah 18:9 verklaren zij zich ook bereid om te treuren met hen die treuren en te vertroosten wie vertroosting nodig heeft.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarvan getuigt de doop volgens Mosiah 18:10?",
        options: [
          "Dat je een verbond met de Heer bent aangegaan om Hem te dienen en zijn geboden te onderhouden",
          "Dat je nu volledig op jezelf staat, zonder gemeenschap",
          "Dat je nooit meer fouten zult maken",
          "Dat je een speciale status krijgt boven anderen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Mosiah 18 in de juiste volgorde.",
        items: [
          "Alma vraagt of zij verlangend zijn tot de kudde Gods toe te treden",
          "Zij verklaren zich bereid elkaars lasten te dragen",
          "Zij verklaren zich bereid te treuren met hen die treuren en te troosten",
          "Alma vraagt of zij zich dan willen laten dopen als getuigenis van dat verbond",
        ],
      },
    ],
  },
  {
    number: 81,
    title: "Aflevering 81",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk computerspel noemt Raphael als zijn 'guilty pleasure', ondanks dat hij het eigenlijk een slecht spel vindt?",
        options: [
          "GTA (Grand Theft Auto)",
          "Mario Kart",
          "FIFA",
          "Minecraft",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos legt uit dat gamen op zich niet verkeerd is, maar dat het een probleem wordt zodra het uit balans raakt en ten koste gaat van gezin of werk.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vertellen Koos en Raphael over Satan en zijn volgelingen in het voorbestaan?",
        options: [
          "Dat één derde van Gods geesteskinderen tijdens de oorlog in de hemel met Satan meeging",
          "Dat Satan helemaal geen volgelingen had",
          "Dat Satan pas op aarde volgelingen kreeg",
          "Dat de helft van de mensheid met Satan meeging",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe leggen Koos en Raphael uit dat Satan aan zijn kennis en macht komt?",
        options: [
          "Hij heeft dezelfde kennis van Hemelse Vader gekregen als ieder ander geesteskind, maar gebruikt die voor eigen gewin in plaats van uit naastenliefde",
          "Hij heeft zijn eigen, volledig aparte bron van kennis los van God",
          "Hij heeft geen enkele kennis en werkt puur op toeval",
          "Zijn kennis komt uitsluitend van mensen die hem aanbidden",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Raphael vertelt over zijn guilty pleasure-game GTA",
          "Koos legt uit hoe Satan de natuurlijke mens en verslaving kan versterken",
          "Ze bespreken de oorlog in de hemel en waarom Satan viel",
          "Ze concluderen dat het draait om steeds weer de focus op Christus terugbrengen",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 2 Nephi 2 legt Lehi aan zijn zoon uit hoe de duivel is ontstaan. Wat zegt hij daarover in vers 17?",
        options: [
          "Een engel Gods was uit de hemel gevallen en werd daardoor een duivel, omdat hij had gezocht wat kwaad was",
          "De duivel heeft altijd al als duivel bestaan, los van God",
          "De duivel is een schepping van de mensheid zelf",
          "De duivel was oorspronkelijk een dier",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 2 Nephi 2:18 zocht de duivel, nadat hij voor eeuwig ellendig was geworden, ook de ellende van het gehele mensdom.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt 2 Nephi 2:27 over de vrijheid van de mens?",
        options: [
          "Mensen zijn vrij om vrijheid en eeuwig leven te kiezen, of gevangenschap en dood volgens de macht van de duivel",
          "Mensen hebben helemaal geen keuzevrijheid",
          "Alleen profeten hebben keuzevrijheid",
          "Keuzevrijheid bestaat alleen na de dood",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit 2 Nephi 2 in de juiste volgorde.",
        items: [
          "Een engel Gods was uit de hemel gevallen en werd een duivel",
          "Hij zocht ook de ellende van het gehele mensdom",
          "Hij zeide tot Eva dat zij van de verboden vrucht zou eten",
          "Mensen zijn vrij om vrijheid te kiezen, of gevangenschap naar de macht van de duivel",
        ],
      },
    ],
  },
  {
    number: 80,
    title: "Aflevering 80",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke stichting heeft Koos meer dan tien jaar geleden zelf opgericht?",
        options: [
          "Een stichting die uitstapjes organiseert voor oudere mensen",
          "Een stichting voor daklozenopvang",
          "Een stichting voor jeugdsport",
          "Een stichting voor muziekonderwijs",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "De stichting van Koos haalt mensen thuis op en brengt ze ook weer terug, en werkt inmiddels met veertien bussen en zo'n vijftig vrijwilligers.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vertelt Koos als voorbeeld van hoe God volgens hem achter de schermen werkt via andere mensen?",
        options: [
          "Dat twee zendelingen precies op het moment aankwamen dat hij hulp nodig had bij het tillen van zware meubels tijdens zijn verhuizing",
          "Dat hij een onverwachte grote geldsom ontving",
          "Dat zijn auto plotseling werd gerepareerd zonder dat hij ernaar vroeg",
          "Dat hij een droom kreeg met de oplossing voor een probleem",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke film noemt Raphael als voorbeeld van het idee dat goedheid wordt doorgegeven van de één op de ander?",
        options: [
          "Pay It Forward",
          "The Blind Side",
          "Forrest Gump",
          "It's a Wonderful Life",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Koos vertelt over de stichting die uitstapjes voor ouderen organiseert",
          "Ze bespreken waarom vrijwilligers dit soort werk graag doen",
          "Raphael noemt de film Pay It Forward als voorbeeld van doorgegeven goedheid",
          "Koos vertelt over de zendelingen die precies op tijd kwamen helpen bij zijn verhuizing",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Mosiah 2 leert koning Benjamin zijn volk een belangrijke les over dienstbetoon. Wat zegt hij in vers 17?",
        options: [
          "Wanneer je in dienst van je medemens bent, ben je louter in dienst van je God",
          "Dienstbetoon aan anderen heeft geen enkele geestelijke waarde",
          "Alleen dienstbetoon binnen de tempel telt echt mee",
          "Je moet altijd eerst jezelf dienen voordat je anderen kan dienen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koning Benjamin vergelijkt zichzelf als koning met God: als hij, hun aardse koning, hen dient, behoren zij dan niet ook elkaar te dienen?",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt koning Benjamin in Mosiah 2:21 over hoezeer wij God zouden moeten dienen?",
        options: [
          "Zelfs als je Hem met je hele ziel zou dienen, zou je nog een onnutte dienstknecht zijn, omdat Hij ons alles geeft wat we hebben",
          "Niemand hoeft God ooit te dienen",
          "God heeft onze dienst helemaal niet nodig",
          "Alleen koningen hoeven God te dienen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken van koning Benjamin uit Mosiah 2 in de juiste volgorde.",
        items: [
          "Hij vertelt het volk deze dingen opdat zij wijsheid zullen leren",
          "Wanneer je in dienst van je medemens bent, ben je in dienst van God",
          "Als hun koning hen dient, behoren zij elkaar dan niet ook te dienen",
          "Zelfs wie God met zijn hele ziel dient, blijft een onnutte dienstknecht",
        ],
      },
    ],
  },
  {
    number: 79,
    title: "Aflevering 79",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk voorbeeld noemt Raphael om uit te leggen dat geboden juist meer vrijheid geven in plaats van die weg te nemen?",
        options: [
          "Verkeersregels, die ervoor zorgen dat we veilig van punt A naar punt B kunnen komen",
          "Belastingregels",
          "Sportregels bij voetbal",
          "Regels rond huisdieren",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vertelt dat hij zich in bepaalde opzichten wel gemanipuleerd voelt door hoe de kerkgeschiedenis vroeger werd gepresenteerd, zoals rondom de vertaling van het Boek van Mormon.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom vindt Raphael het juist geloofwaardiger dat er meerdere, licht verschillende versies van Joseph Smiths eerste visioen bestaan?",
        options: [
          "Omdat een verhaal dat elke keer net iets anders wordt verteld, minder op een ingestudeerde leugen lijkt dan een verhaal dat altijd identiek is",
          "Omdat verschillende versies altijd bewijzen dat een verhaal verzonnen is",
          "Omdat het aantal versies volledig irrelevant is voor de geloofwaardigheid",
          "Omdat de kerk dat nooit heeft toegegeven",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat noemt Koos als reden waarom hij, ondanks bepaalde twijfels over personen, toch overtuigd blijft van het Boek van Mormon?",
        options: [
          "De bevestiging die hij door de Heilige Geest voelt tijdens het bestuderen ervan",
          "Omdat iedereen om hem heen het ook gelooft",
          "Omdat hij het nooit in twijfel heeft getrokken",
          "Omdat de kerk het hem opdraagt te geloven",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken manipulatie in het dagelijks leven, zoals opvoeding en reclame",
          "Raphael legt uit dat geboden juist meer vrijheid geven in plaats van beperking",
          "Koos vertelt over de veranderde openheid rond de kerkgeschiedenis",
          "Ze bespreken waarom meerdere versies van een verhaal het geloofwaardiger kunnen maken",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 2 Nephi 10 moedigt Jakob het volk aan hun hart op te heffen. Waaraan herinnert hij hen in vers 23?",
        options: [
          "Dat zij vrij zijn om naar eigen inzicht te handelen, om de weg van de dood of van het eeuwige leven te kiezen",
          "Dat zij geen enkele keuzevrijheid hebben",
          "Dat alleen de koning mag kiezen voor het hele volk",
          "Dat keuzevrijheid alleen na de dood bestaat",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 2 Nephi 10:24 worden wij, wanneer wij met God zijn verzoend, alleen in en door de genade van God behouden.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarmee moeten wij ons volgens 2 Nephi 10:24 verzoenen, en waarmee niet?",
        options: [
          "Met de wil van God, en niet met de wil van de duivel en het vlees",
          "Met de wil van de duivel, en niet met de wil van God",
          "Met de mening van de meerderheid, ongeacht wat die is",
          "Met geen enkele wil, want dat maakt niets uit",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit 2 Nephi 10 in de juiste volgorde.",
        items: [
          "Wees goedsmoeds, want gij zijt vrij om naar eigen inzicht te handelen",
          "Verzoen u met de wil van God, niet met de wil van de duivel",
          "Alleen door de genade Gods wordt gij behouden",
          "Moge God u opwekken door de kracht van de opstanding en de verzoening",
        ],
      },
    ],
  },
  {
    number: 78,
    title: "Aflevering 78",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk vergelijk maakt Raphael tussen het geloof in Sinterklaas en het geloof in God?",
        options: [
          "Dat het voor kinderen soms makkelijker is om in Sinterklaas te geloven dan in een Hemelse Vader die ze ook niet kunnen zien",
          "Dat Sinterklaas en God precies hetzelfde zijn",
          "Dat zijn kinderen nooit in Sinterklaas hebben geloofd",
          "Dat het geloof in Sinterklaas gevaarlijker is dan geloof in God",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos legt uit dat hij 'onrein' niet definieert als het maken van fouten, maar als het bewust afkeren van Christus en zijn zoenoffer niet willen gebruiken.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke theorie oppert Koos over hoe Joseph Smith God de Vader en Jezus Christus zag tijdens het eerste visioen?",
        options: [
          "Dat zijn geest in een andere dimensie met hen sprak, terwijl zijn lichaam gewoon op de grond lag",
          "Dat iedereen die er die dag bij was hen ook gewoon kon zien",
          "Dat het volledig een droom was zonder enige werkelijke ervaring",
          "Dat hij hen zag via een telescoop",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom waarschuwen Koos en Raphael tegen een oppervlakkig geloof, waarbij je 'met je lippen belijdt' maar er verder niet naar leeft?",
        options: [
          "Omdat je dan niet voldoet aan het grootste gebod om God lief te hebben met heel je hart, verstand en kracht",
          "Omdat de kerk daar een boete voor oplegt",
          "Omdat oppervlakkig geloof nergens toe leidt in het dagelijks leven",
          "Omdat het praktisch onmogelijk is om oppervlakkig te geloven",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Raphael vertelt over het gesprek met zijn kinderen over Sinterklaas",
          "Ze bespreken hoe je 'onrein' zou moeten definiëren",
          "Koos deelt zijn theorie over hoe Joseph Smith God zag tijdens het eerste visioen",
          "Ze waarschuwen tegen een oppervlakkig, alleen met de lippen beleden geloof",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 7 legt Alma uit dat wij wedergeboren moeten worden. Wat is daarvoor nodig, volgens vers 14?",
        options: [
          "Bekering en doop tot vergeving van zonden, met geloof in het Lam Gods",
          "Alleen het betalen van een offer in de tempel",
          "Het uit het hoofd leren van alle geboden",
          "Een speciale ceremonie die alleen voor profeten is weggelegd",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 7:21 kan geen vuilheid of iets wat onrein is in het koninkrijk van God worden ontvangen, en woont God niet in onheilige tempels.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waartoe roept Alma het volk op in vers 22-23, naast reinheid?",
        options: [
          "Ootmoedig, onderworpen, zachtmoedig en dankbaar te zijn, en de geboden nauwgezet te onderhouden",
          "Zich volledig af te zonderen van de samenleving",
          "Nooit meer iets aan God te vragen",
          "Alleen op belangrijke feestdagen aan God te denken",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Alma 7 in de juiste volgorde.",
        items: [
          "Bekeer u en word wedergeboren om het koninkrijk der hemelen te beërven",
          "Niets onreins kan in het koninkrijk van God worden ontvangen",
          "Alma wil hen wakker schudden tot een besef van hun plicht jegens God",
          "Wees ootmoedig, onderworpen en dankbaar in alle dingen",
        ],
      },
    ],
  },
  {
    number: 77,
    title: "Aflevering 77",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar gaat het gesprek in deze aflevering vooral over, naar aanleiding van energiedrankjes?",
        options: [
          "Verslavende en ongezonde middelen zoals cafeïne, alcohol en vapen, en hoe je daarmee omgaat",
          "De beste recepten voor gezonde smoothies",
          "De geschiedenis van de theeplant",
          "Sportvoeding voor topsporters",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vertelt vol bewondering dat Joseph Smith al 200 jaar geleden een openbaring kreeg over gezondheid, het woord van wijsheid, lang voordat de wetenschap de schadelijke effecten van bijvoorbeeld alcohol kon aantonen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat noemen Koos en Raphael als reden waarom mensen toch beginnen met verslavende middelen, ook al weten ze dat het niet goed voor ze is?",
        options: [
          "Groepsdruk, nieuwsgierigheid en het idee dat verslaving 'hen niet zal overkomen'",
          "Omdat het altijd verplicht wordt door de overheid",
          "Omdat er geen enkel gezondheidsrisico aan verbonden is",
          "Omdat alle religies het juist aanmoedigen",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk advies geeft Koos over hoe je anderen kunt helpen om los te komen van verslavende gewoontes?",
        options: [
          "Door zelf een goed voorbeeld te zijn, zodat mensen zien dat het ook zonder kan",
          "Door mensen te dwingen om te stoppen",
          "Door nooit met iemand over het onderwerp te praten",
          "Door zelf ook maar mee te doen om erbij te horen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken de discussie rond energiedrankjes en cafeïne voor jongeren",
          "Koos vertelt over de openbaring over gezondheid die 200 jaar geleden werd gegeven",
          "Ze bespreken waarom mensen toch beginnen met verslavende middelen",
          "Ze bespreken hoe je door een goed voorbeeld anderen kunt helpen",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 38 geeft Alma raad aan zijn zoon Sjiblon. Waartoe roept hij hem op in vers 10?",
        options: [
          "Om in alle dingen ijverig en matig te zijn",
          "Om zoveel mogelijk rijkdom te verzamelen",
          "Om zich volledig af te zonderen van andere mensen",
          "Om nooit meer te spreken in het openbaar",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 38:12 moet Sjiblon al zijn hartstochten beteugelen, opdat hij met liefde vervuld zal zijn, en moet hij luiheid vermijden.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarvoor waarschuwt Alma zijn zoon in vers 11?",
        options: [
          "Om niet tot hoogmoed verheven te worden of te roemen op eigen wijsheid of kracht",
          "Om nooit meer te bidden",
          "Om zich nooit te verdiepen in de schriften",
          "Om altijd zoveel mogelijk aanmatiging te tonen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze raadgevingen uit Alma 38 in de juiste volgorde.",
        items: [
          "Wees in alle dingen ijverig en matig",
          "Zie toe dat gij niet tot hoogmoed verheven wordt",
          "Beteugel al uw hartstochten, opdat gij met liefde vervuld zult zijn",
          "Bid niet zoals de Zoramieten, om door mensen geprezen te worden",
        ],
      },
    ],
  },
  {
    number: 76,
    title: "Aflevering 76",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk bijbelverhaal bespreken Koos en Raphael uitgebreid, met de vraag of het letterlijk de hele aarde betrof?",
        options: [
          "Het verhaal van Noach en de zondvloed",
          "Het verhaal van Jona en de vis",
          "Het verhaal van David en Goliath",
          "Het verhaal van de doortocht door de Rode Zee",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael oppert dat de zondvloed misschien wel plaatselijk was en dat dit voor Noach, gezien zijn beperkte referentiekader, aanvoelde als de gehele wereld.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk veelvoorkomend misverstand over de ark van Noach noemt Raphael?",
        options: [
          "Dat mensen denken dat hij van elk dier precies twee meenam, terwijl dat niet exact zo in de tekst staat",
          "Dat de ark eigenlijk van hout noch metaal was gemaakt",
          "Dat Noach de ark eigenlijk nooit heeft gebouwd",
          "Dat er helemaal geen dieren aan boord waren",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarover zijn Koos en Raphael het eens, als het gaat om het begrijpen van de schriften?",
        options: [
          "Dat je de Heilige Geest nodig hebt om te begrijpen wat een schriftgedeelte voor jou op dit moment betekent",
          "Dat elke lezer de schriften vrij naar eigen smaak mag herschrijven",
          "Dat alleen de letterlijke lezing van elk vers de enige juiste is",
          "Dat schriftstudie eigenlijk niet zo belangrijk is",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken hoe reizen en nieuws de wereld kleiner hebben gemaakt",
          "Ze bespreken of de zondvloed van Noach de hele aarde bedekte of alleen zijn eigen omgeving",
          "Raphael noemt misverstanden over de ark van Noach en de drie wijzen",
          "Ze concluderen dat je de Heilige Geest nodig hebt om de schriften voor jezelf te begrijpen",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 1 Nephi 19 legt Nephi uit waarom hij de woorden van Jesaja aan zijn volk voorlas. Wat zegt hij daarover in vers 23?",
        options: [
          "Dat hij alle Schriften op zichzelf en zijn volk toepaste, opdat het hun tot nut en lering zou strekken",
          "Dat hij de woorden van Jesaja alleen maar letterlijk overschreef zonder er iets mee te doen",
          "Dat hij de profetieën van Jesaja juist probeerde te vermijden",
          "Dat hij de tekst compleet herschreef naar eigen inzicht",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 1 Nephi 19:24 moedigt Nephi zijn volk aan om de woorden van de profeet op zichzelf toe te passen, opdat zij hoop zullen hebben.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom had de profeet Jesaja zijn woorden geschreven, volgens Nephi in vers 24?",
        options: [
          "Opdat het huis van Israël, ook het afgebroken overblijfsel ervan, er hoop uit zou putten",
          "Puur als historisch verslag, zonder enig ander doel",
          "Om indruk te maken op andere volkeren",
          "Om alleen voor koningen bedoeld te zijn",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen uit 1 Nephi 19 in de juiste volgorde.",
        items: [
          "Nephi leest zijn volk voor uit de boeken van Mozes",
          "Hij leest hun ook voor wat de profeet Jesaja geschreven had",
          "Hij past alle Schriften op zichzelf en zijn volk toe",
          "Hij moedigt hen aan de woorden van de profeet ook op zichzelf toe te passen",
        ],
      },
    ],
  },
  {
    number: 75,
    title: "Aflevering 75",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom had Koos Raphael een tijdje niet in de kerk gezien?",
        options: [
          "Raphael was op vakantie en bezocht daar een andere plaatselijke kerk van hun geloof",
          "Raphael was tijdelijk gestopt met naar de kerk gaan",
          "Raphael was verhuisd naar een andere stad",
          "Raphael had een nieuwe roeping gekregen ver weg",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael vertelt dat hij tijdens zijn vakantie in Zwitserland, ondanks zenuwen die hij normaal wel heeft, spontaan zijn getuigenis gaf in het Engels, terwijl de dienst in het Frans werd gehouden.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Met welke vergelijking legt Raphael uit waarom regelmatig naar de kerk gaan belangrijk blijft, ook als je zelf kunt studeren?",
        options: [
          "Met het volgen van een opleiding: alleen thuisstudie zonder de aanvulling van school houdt op den duur vaak op",
          "Met het bijhouden van een dagboek",
          "Met het onderhouden van een auto",
          "Met het volgen van het nieuws",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vertelt Raphael over een periode waarin hij en zijn gezin bewust wegbleven van de kerk?",
        options: [
          "Dat het door problemen met bepaalde mensen kwam, maar dat ze uiteindelijk toch terugkeerden omdat ze het gemist hadden",
          "Dat ze nooit meer zijn teruggekeerd",
          "Dat het kwam doordat ze hun getuigenis waren kwijtgeraakt",
          "Dat de kerk hun lidmaatschap had ingetrokken",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Raphael vertelt over het kerkbezoek in Zwitserland tijdens zijn vakantie",
          "Ze bespreken waarom regelmatig kerkbezoek belangrijk blijft, ook als je zelf kan studeren",
          "Raphael vertelt over de periode dat zijn gezin wegbleef van de kerk",
          "Koos legt uit waarom Christus zoveel belang hecht aan zijn kerk",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Moroni 6 wordt beschreven hoe de vroege kerk van Christus functioneerde. Wat deden de leden dikwijls samen, volgens vers 5?",
        options: [
          "Vasten en bidden en met elkaar spreken over het welzijn van hun ziel",
          "Alleen maar zwijgend bij elkaar zitten zonder enige activiteit",
          "Uitsluitend zakelijke vergaderingen houden",
          "Alleen op belangrijke feestdagen samenkomen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 6:6 kwamen de leden van de kerk dikwijls tezamen om van het brood en de wijn te nemen ter gedachtenis van de Heer Jezus.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar werden de bijeenkomsten van de vroege kerk door geleid, volgens Moroni 6:9?",
        options: [
          "Door de werkingen van de Geest en de macht van de Heilige Geest",
          "Door een vast, onveranderlijk script zonder enige ruimte voor de Geest",
          "Uitsluitend door de oudste persoon aanwezig",
          "Door loting onder de aanwezigen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze beschrijvingen uit Moroni 6 in de juiste volgorde.",
        items: [
          "Wie gedoopt was, werd bij het volk van de kerk van Christus gerekend",
          "De leden kwamen dikwijls tezamen om te vasten en te bidden",
          "Zij kwamen dikwijls tezamen om van het brood en de wijn te nemen",
          "Hun bijeenkomsten werden geleid naar de werkingen van de Heilige Geest",
        ],
      },
    ],
  },
  {
    number: 74,
    title: "Aflevering 74",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk onderwerp staat centraal in deze aflevering, naar aanleiding van een vraag over de juiste vorm van dopen?",
        options: [
          "Of de doop door onderdompeling moet gebeuren, en waarom dat zo belangrijk is",
          "Of je meerdere keren gedoopt mag worden voor de lol",
          "Welke kleur kleding je bij een doop moet dragen",
          "Op welke dag van de week een doop moet plaatsvinden",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael legt uit dat de manier van dopen bekend is doordat Christus dit via openbaring aan zijn profeten heeft bekendgemaakt, en niet iets is wat mensen zelf mogen bepalen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vertelt Raphael over plaatsvervangende doop (doop voor de doden)?",
        options: [
          "Dat je namens een overledene wordt ondergedompeld, met bijna hetzelfde doopgebed, zodat ook zij van dat verbond gebruik kunnen maken",
          "Dat het helemaal geen onderdompeling vereist",
          "Dat het alleen voor levende mensen bedoeld is",
          "Dat het nooit in de kerk wordt gepraktiseerd",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarover raken Koos en Raphael in de war aan het einde van de aflevering?",
        options: [
          "Of kinderen onder de acht jaar, die nog niet gedoopt kunnen worden, wel of niet zonde kunnen begaan",
          "Of de doop wel echt door Christus is ingesteld",
          "Of het avondmaal ouder is dan de doop",
          "Of profeten wel echt openbaring ontvangen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken de doop door onderdompeling en waar die vandaan komt",
          "Ze bespreken het avondmaalsgebed en het verbond van de doop",
          "Raphael legt uit hoe plaatsvervangende doop voor overledenen werkt",
          "Ze raken in discussie over de doopleeftijd van acht jaar en zonde bij jonge kinderen",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 3 Nephi 11 leert Christus zijn discipelen in Amerika precies hoe zij moeten dopen. Wat moeten zij doen volgens vers 23?",
        options: [
          "In het water afdalen en de persoon in zijn naam dopen",
          "Alleen water over het hoofd van de persoon sprenkelen",
          "De persoon met olie zalven in plaats van water te gebruiken",
          "Helemaal geen water gebruiken, alleen een gebed uitspreken",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 3 Nephi 11:26 moeten zij de persoon in het water onderdompelen en weer uit het water laten komen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke exacte woorden geeft Christus in 3 Nephi 11:25 voor het doopgebed?",
        options: [
          "Met het gezag mij door Jezus Christus verleend, doop ik u in de naam van de Vader, de Zoon en de Heilige Geest",
          "In naam van de kerk doop ik u tot vergeving van al uw schulden",
          "Er wordt geen enkele specifieke tekst gegeven",
          "Een gebed volledig in het Hebreeuws",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze instructies van Christus uit 3 Nephi 11 in de juiste volgorde.",
        items: [
          "Wie zich bekeert en zich wil laten dopen, zult gij in het water afdalen en dopen",
          "Gij zult de exacte woorden van het doopgebed uitspreken",
          "Gij zult hen in het water onderdompelen",
          "Gij zult hen wederom uit het water laten komen",
        ],
      },
    ],
  },
  {
    number: 73,
    title: "Aflevering 73",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vertelt Koos over zijn eigen doopgeschiedenis?",
        options: [
          "Dat hij twee keer gedoopt is, de tweede keer nadat hij eerder uit de kerk was gezet",
          "Dat hij nooit gedoopt is geweest",
          "Dat hij drie keer gedoopt is voor verschillende familieleden",
          "Dat hij als baby werd gedoopt",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vertelt dat hij het herstel van zijn kerkelijke verbonden destijds niet als hulp heeft ervaren, maar eerder als een tegenwerking op zijn weg terug naar zijn hemelse vader.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke vergelijking gebruikt Koos om zijn gevoel over de kerk te beschrijven?",
        options: [
          "Een schoolgemeenschap die alleen het gymnasiumniveau aanbiedt, waardoor mensen die dat niveau niet halen zich buitengesloten voelen",
          "Een restaurant dat alleen voor VIP's toegankelijk is",
          "Een sportclub die alleen kampioenen toelaat",
          "Een bibliotheek die alleen wetenschappelijke boeken uitleent",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is de bekende uitspraak die Raphael aanhaalt over de kerk, en de tegenstrijdigheid die hij daarbij opmerkt?",
        options: [
          "Dat de kerk een 'ziekenhuis voor zondaars' wordt genoemd, terwijl mensen er soms toch last van hebben dat 'zondaars' ook echt binnenkomen",
          "Dat de kerk een 'bank voor goede daden' wordt genoemd",
          "Dat de kerk een 'universiteit voor heiligen' wordt genoemd",
          "Dat de kerk nooit met een vergelijking wordt omschreven",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Koos vertelt over zijn eerdere excommunicatie en zijn tweede doop",
          "Ze bespreken of excommunicatie een hulpmiddel of een tegenwerking is",
          "Koos gebruikt de vergelijking met een school die alleen gymnasium aanbiedt",
          "Ze bespreken de uitspraak dat de kerk een ziekenhuis voor zondaars is",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 2 Nephi 26 wordt beschreven hoe wijd Christus zijn uitnodiging maakt. Wat zegt vers 25 daarover?",
        options: [
          "Christus roept niemand toe om weg te gaan, maar nodigt juist alle einden der aarde uit tot Hem te komen",
          "Christus nodigt alleen de rechtvaardigen uit",
          "Christus sluit mensen die fouten maken categorisch uit",
          "Christus spreekt deze uitnodiging niet uit",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 2 Nephi 26:28 zijn alle mensen gelijkelijk begunstigd door de Heer, en wordt niemand buitengesloten.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat heeft de Heer zijn volk geboden, volgens 2 Nephi 26:27?",
        options: [
          "Om alle mensen tot bekering te bewegen, want Hij heeft het heil aan iedereen om niet gegeven",
          "Om alleen de rijken tot bekering te bewegen",
          "Om niemand meer uit te nodigen tot bekering",
          "Om alleen mensen binnen hun eigen familie te onderwijzen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit 2 Nephi 26 in de juiste volgorde.",
        items: [
          "Christus doet niets, tenzij het voor het welzijn van de wereld is",
          "Hij roept niemand toe om weg te gaan, maar nodigt hen allen uit",
          "Hij heeft niemand geboden om geen deel te hebben aan zijn heil",
          "Alle mensen zijn gelijkelijk begunstigd en niemand wordt buitengesloten",
        ],
      },
    ],
  },
  {
    number: 72,
    title: "Aflevering 72",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke tool voor zelfreflectie stelt Raphael voor, naast een timer van tien minuten?",
        options: [
          "Gebed, waarbij je doorpraat met Hemelse Vader nadat je vaste riedeltje op is",
          "Een dagelijkse podcast opnemen",
          "Een uur lang televisiekijken",
          "Een wekelijks bezoek aan de sportschool",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael vertelt dat hij een vitaliteitscoach op zijn werk heeft geraadpleegd en kleine gewoontes, zoals meer water drinken, geleidelijk in zijn leven heeft ingeslepen met behulp van een app.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk voorbeeld vertelt Koos over een moment waarop hij achteraf merkte dat hij gefrustreerd had gereageerd?",
        options: [
          "Toen hij zijn dochter kwijtraakte in een winkel en meteen verwijtend reageerde in plaats van te vragen of ze bezorgd was",
          "Toen hij een vergadering miste",
          "Toen zijn auto kapot ging tijdens de vakantie",
          "Toen hij een belangrijke afspraak vergat",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk gezegde uit Raphaels vakgebied gebruikt hij om uit te leggen waarom aannames tot problemen leiden?",
        options: [
          "\"Assumption is the mother of all mess-ups\" (aanname is de moeder van alle fouten)",
          "\"Meten is weten\"",
          "\"Beter voorkomen dan genezen\"",
          "\"Haastige spoed is zelden goed\"",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken persoonlijke ontwikkeling en de rol van zelfreflectie",
          "Raphael stelt voor om gebed als reflectie-tool te gebruiken met een timer",
          "Koos vertelt over zijn gefrustreerde reactie toen hij zijn dochter kwijtraakte",
          "Ze bespreken waarom doorvragen beter is dan boos worden op basis van aannames",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 37 geeft Alma raad aan zijn zoon Helaman. Wat zegt hij in vers 37 over hoe je moet handelen?",
        options: [
          "Raadpleeg de Heer bij al uw handelingen, en Hij zal u ten goede leiden",
          "Vraag nooit om raad, maar los alles zelf op",
          "Handel altijd zonder ooit stil te staan bij de gevolgen",
          "Vertrouw uitsluitend op je eigen wijsheid",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 37:36 moeten al onze gedachten tot de Heer uitgaan, en de gevoelens van ons hart voor eeuwig op Hem gericht zijn.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat belooft Alma zijn zoon in vers 37, als hij deze raad opvolgt?",
        options: [
          "Dat hij ten laatsten dage verhoogd zal worden",
          "Dat hij meteen rijk zal worden",
          "Dat hij nooit meer tegenslag zal ervaren",
          "Dat hij een leger zal aanvoeren",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze raadgevingen uit Alma 37 in de juiste volgorde.",
        items: [
          "Roep God aan voor al uw onderhoud en laat al uw handelingen tot de Heer zijn",
          "Raadpleeg de Heer bij al uw handelingen",
          "Leg u des nachts neer in de hoede des Heren",
          "Laat uw hart des ochtends vol dankbaarheid zijn jegens God",
        ],
      },
    ],
  },
  {
    number: 71,
    title: "Aflevering 71",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat had Koos net gelezen over het ontstaan van de Bijbel?",
        options: [
          "Dat de evangeliën pas decennia na Christus zijn opgeschreven en dat er keuzes zijn gemaakt over wat er wel en niet in kwam",
          "Dat de hele Bijbel binnen één jaar na Christus is geschreven",
          "Dat er geen enkele keuze is gemaakt over de inhoud",
          "Dat de Bijbel volledig door één enkele auteur is geschreven",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael vertelt dat het avondmaalsgebed vroeger woord voor woord foutloos moest worden opgezegd, anders werd het opnieuw gedaan, terwijl de exacte vertaling van dat gebed later toch is gewijzigd.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk voorbeeld van een veranderde kerkregel noemt Koos, over kleding tijdens jeugdkampen?",
        options: [
          "Dat vroeger strikte kledingregels golden met lange mouwen en rokken over de knie, wat nu is losgelaten",
          "Dat er nu juist strengere kledingregels gelden dan vroeger",
          "Dat kledingregels nooit zijn veranderd",
          "Dat kleding tegenwoordig verplicht wit moet zijn",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom benadrukken Koos en Raphael het belang van een levende profeet naast de geschreven schriften?",
        options: [
          "Omdat vertalingen en praktijken door de tijd heen kunnen veranderen, maar een profeet actuele duiding kan geven",
          "Omdat de geschreven schriften eigenlijk niet meer nodig zijn",
          "Omdat een profeet nooit een vergissing kan maken bij het interpreteren",
          "Omdat schriften alleen bedoeld zijn voor historisch onderzoek",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Koos vertelt over wat hij las over het ontstaan van de Bijbel",
          "Ze bespreken de veranderde vertaling van het doop- en avondmaalsgebed",
          "Koos noemt voorbeelden van veranderde kerkregels, zoals kledingvoorschriften",
          "Ze benadrukken het belang van persoonlijke openbaring naast die van de profeet",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Moroni 4 en 5 staan de exacte woorden van het avondmaalsgebed opgetekend, zoals die door Christus zijn ingesteld. Aan wie wordt in dit gebed gevraagd het brood te zegenen?",
        options: [
          "God, de eeuwige Vader, in de naam van zijn Zoon Jezus Christus",
          "Alleen de plaatselijke priester zelf",
          "De gemeente als geheel, zonder gebed",
          "Niemand, het gebed wordt niet tot iemand gericht",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 4:3 betuigen zij die van het brood nemen daarmee dat zij gewillig zijn de naam van Christus op zich te nemen en Hem altijd indachtig te zijn.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is het doel, volgens Moroni 4:3, van het onderhouden van Christus' geboden na het nemen van het brood?",
        options: [
          "Opdat zij zijn Geest altijd bij zich mogen hebben",
          "Opdat zij nooit meer hoeven te bidden",
          "Opdat zij automatisch rijk worden",
          "Opdat zij een hogere positie in de kerk krijgen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderdelen van het avondmaalsgebed uit Moroni 4-5 in de juiste volgorde.",
        items: [
          "De ouderling of priester knielt met de kerk neer en bidt tot de Vader",
          "Hij vraagt God het brood te zegenen en te heiligen voor de zielen van allen die ervan nemen",
          "Zij betuigen gewillig te zijn de naam van Christus op zich te nemen",
          "Op dezelfde wijze wordt ook de beker met wijn gezegend, ter gedachtenis van zijn bloed",
        ],
      },
    ],
  },
  {
    number: 70,
    title: "Aflevering 70",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk persoonlijk record vertelt Koos aan het begin van deze aflevering te hebben verbroken?",
        options: [
          "Hij heeft nu vier dagen achter elkaar gevast, in plaats van zijn vorige record van drie dagen",
          "Hij heeft een marathon gelopen",
          "Hij heeft een boek in één dag uitgelezen",
          "Hij heeft een week niet naar het nieuws geluisterd",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael benadrukt dat je overgeslagen maaltijden tijdens het vasten niet achteraf moet proberen in te halen, omdat dat het doel van het vasten juist tenietdoet.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vertelt Koos over het gesprek met een terminaal zieke vriend?",
        options: [
          "Dat zijn vriend de dood ziet als een overgang naar zijn hemelse thuis, zonder angst maar met liefde en positiviteit",
          "Dat zijn vriend erg bang was voor wat er na de dood komt",
          "Dat zijn vriend niet meer in God geloofde",
          "Dat zijn vriend boos was op zijn lot",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarover raken Koos en Raphael in discussie met betrekking tot het duizendjarig vrederijk?",
        options: [
          "Of Satan gebonden is omdat Christus hem bindt, of omdat de bevolking dan zo rechtvaardig is dat hij geen invloed meer heeft",
          "Of het duizendjarig vrederijk wel echt duizend jaar zal duren",
          "Of er dan nog steeds oorlogen zullen zijn",
          "Of de aarde dan zal ophouden te bestaan",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken wat hen vrolijk maakt en Koos' vastenrecord van vier dagen",
          "Koos vertelt over het bezoek aan zijn terminaal zieke vriend",
          "Ze bespreken het duizendjarig vrederijk en de sterfelijkheid daarin",
          "Ze bespreken of Satan gebonden is door Christus of door de rechtvaardigheid van het volk",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 1 Nephi 22 profeteert Nephi over de tijd dat de Heilige Israëls zal regeren. Waarom heeft Satan dan geen macht, volgens vers 26?",
        options: [
          "Wegens de rechtvaardigheid van het volk, waardoor hij geen macht over het hart der mensen heeft",
          "Omdat hij voorgoed vernietigd is",
          "Omdat hij nooit meer heeft bestaan",
          "Omdat er dan helemaal geen mensen meer op aarde zijn",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 1 Nephi 22:24-25 zal de Heilige Israëls regeren met heerschappij en macht, en zijn kinderen vergaderen uit de vier hoeken der aarde als één kudde met één Herder.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe lang kan Satan volgens 1 Nephi 22:26 niet worden losgelaten, wegens de rechtvaardigheid van het volk?",
        options: [
          "Vele jaren lang",
          "Slechts één dag",
          "Voor altijd, zonder enige uitzondering",
          "Er wordt geen tijdsduur genoemd",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze profetische uitspraken uit 1 Nephi 22 in de juiste volgorde.",
        items: [
          "De rechtvaardigen worden weggeleid en de Heilige Israëls zal regeren",
          "Hij vergadert zijn kinderen uit de vier hoeken der aarde",
          "Er zal één kudde zijn en één Herder",
          "Wegens de rechtvaardigheid van het volk heeft Satan geen macht",
        ],
      },
    ],
  },
  {
    number: 69,
    title: "Aflevering 69",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Met welk beeld legt Raphael de vijf stappen van het bekeringsproces uit?",
        options: [
          "Met de vijf vingers van zijn hand, van erkenning tot aan de belofte om het nooit meer te doen",
          "Met de vijf golfslagen van een rivier",
          "Met de vijf kleuren van een regenboog",
          "Met de vijf seizoenen van het jaar",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael en Koos zijn het erover eens dat er geen zonde is die te zwaar is om vergeven te worden, zolang het bekeringsproces oprecht wordt doorlopen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat noemen Koos en Raphael als het grootste obstakel bij vergeving, vaak groter dan God zelf of anderen?",
        options: [
          "Jezelf vergeven",
          "Het krijgen van toestemming van de kerkleiding",
          "Het vinden van de juiste woorden voor een gebed",
          "Het wachten op een teken van God",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat bedoelt Koos met het beeld van Christus' juk dat licht is?",
        options: [
          "Dat je je eigen zware juk aan de kant kunt leggen en samen met Christus zijn lichtere juk kunt dragen",
          "Dat je nooit meer enige verantwoordelijkheid hoeft te dragen",
          "Dat het juk van Christus zwaarder is dan je eigen juk",
          "Dat het juk alleen voor kerkleiders bedoeld is",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Raphael legt de vijf stappen van bekering uit met zijn hand als beeld",
          "Ze bespreken of er zonden zijn die niet vergeven kunnen worden",
          "Ze bespreken waarom mensen zichzelf vaak het moeilijkst kunnen vergeven",
          "Koos legt het beeld van Christus' lichte juk uit als afsluiting",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Mosiah 24 spreekt de stem des Heren tot Alma en zijn volk, die in knechtschap leefden. Wat belooft Hij hun in vers 14?",
        options: [
          "Dat Hij hun lasten zo zal verlichten dat zij die zelfs niet meer op hun rug kunnen voelen",
          "Dat Hij hen onmiddellijk fysiek zal bevrijden zonder verdere beproeving",
          "Dat Hij hun lasten juist zwaarder zal maken als test",
          "Dat Hij niets aan hun situatie zal veranderen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Mosiah 24:15 versterkte de Heer Alma en zijn broeders zodat zij hun lasten met gemak konden dragen, en onderwierpen zij zich welgemoed en met geduld aan Gods wil.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt de Heer in Mosiah 24:13 tegen het volk in hun ellende?",
        options: [
          "Heft uw hoofd op en weest welgemoed, want Ik ben mij bewust van het verbond dat gij met Mij hebt gesloten",
          "Jullie ellende is verdiend en er komt geen verlossing",
          "Jullie moeten het probleem helemaal zelf oplossen",
          "Er wordt niets tegen hen gezegd",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit Mosiah 24 in de juiste volgorde.",
        items: [
          "De stem des Heren komt tot het volk in hun ellende",
          "Hij belooft zich aan hen te verbinden en hen te bevrijden",
          "Hij verlicht de lasten die op hun schouders zijn gelegd",
          "Zij onderwerpen zich welgemoed en met geduld aan Gods wil",
        ],
      },
    ],
  },
  {
    number: 68,
    title: "Aflevering 68",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk voorbeeld vertelt Raphael over een ingeving die hij eerst had, maar waar hij niet naar luisterde?",
        options: [
          "Zijn eerste gevoel om zijn zoon bij de kerk af te zetten in plaats van bij de sporthal",
          "Zijn gevoel om een andere route naar zijn werk te nemen",
          "Zijn gevoel om een ander cadeau te kopen",
          "Zijn gevoel om een andere baan te zoeken",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael legt het verschil tussen de invloed en de gave van de Heilige Geest uit met het beeld van een deur die eerst maar aan één kant een deurknop heeft, en na doophandoplegging aan beide kanten.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is het licht van Christus, zoals Koos het omschrijft?",
        options: [
          "Een soort intuïtie of moreel kompas dat ieder mens bij de geboorte meekrijgt, ongeacht achtergrond of geloof",
          "Een gave die alleen gedoopte leden van de kerk ontvangen",
          "Een letterlijk zichtbaar licht rondom een persoon",
          "Een gave die alleen profeten ontvangen",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom is de gave van de Heilige Geest volgens Koos toch waardevol, ook al hebben mensen zonder die gave ook het licht van Christus?",
        options: [
          "Omdat je de Heilige Geest nodig hebt om God beter te leren kennen en je relatie met Hem verder te ontwikkelen",
          "Omdat het licht van Christus eigenlijk helemaal niets doet",
          "Omdat alleen de gave van de Heilige Geest je kan beschermen tegen ziekte",
          "Omdat de gave van de Heilige Geest een vervanging is van het licht van Christus",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Raphael vertelt over de ingeving die hij negeerde bij het afzetten van zijn zoon",
          "Ze leggen het licht van Christus uit als moreel kompas voor ieder mens",
          "Raphael legt het verschil tussen de invloed en de gave van de Heilige Geest uit",
          "Ze bespreken waarom de gave van de Heilige Geest toch noodzakelijk is",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Moroni 7 waarschuwt Mormon zijn broeders over het licht waarmee zij oordelen. Welk licht noemt hij dat expliciet, in vers 18?",
        options: [
          "Het licht van Christus",
          "Het licht van de zon",
          "Het licht van de profeten alleen",
          "Er wordt geen licht genoemd",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 7:19 wordt wie zorgvuldig onderzoek doet in het licht van Christus en al het goede aangrijpt zonder het te veroordelen, zeker een kind van Christus.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarvoor waarschuwt Mormon in Moroni 7:18, met betrekking tot het licht van Christus?",
        options: [
          "Om niet verkeerd te oordelen, want met hetzelfde oordeel waarmee je oordeelt, zul je zelf geoordeeld worden",
          "Om nooit meer een keuze te maken",
          "Om het licht van Christus compleet te negeren",
          "Om alleen naar de mening van anderen te luisteren",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Moroni 7 in de juiste volgorde.",
        items: [
          "Gij kent het licht waarmee gij kunt oordelen, namelijk het licht van Christus",
          "Ziet toe dat gij niet verkeerd oordeelt",
          "Doe zorgvuldig onderzoek in het licht van Christus om goed van kwaad te onderscheiden",
          "Wie al het goede aangrijpt zonder het te veroordelen, is zeker een kind van Christus",
        ],
      },
    ],
  },
  {
    number: 67,
    title: "Aflevering 67",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke overtuiging staat centraal in het gesprek van Koos en Raphael in deze aflevering?",
        options: [
          "Dat er maar één ware kerk van Christus is, waaraan Hij rechtstreeks leiding geeft",
          "Dat alle kerken exact gelijkwaardig zijn",
          "Dat kerken helemaal niet meer nodig zijn",
          "Dat Christus meerdere onafhankelijke kerken heeft gesticht om zijn risico te spreiden",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vertelt dat Johannes de Doper, na eerst onthoofd te zijn geweest, als opgestaan hemels boodschapper aan Joseph Smith verscheen om het Aäronische priesterschap te herstellen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk beeld gebruikt Raphael om te verklaren waarom andere kerken ook waarheid bevatten, maar niet het volledige evangelie?",
        options: [
          "Een spiegel van Christus' kerk die in stukken is gevallen, waarbij iedere kerk een eigen stukje waarheid heeft opgeraapt",
          "Een boom waarvan alle takken precies gelijk zijn",
          "Een rivier die in duizend zijstromen is opgesplitst zonder verschil",
          "Een schilderij dat door iedereen identiek wordt nagemaakt",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is de conclusie van Koos over hoe mensen die de \"valse profeten\"-waarschuwing in de schrift verkeerd interpreteren?",
        options: [
          "Dat zij ten onrechte concluderen dat er dus helemaal geen profeten meer zouden mogen bestaan",
          "Dat zij daaruit terecht concluderen dat er geen profeten meer nodig zijn",
          "Dat die waarschuwing nergens in de schriften voorkomt",
          "Dat die waarschuwing alleen op het Oude Testament van toepassing is",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken of Christus meerdere kerken zou kunnen hebben",
          "Koos legt uit hoe de priesterschapssleutels aan Joseph Smith werden hersteld",
          "Raphael gebruikt het beeld van de gebroken spiegel voor waarheid in verschillende kerken",
          "Ze bespreken de waarschuwing voor valse profeten en hoe die verkeerd geïnterpreteerd wordt",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 2 Nephi 28 profeteert Nephi over de staat van de kerken in de laatste dagen. Waardoor zijn hun kerken verdorven geworden, volgens vers 12?",
        options: [
          "Wegens hoogmoed en wegens valse leraren en valse leer",
          "Wegens een gebrek aan financiële middelen",
          "Wegens te weinig kerkgebouwen",
          "Wegens te veel muziek in de diensten",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 2 Nephi 28:14 zijn bijna allen afgedwaald, op enkelen na die de ootmoedige volgelingen van Christus zijn, en zelfs zij dwalen soms omdat zij naar de voorschriften van mensen worden onderricht.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat verwijt Nephi de verdorven kerken in vers 13?",
        options: [
          "Dat zij de armen beroven ter wille van hun fraaie heiligdommen en kledij, en de zachtmoedigen vervolgen",
          "Dat zij te veel aan liefdadigheid doen",
          "Dat zij te weinig aandacht besteden aan gebouwen",
          "Dat zij te bescheiden zijn in hun optreden",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit 2 Nephi 28 in de juiste volgorde.",
        items: [
          "Zij zijn allen van de weg afgeweken en verdorven geworden",
          "Wegens hoogmoed en valse leer zijn hun kerken verdorven",
          "Zij beroven de armen ter wille van hun fraaie heiligdommen",
          "Slechts enkelen blijven ootmoedige volgelingen van Christus",
        ],
      },
    ],
  },
  {
    number: 66,
    title: "Aflevering 66",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke vraag stelt Raphael herhaaldelijk in deze aflevering, over waarom er wereldwijd zo weinig leden zijn?",
        options: [
          "Waarom Hemelse Vader het niet makkelijker of duidelijker maakt voor mensen om het evangelie te herkennen en te accepteren",
          "Waarom er te weinig kerkgebouwen zijn gebouwd",
          "Waarom de kerk geen reclame maakt op televisie",
          "Waarom er geen genoeg zendelingen zijn opgeleid",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos legt uit dat profeten duizenden jaren geleden al voorspelden dat er in de laatste dagen slechts weinigen het evangelie in hun leven zouden aanvaarden.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk voorbeeld gebruikt Raphael om te laten zien dat mensen soms minder vrije keuzes maken dan ze zelf denken?",
        options: [
          "Het voorbeeld van een cavia die door een doolhof met schotten wordt gestuurd, vergelijkbaar met hoe reclame onze keuzes beïnvloedt",
          "Het voorbeeld van een schaakspel tussen twee grootmeesters",
          "Het voorbeeld van een loterij met miljoenen deelnemers",
          "Het voorbeeld van een marathon met duizenden lopers",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe legt Koos het woord 'uitverkoren' uit, zodat het geen negatieve klank krijgt?",
        options: [
          "Dat iedereen die het verlangen heeft om tot Gods kudde te behoren, daarmee ook automatisch uitverkoren is",
          "Dat alleen mensen die in de kerk geboren zijn uitverkoren kunnen zijn",
          "Dat uitverkoren zijn afhangt van iemands afkomst of nationaliteit",
          "Dat niemand ooit echt uitverkoren kan worden",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken de trend dat meer jongeren weer op zoek gaan naar geloof",
          "Raphael vraagt zich af waarom Hemelse Vader het niet makkelijker maakt",
          "Raphael gebruikt het voorbeeld van de cavia in het doolhof over beïnvloede keuzes",
          "Koos legt uit dat het woord 'uitverkoren' voor iedereen met het juiste verlangen geldt",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Mosiah 26 spreekt de Heer tot Alma over zijn volk. Wat zegt Hij in vers 18 over wie zijn naam gewillig draagt?",
        options: [
          "Gezegend is dit volk dat gewillig is zijn naam te dragen, want in zijn naam zullen zij worden geroepen en zij zijn de zijnen",
          "Alleen wie geboren is in een bepaald land kan zijn naam dragen",
          "Niemand kan ooit werkelijk zijn naam dragen",
          "Het dragen van zijn naam is compleet onbelangrijk",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Mosiah 26:23-24 verleent de Heer aan wie tot het einde gelooft een plaats aan zijn rechterhand, en zullen zij die Hem kennen tevoorschijn komen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is de voorwaarde in Mosiah 26:24 om voor eeuwig een plaats aan Gods rechterhand te krijgen?",
        options: [
          "Dat zij in zijn naam geroepen worden en Hem kennen",
          "Dat zij een bepaalde afkomst hebben",
          "Dat zij nooit ergens om hoeven te vragen",
          "Dat zij rijkdom vergaren tijdens hun leven",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Mosiah 26 in de juiste volgorde.",
        items: [
          "Gezegend is het volk dat gewillig is zijn naam te dragen",
          "In zijn naam zullen zij worden geroepen en zij zijn de zijnen",
          "Wie tot het einde gelooft, krijgt een plaats aan zijn rechterhand",
          "Zij die Hem kennen, zullen tevoorschijn komen en voor eeuwig die plaats hebben",
        ],
      },
    ],
  },
  {
    number: 65,
    title: "Aflevering 65",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wie is de gast in deze aflevering, en van welke geloofsgemeenschap is hij lid?",
        options: [
          "Albert, lid van een baptistengemeente",
          "Een lid van dezelfde kerk als Koos en Raphael",
          "Een katholieke priester",
          "Een boeddhistische monnik",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Albert vertelt dat hij op 21-jarige leeftijd zijn leven aan Jezus Christus heeft overgegeven, na jarenlang met zijn oma naar de kerk te zijn gegaan zonder dat het echt tot hem doordrong.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe legt Koos uit wat er volgens hem gebeurt met mensen die nooit de kans hebben gekregen om het evangelie te horen, bijvoorbeeld in landen waar christen zijn gevaarlijk is?",
        options: [
          "Dat zij in het hiernamaals alsnog de gelegenheid krijgen om het evangelie te horen en te aanvaarden",
          "Dat zij automatisch verloren zijn zonder enige kans",
          "Dat zij automatisch worden gered zonder enige eigen keuze",
          "Dat de vraag helemaal niet relevant is",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarover verschillen Koos en Albert van mening met betrekking tot de doop?",
        options: [
          "Albert vindt de doop niet zaligmakend, terwijl Koos gelooft dat er zelfs een plaatsvervangende doop mogelijk is voor wie geen kans kreeg zich te laten dopen",
          "Beiden zijn het volledig oneens over of Jezus wel gedoopt moest worden",
          "Albert gelooft dat de doop de enige weg naar redding is, zonder enige uitzondering",
          "Ze zijn het over alles precies eens",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Albert vertelt zijn bekeringsverhaal en hoe hij zich bevrijd voelde",
          "Ze bespreken het leven na de dood en het paradijs als wachtruimte",
          "Ze bespreken of iedereen een gelijke kans krijgt om het evangelie te horen",
          "Ze bespreken de doop, plaatsvervangende doop en de balans tussen wet en geest",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 29 zegt Alma dat de Heer aan alle naties mensen geeft om zijn woord te verkondigen. Hoe doet Hij dat, volgens vers 8?",
        options: [
          "Van hun eigen natie en taal, alles wat Hij in wijsheid juist acht voor hen om te hebben",
          "Alleen via één enkele, wereldwijd identieke taal",
          "Alleen aan de rijkste volken van de aarde",
          "Hij geeft helemaal niemand de mogelijkheid om zijn woord te verkondigen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 29:8 geeft de Heer raad met wijsheid, volgens hetgeen juist en waar is, aan elk volk op een manier die bij hen past.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat noemt Alma in vers 9 als zijn grootste vreugde?",
        options: [
          "Een werktuig in de handen van God te mogen zijn om zielen tot bekering te brengen",
          "Zijn eigen roem en aanzien onder het volk",
          "Het vergaren van rijkdom",
          "Het krijgen van een hoge politieke positie",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachten uit Alma 29 in de juiste volgorde.",
        items: [
          "De Heer geeft alle naties mensen van hun eigen taal om zijn woord te verkondigen",
          "Hij geeft raad met wijsheid, volgens hetgeen juist en waar is",
          "Alma roemt in wat de Heer hem heeft geboden, als werktuig in Gods handen",
          "Als hij ziet dat velen zich bekeren, wordt zijn ziel met vreugde vervuld",
        ],
      },
    ],
  },
  {
    number: 64,
    title: "Aflevering 64",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk groot nieuws deelt Koos aan het begin van deze aflevering?",
        options: [
          "Dat hij van plan is om dit jaar opnieuw te trouwen",
          "Dat hij een nieuwe baan heeft gevonden",
          "Dat hij gaat verhuizen naar een ander land",
          "Dat hij zijn eerste kleinkind heeft gekregen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos legt uit dat hij zijn eerdere huwelijksverzegeling bewust intact heeft gelaten, omdat hij het verbond van zijn ex-vrouw met haar hemelse vader belangrijk vindt, ook al gaat zij zelf niet meer naar de kerk.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is er nodig, volgens Koos en Raphael, voordat een huwelijksverzegeling in de tempel kan plaatsvinden?",
        options: [
          "Een wettig burgerlijk huwelijk volgens de wetten van het land",
          "Een minimale relatieduur van tien jaar",
          "Toestemming van alle familieleden zonder uitzondering",
          "Een verplichte proefperiode van samenwonen",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vindt Raphael jammer aan hoe de wereld vaak over het huwelijk spreekt?",
        options: [
          "Dat de belofte vaak beperkt wordt tot 'tot de dood ons scheidt', terwijl het huwelijk zoveel meer betekenis kan hebben",
          "Dat er tegenwoordig te veel bruiloftsfeesten worden gegeven",
          "Dat trouwringen te duur zijn geworden",
          "Dat er te weinig aandacht is voor de juridische kant van het huwelijk",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Koos vertelt over zijn plannen om opnieuw te trouwen",
          "Ze bespreken hoe een eerdere huwelijksverzegeling na een scheiding blijft bestaan",
          "Ze bespreken de noodzaak van een burgerlijk huwelijk vóór een tempelverzegeling",
          "Raphael reflecteert op hoe beperkt 'tot de dood ons scheidt' klinkt vergeleken met een eeuwig huwelijk",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Jakob 2 spreekt Jakob het volk toe over het huwelijk. Wat gebiedt de Heer daarover, volgens vers 27?",
        options: [
          "Dat geen enkele man meer dan één vrouw zal hebben, en geen bijvrouwen zal hebben",
          "Dat huwelijken helemaal niet nodig zijn",
          "Dat mannen zoveel vrouwen mogen hebben als ze willen",
          "Dat het huwelijk uitsluitend voor de rijken is weggelegd",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Jakob 2:28 schept de Heer behagen in de kuisheid van vrouwen, en noemt Hij hoererij een gruwel in zijn ogen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt vers 30 over een mogelijke uitzondering op de regel van het huwelijk?",
        options: [
          "Dat de Heer zijn volk zelf zou gebieden als Hij voor zichzelf nageslacht wilde doen opstaan, maar anders moeten zij naar deze dingen luisteren",
          "Dat er nooit onder enige omstandigheid een uitzondering mogelijk is",
          "Dat de uitzondering alleen voor koningen gold",
          "Dat er geen enkele reden ooit gegeven wordt",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Jakob 2 in de juiste volgorde.",
        items: [
          "Jakob roept het volk op te luisteren naar het woord des Heren",
          "Geen enkele man zal meer dan één vrouw hebben",
          "De Heer schept behagen in de kuisheid der vrouwen",
          "Als de Heer voor zichzelf nageslacht wil doen opstaan, zal Hij zijn volk apart gebieden",
        ],
      },
    ],
  },
  {
    number: 63,
    title: "Aflevering 63",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wie is de gast in deze aflevering, die veel vertelt over de wet van de aantrekkingskracht en haar eigen ervaringen met gebed?",
        options: [
          "Shamantha",
          "Albert",
          "Renco",
          "Dick",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Shamantha vertelt over hoe zij een fietskar precies op tijd en voor een laag bedrag kreeg, nadat ze er specifiek voor gebeden en om gevraagd had, en dit zag als een duidelijk antwoord van Hemelse Vader.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vraagt Raphael zich af over het verband tussen geloof en het beantwoorden van gebeden?",
        options: [
          "Waarom je zou moeten geloven dat je iets krijgt, terwijl Hemelse Vader toch elk gebed beantwoordt, ongeacht de mate van geloof",
          "Of gebeden wel echt bestaan",
          "Of je alleen in de tempel mag bidden",
          "Of gebeden alleen in het Engels effectief zijn",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke universele wet noemen Koos en Raphael, die ook buiten de kerk terug te vinden is, zoals in boeken over financiële vrijheid?",
        options: [
          "Het geven van tien procent van je inkomen, wat overeenkomt met het principe van de tiende",
          "De wet op het verkeer",
          "De zwaartekrachtwet",
          "De wet van vraag en aanbod",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken de wet van de aantrekkingskracht en universele wetmatigheden",
          "Shamantha vertelt haar verhalen over de fietskar en de woning",
          "Ze bespreken de vijf wetten die in de tempel worden onderwezen",
          "Ze bespreken het woord van wijsheid en verslavende middelen zoals alcohol en koffie",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Moroni 7 spreekt Mormon over hoop. Wat zegt hij in vers 40 over de relatie tussen hoop en geloof?",
        options: [
          "Dat je geen geloof kunt verwerven, tenzij je hoop hebt",
          "Dat geloof en hoop helemaal niets met elkaar te maken hebben",
          "Dat hoop alleen voor kinderen is weggelegd",
          "Dat geloof altijd voorafgaat aan hoop, nooit andersom",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 7:41 mogen wij hopen tot het eeuwige leven te worden opgewekt, dankzij de verzoening van Christus en de kracht van zijn opstanding.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt Moroni 7:42 over iemand die geloof heeft?",
        options: [
          "Die moet ook wel hoop hebben, want zonder geloof kan er geen hoop zijn",
          "Die heeft nooit hoop nodig",
          "Die kan zonder enige hoop verder leven",
          "Geloof en hoop sluiten elkaar juist uit",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken uit Moroni 7 in de juiste volgorde.",
        items: [
          "Hoe kun je geloof verwerven, tenzij je hoop hebt?",
          "Je mag hopen tot het eeuwige leven te worden opgewekt door de verzoening van Christus",
          "Als iemand geloof heeft, moet hij ook wel hoop hebben",
          "Zonder zachtmoedigheid en nederigheid zijn geloof en hoop tevergeefs",
        ],
      },
    ],
  },
  {
    number: 62,
    title: "Aflevering 62",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk actueel onderwerp bespreken Koos en Raphael, over regels voor kinderen en telefoons?",
        options: [
          "Plannen om schermtijd en social media voor jonge kinderen wettelijk te beperken",
          "Nieuwe belastingregels voor techbedrijven",
          "Een verbod op alle smartphones voor volwassenen",
          "Nieuwe snelheidslimieten op de snelweg",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael worstelt met het feit dat de kerk platforms zoals Facebook gebruikt om het evangelie te verspreiden, terwijl hij het bedrijf erachter zelf als problematisch beschouwt.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk verhaal uit het Boek van Mormon haalt Koos aan om te illustreren dat God soms iets vreselijks toelaat binnen zijn grotere plan?",
        options: [
          "Het verhaal van de gelovigen die in Ammonihah levend werden verbrand, terwijl Alma en Amulek moesten toekijken",
          "Het verhaal van de doop van Alma bij de wateren van Mormon",
          "Het verhaal van de bekering van Alma de Jongere",
          "Het verhaal van de gouden platen",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar komen Koos en Raphael op uit als het gaat om het gebruiken van 'slechte' platforms voor een goed doel?",
        options: [
          "Dat je in gebed moet blijven en moet luisteren naar de Geest om te bepalen wat op dat moment het juiste is om te doen",
          "Dat het gebruik van zulke platforms altijd verboden zou moeten zijn",
          "Dat het doel de middelen altijd zonder enige twijfel heiligt",
          "Dat de kerk nooit van dit soort platforms gebruik zou moeten maken",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken plannen om schermtijd en social media voor kinderen te beperken",
          "Raphael worstelt met het gebruik van Facebook door de kerk",
          "Koos vertelt het verhaal van de verbranding van de gelovigen in Ammonihah",
          "Ze concluderen dat gebed en de Geest de weg zijn om zulke keuzes te maken",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 14 worden gelovige vrouwen en kinderen in Ammonihah in het vuur geworpen. Wat wil Amulek doen, volgens vers 10?",
        options: [
          "Zijn handen uitstrekken en de macht van God gebruiken om hen uit de vlammen te redden",
          "Onmiddellijk wegvluchten uit de stad",
          "Zich bij de menigte aansluiten",
          "Niets doen en zwijgend toekijken zonder enige emotie",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 14:11 weerhoudt de Geest Alma ervan om in te grijpen, omdat de Heer hen in heerlijkheid tot Zich opneemt en dit toelaat opdat zijn oordelen over het volk rechtvaardig zullen zijn.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat werd er, naast de mensen zelf, ook in het vuur geworpen in Alma 14:8?",
        options: [
          "Hun kronieken die de heilige Schriften bevatten",
          "Al hun voedselvoorraden",
          "Hun kledingstukken",
          "Al hun gereedschap",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit Alma 14 in de juiste volgorde.",
        items: [
          "Het volk drijft de gelovige vrouwen en kinderen bijeen en werpt hen in het vuur",
          "Ook hun heilige geschriften worden in het vuur geworpen",
          "Alma en Amulek worden gedwongen toe te kijken",
          "Alma weerhoudt Amulek ervan in te grijpen, omdat de Heer dit toelaat voor zijn rechtvaardige oordeel",
        ],
      },
    ],
  },
];
