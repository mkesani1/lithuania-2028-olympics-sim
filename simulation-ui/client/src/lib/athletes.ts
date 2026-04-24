// AUTO-GENERATED from seeds/athlete_roster.json. Do not edit by hand.
export interface Athlete {
  id: string;
  name: string;
  tier: "Senior" | "Prospect";
  ageIn2028: number;
  sport: string;
  event: string;
  worldRank: number | null;
  qualStatus: string;
  form: string;
  basePriorPct: number;
  sources: string[];
  notes: string;
}

export const athletes: Athlete[] = [
  {
    "id": "alekna-m",
    "name": "Mykolas Alekna",
    "tier": "Senior",
    "ageIn2028": 25,
    "sport": "Athletics",
    "event": "Discus Throw (M)",
    "worldRank": 1,
    "qualStatus": "Lock",
    "form": "WR Holder",
    "basePriorPct": 78,
    "sources": [
      "https://worldathletics.org/athletes/lithuania/mykolas-alekna-14841124",
      "https://en.wikipedia.org/wiki/Mykolas_Alekna"
    ],
    "notes": "Men's discus world record holder (75.56m). 2024 Olympic silver."
  },
  {
    "id": "alekna-ma",
    "name": "Martynas Alekna",
    "tier": "Senior",
    "ageIn2028": 29,
    "sport": "Athletics",
    "event": "Discus Throw (M)",
    "worldRank": 14,
    "qualStatus": "Likely",
    "form": "Stable",
    "basePriorPct": 12,
    "sources": [
      "https://worldathletics.org/athletes/lithuania/martynas-alekna-14751795"
    ],
    "notes": "Mykolas's older brother. World #14 in discus. Top-8 finalist candidate."
  },
  {
    "id": "senkute",
    "name": "Viktorija Senkutė",
    "tier": "Senior",
    "ageIn2028": 30,
    "sport": "Rowing",
    "event": "Women's Single Sculls (W1x)",
    "worldRank": 4,
    "qualStatus": "Lock",
    "form": "Peak",
    "basePriorPct": 42,
    "sources": [
      "https://en.wikipedia.org/wiki/2025_World_Rowing_Championships_%E2%80%93_Women%27s_single_sculls",
      "https://worldrowing.com/athlete/viktorija-senkute?id=44621"
    ],
    "notes": "Paris 2024 bronze. 4th at 2025 Worlds Final A. Fastest heat time."
  },
  {
    "id": "3x3-men",
    "name": "3x3 Men (Pukelis, Džiaugys, Vingelis, Vaitkus)",
    "tier": "Senior",
    "ageIn2028": 28,
    "sport": "3x3 Basketball",
    "event": "Men's 3x3",
    "worldRank": 2,
    "qualStatus": "Likely",
    "form": "Elite",
    "basePriorPct": 48,
    "sources": [
      "https://www.olympics.com/en/news/fiba-24-month-3x3-federation-ranking-2028"
    ],
    "notes": "2025 3x3 Europe Cup + U23 World Cup champions. Qualification via FIBA 24-month ranking (Dec 2025 - Dec 2027)."
  },
  {
    "id": "3x3-women",
    "name": "3x3 Women (LTU roster)",
    "tier": "Senior",
    "ageIn2028": 27,
    "sport": "3x3 Basketball",
    "event": "Women's 3x3",
    "worldRank": 12,
    "qualStatus": "Possible",
    "form": "Developing",
    "basePriorPct": 8,
    "sources": [
      "https://en.wikipedia.org/wiki/2026_FIBA_3x3_World_Cup_%E2%80%93_Qualifier"
    ],
    "notes": "Qualified for 2026 FIBA 3x3 World Cup via Singapore qualifier (silver)."
  },
  {
    "id": "meilutyte",
    "name": "Rūta Meilutytė",
    "tier": "Senior",
    "ageIn2028": 31,
    "sport": "Swimming",
    "event": "50m Breaststroke (W)",
    "worldRank": 3,
    "qualStatus": "Lock",
    "form": "Elite",
    "basePriorPct": 45,
    "sources": [
      "https://www.swimmingworldmagazine.com/news/ruta-meilutyte-danas-rapsys-lead-lithuania-team-to-world-championships/"
    ],
    "notes": "LCM 50m breast WR holder (29.16). 2023 World Champion. 50m breast added to LA28 program."
  },
  {
    "id": "teterevkova",
    "name": "Kotryna Teterevkova",
    "tier": "Senior",
    "ageIn2028": 26,
    "sport": "Swimming",
    "event": "100m Breaststroke (W)",
    "worldRank": 8,
    "qualStatus": "Likely",
    "form": "Rising",
    "basePriorPct": 12,
    "sources": [
      "https://swimswam.com/results-of-the-2026-baltic-states-championships/"
    ],
    "notes": "European medallist. 2026 Baltic States 100m breast gold."
  },
  {
    "id": "rapsys",
    "name": "Danas Rapšys",
    "tier": "Senior",
    "ageIn2028": 33,
    "sport": "Swimming",
    "event": "200m Freestyle (M)",
    "worldRank": 7,
    "qualStatus": "Likely",
    "form": "Veteran",
    "basePriorPct": 15,
    "sources": [
      "https://www.swimmingworldmagazine.com/news/ruta-meilutyte-danas-rapsys-lead-lithuania-team-to-world-championships/"
    ],
    "notes": "2024 Doha Worlds silver. 5th in Paris. Dense field led by Hwang, Märtens, Popovici."
  },
  {
    "id": "kalaminskas",
    "name": "Jonas Kalaminskas",
    "tier": "Senior",
    "ageIn2028": 28,
    "sport": "Modern Pentathlon",
    "event": "Men's Pentathlon",
    "worldRank": 1,
    "qualStatus": "Lock",
    "form": "World #1",
    "basePriorPct": 35,
    "sources": [
      "https://www.uipmworld.org/event/uipm-2025-pentathlon-world-championships"
    ],
    "notes": "2025 World Championships GOLD (Kaunas). Obstacle-format champion."
  },
  {
    "id": "vagnorius",
    "name": "Paulius Vagnorius",
    "tier": "Senior",
    "ageIn2028": 27,
    "sport": "Modern Pentathlon",
    "event": "Men's Pentathlon",
    "worldRank": 19,
    "qualStatus": "Possible",
    "form": "Developing",
    "basePriorPct": 5,
    "sources": [
      "https://www.uipmworld.org/event/uipm-2025-pentathlon-world-championships"
    ],
    "notes": "19th at 2025 Worlds. Secondary qualifier."
  },
  {
    "id": "jevensaper",
    "name": "Danielius Jevensaper",
    "tier": "Senior",
    "ageIn2028": 26,
    "sport": "Modern Pentathlon",
    "event": "Men's Pentathlon",
    "worldRank": 21,
    "qualStatus": "Possible",
    "form": "Developing",
    "basePriorPct": 4,
    "sources": [
      "https://www.uipmworld.org/event/uipm-2025-pentathlon-world-championships"
    ],
    "notes": "21st at 2025 Worlds Kaunas."
  },
  {
    "id": "zustautas",
    "name": "Henrikas Žustautas & Vadim Korobov",
    "tier": "Senior",
    "ageIn2028": 30,
    "sport": "Canoe Sprint",
    "event": "Men's C-2 500m",
    "worldRank": 6,
    "qualStatus": "Likely",
    "form": "Final A",
    "basePriorPct": 14,
    "sources": [
      "https://en.wikipedia.org/wiki/2025_ICF_Canoe_Sprint_World_Championships_%E2%80%93_Men%27s_C-2_500_metres"
    ],
    "notes": "6th in Final A at 2025 Worlds Milano (1:41.60)."
  },
  {
    "id": "benkunskas",
    "name": "Edgaras Benkunskas",
    "tier": "Senior",
    "ageIn2028": 29,
    "sport": "Athletics",
    "event": "Decathlon (M)",
    "worldRank": 42,
    "qualStatus": "Borderline",
    "form": "Consistent",
    "basePriorPct": 2,
    "sources": [
      "https://worldathletics.org/world-rankings/decathlon/men?regionType=world&page=1&rankDate=2025-12-30"
    ],
    "notes": "World #42 decathlete. Needs jump to make Olympic final."
  },
  {
    "id": "dudenaite",
    "name": "Miglė Julija Dūdėnaitė",
    "tier": "Senior",
    "ageIn2028": 27,
    "sport": "Judo",
    "event": "-78 kg (W)",
    "worldRank": 20,
    "qualStatus": "Likely",
    "form": "Top-20",
    "basePriorPct": 6,
    "sources": [
      "https://www.ijf.org/country/ltu"
    ],
    "notes": "Lithuania's highest-ranked judoka (#20)."
  },
  {
    "id": "mikutis",
    "name": "Aivaras Mikutis",
    "tier": "Senior",
    "ageIn2028": 26,
    "sport": "Cycling",
    "event": "Men's Road + ITT",
    "worldRank": 774,
    "qualStatus": "Possible",
    "form": "Pro Tour (Tudor)",
    "basePriorPct": 1,
    "sources": [
      "https://www.cyclingranking.com/riders/2025/LTU",
      "https://cyclingflash.com/race/national-road-championships-lithuania-tt-2025/result"
    ],
    "notes": "Lithuania's top cyclist, rides for Tudor Pro Cycling. Olympic qualification realistic but medal extremely unlikely."
  },
  {
    "id": "boxer-tbd",
    "name": "LTU Boxing Qualifier (TBD)",
    "tier": "Senior",
    "ageIn2028": 27,
    "sport": "Boxing",
    "event": "TBD",
    "worldRank": null,
    "qualStatus": "Borderline",
    "form": "Nation #87 IBA",
    "basePriorPct": 3,
    "sources": [
      "https://setopen.sportdata.org/ibaranking/ranking_main_country.php"
    ],
    "notes": "Lithuania ranked #87 globally in IBA country ranking (1650 pts). No standout individual."
  },
  {
    "id": "wrestler-tbd",
    "name": "LTU Wrestling Qualifier (TBD)",
    "tier": "Senior",
    "ageIn2028": 27,
    "sport": "Wrestling",
    "event": "Greco-Roman TBD",
    "worldRank": null,
    "qualStatus": "Possible",
    "form": "Represented at 2025 Worlds",
    "basePriorPct": 5,
    "sources": [
      "https://uww.org/event/senior-world-championships/team-rankings"
    ],
    "notes": "Represented at 2025 Worlds, no podium. Russia/Belarus ban helps slot availability."
  },
  {
    "id": "genys",
    "name": "Majus Genys",
    "tier": "Prospect",
    "ageIn2028": 19,
    "sport": "Judo",
    "event": "-90 kg (M)",
    "worldRank": null,
    "qualStatus": "Development",
    "form": "EYOF + Cadet Euro double gold",
    "basePriorPct": 8,
    "sources": [
      "https://www.ijf.org/country/ltu/results?year=2025"
    ],
    "notes": "GOLD at EYOF Skopje 2025 AND GOLD at Cadet European Championships Skopje 2025 (double gold). Highest-ceiling prospect — realistic 2028 senior qualifier, dark-horse bronze."
  },
  {
    "id": "bieliauskas",
    "name": "Aleksas Bieliauskas",
    "tier": "Prospect",
    "ageIn2028": 20,
    "sport": "Basketball",
    "event": "Men's 5x5 (if qualified)",
    "worldRank": null,
    "qualStatus": "Development",
    "form": "FIBA U20 EuroBasket 2025 silver",
    "basePriorPct": 4,
    "sources": [
      "https://www.eurohoops.net/en/eurobasket/1849717/eurobasket-u20-2025-final-standings-mvp/"
    ],
    "notes": "17 pts / 12 reb double-double in U20 Euro final. Rotation piece if Lithuania 5x5 qualifies alongside NBA-tier Jakučionis/Buzelis/Rubštavičius."
  },
  {
    "id": "miklyciute",
    "name": "Rugilė Miklyčiūtė",
    "tier": "Prospect",
    "ageIn2028": 23,
    "sport": "Athletics",
    "event": "Pole Vault (W)",
    "worldRank": null,
    "qualStatus": "Development",
    "form": "European U23 silver, NR 4.35m",
    "basePriorPct": 3,
    "sources": [
      "https://en.wikipedia.org/wiki/2025_European_Athletics_U23_Championships"
    ],
    "notes": "Silver at 2025 European U23 Championships. Lithuanian NR 4.35m. Needs ~4.70m for LA28; finalist candidate on current trajectory."
  },
  {
    "id": "babaicenko",
    "name": "Tajus Babaičenko",
    "tier": "Prospect",
    "ageIn2028": 19,
    "sport": "Judo",
    "event": "-81 kg (M)",
    "worldRank": null,
    "qualStatus": "Development",
    "form": "EYOF gold + Cadet World bronze",
    "basePriorPct": 5,
    "sources": [
      "https://www.ijf.org/country/ltu/results?year=2025"
    ],
    "notes": "GOLD at EYOF Skopje 2025 + Bronze at Cadet World Championships Sofia 2025. Senior World Cup circuit entry 2026–27."
  },
  {
    "id": "galvydyte",
    "name": "Gabija Galvydytė",
    "tier": "Prospect",
    "ageIn2028": 23,
    "sport": "Athletics",
    "event": "800m (W)",
    "worldRank": null,
    "qualStatus": "Development",
    "form": "PB 1:57.96, World Champs SF",
    "basePriorPct": 3,
    "sources": [
      "https://worldathletics.org/competitions/world-athletics-championships/tokyo25"
    ],
    "notes": "PB 1:57.96 at 2025 Worlds Tokyo. 8th in semifinals. ~0.3s off LA28 qualifying standard."
  },
  {
    "id": "kuciar",
    "name": "Varvara Kučiar",
    "tier": "Prospect",
    "ageIn2028": 22,
    "sport": "Judo",
    "event": "-57 kg (W)",
    "worldRank": null,
    "qualStatus": "Development",
    "form": "European Junior bronze + Paks Cup gold",
    "basePriorPct": 3,
    "sources": [
      "https://www.ijf.org/country/ltu/results?year=2025"
    ],
    "notes": "Bronze at European Junior Championships 2025 + Gold at Paks Junior European Cup. Transitioning to senior circuit 2026."
  },
  {
    "id": "juskeviciute",
    "name": "Beatrice Juškevičiūtė",
    "tier": "Prospect",
    "ageIn2028": 23,
    "sport": "Athletics",
    "event": "Heptathlon (W)",
    "worldRank": null,
    "qualStatus": "Development",
    "form": "6151 pts, 14th World Champs",
    "basePriorPct": 2,
    "sources": [
      "https://worldathletics.org/competitions/world-athletics-championships/tokyo25"
    ],
    "notes": "6,151 pts, 14th at 2025 World Championships Tokyo. Needs ~6,400+ pts for LA28 top-8."
  },
  {
    "id": "vilkas",
    "name": "Daumantas Vilkas",
    "tier": "Prospect",
    "ageIn2028": 20,
    "sport": "Boxing",
    "event": "Youth (TBD senior weight)",
    "worldRank": null,
    "qualStatus": "Development",
    "form": "European Youth silver",
    "basePriorPct": 3,
    "sources": [
      "https://www.euboxing.org/"
    ],
    "notes": "Silver at European Youth Boxing Championship Ostrava 2025. Senior elite transition 2026–27."
  },
  {
    "id": "polikevicius",
    "name": "Simas Polikevičius",
    "tier": "Prospect",
    "ageIn2028": 22,
    "sport": "Judo",
    "event": "-66 kg (M)",
    "worldRank": null,
    "qualStatus": "Development",
    "form": "European Junior bronze",
    "basePriorPct": 2,
    "sources": [
      "https://www.ijf.org/country/ltu/results?year=2025"
    ],
    "notes": "Bronze at European Judo Championships Juniors Bratislava 2025."
  },
  {
    "id": "beniusyte",
    "name": "Aurėja Beniušytė",
    "tier": "Prospect",
    "ageIn2028": 24,
    "sport": "Athletics",
    "event": "Triple Jump (W)",
    "worldRank": null,
    "qualStatus": "Development",
    "form": "LTU indoor champion 2025",
    "basePriorPct": 2,
    "sources": [
      "https://worldathletics.org/"
    ],
    "notes": "Lithuanian national indoor champion 2025, leading LTU triple jumper. Needs ~14.35m for LA28 standard."
  }
];
