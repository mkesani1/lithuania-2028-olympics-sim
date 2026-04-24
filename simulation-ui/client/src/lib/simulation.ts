import { athletes, type Athlete } from "./athletes";

export type { Athlete };

export interface SimParams {
  athleteReadiness: number;
  governmentFunding: number;
  coachingQuality: number;
  russiaBan: boolean;
  aleknaForm: string;
  pentathalonTalent: boolean;
  basketballQualified: boolean;
  rowingDepth: number;
  hostEffect: number;
  simulationRounds: number;
  competitiveFieldStrength: number; // 1-10: how strong rivals are (10 = toughest year ever)
  socialMediaEffect: number; // -5 to +5: net social media impact (negative = pressure/toxicity, positive = boost/endorsement motivation)
}

export const defaultParams: SimParams = {
  athleteReadiness: 75,
  governmentFunding: 18,
  coachingQuality: 7,
  russiaBan: true,
  aleknaForm: "Strong",
  pentathalonTalent: false,
  basketballQualified: true,
  rowingDepth: 3,
  hostEffect: 3,
  simulationRounds: 100,
  competitiveFieldStrength: 7, // 2025 discus field is historically deep (5 men 70m+)
  socialMediaEffect: 1, // Slight net positive: Lithuania athletes have modest social profiles, less toxic exposure
};

const INDIVIDUAL_SKILL_SPORTS = new Set([
  "Athletics",
  "Rowing",
  "Modern Pentathlon",
  "Swimming",
  "Canoe",
  "Judo",
  "Wrestling",
  "Boxing",
  "Shooting",
]);

export interface AthleteMedalPrediction extends Athlete {
  medalProb: number;
  predictedMedal: "Gold" | "Silver" | "Bronze" | "None";
  rawScore: number;
}

function predictedMedalFor(prob: number): "Gold" | "Silver" | "Bronze" | "None" {
  if (prob >= 65) return "Gold";
  if (prob >= 40) return "Silver";
  if (prob >= 20) return "Bronze";
  return "None";
}

export function calculateAthleteRankings(params: SimParams): AthleteMedalPrediction[] {
  const fieldModifier = 1 - (params.competitiveFieldStrength - 5) * 0.04;
  const socialModifier = 1 + params.socialMediaEffect * 0.015;
  const readinessModifier = 0.5 + (params.athleteReadiness / 100) * 0.5;
  const coachModifier = 0.6 + (params.coachingQuality / 10) * 0.4;

  return athletes.map<AthleteMedalPrediction>((a) => {
    let score = a.basePriorPct;

    score *= readinessModifier;

    if (INDIVIDUAL_SKILL_SPORTS.has(a.sport)) {
      score *= coachModifier;
    }

    score *= fieldModifier;
    score *= socialModifier;

    if (a.id === "alekna-m") {
      if (params.aleknaForm === "Injured") {
        score = 7;
      } else if (params.aleknaForm === "World Record Form") {
        score *= 1.1;
      } else if (params.aleknaForm === "Average") {
        score *= 0.65;
      }
    }

    if (a.sport === "Wrestling" && !params.russiaBan) {
      score *= 0.5;
    }

    if (a.sport === "3x3 Basketball" && !params.basketballQualified && a.id === "3x3-men") {
      score = 0;
    }

    const rawScore = score;
    const medalProb = Math.round(Math.max(0, Math.min(99, score)));

    return {
      ...a,
      medalProb,
      predictedMedal: predictedMedalFor(medalProb),
      rawScore,
    };
  });
}

export function calculateMedals(params: SimParams): number {
  const rankings = calculateAthleteRankings(params);
  const expected = rankings.reduce((sum, a) => sum + a.medalProb / 100, 0);

  let medals = expected;

  // National-level modifiers (folded in as global adjustments)
  if (params.governmentFunding < 15) {
    medals -= (15 - params.governmentFunding) * 0.06;
  } else {
    medals += Math.log2(Math.max(1, params.governmentFunding - 14)) * 0.2;
  }

  medals -= params.hostEffect * 0.05;

  return Math.round(Math.max(0, Math.min(12, medals)));
}

export function calculateConfidenceInterval(predicted: number): [number, number] {
  const low = Math.max(0, predicted - 2);
  const high = Math.min(10, predicted + 3);
  return [low, high];
}

export interface SportPrediction {
  sport: string;
  icon: string;
  medalProb: number;
  predictedMedal: "Gold" | "Silver" | "Bronze" | "None";
  athlete: string;
}

/**
 * @deprecated Use calculateAthleteRankings. Retained only for the report page's
 * hardcoded sport indices (discus, pentathlon, rowing, 3x3). Aggregates athletes
 * by sport using max medalProb as the sport's representative.
 */
export function calculateSportPredictions(params: SimParams): SportPrediction[] {
  const rankings = calculateAthleteRankings(params);
  const bestBy = (predicate: (a: AthleteMedalPrediction) => boolean): AthleteMedalPrediction | undefined =>
    rankings.filter(predicate).sort((a, b) => b.medalProb - a.medalProb)[0];

  const toPrediction = (
    sport: string,
    icon: string,
    a: AthleteMedalPrediction | undefined,
    fallbackName: string,
  ): SportPrediction => ({
    sport,
    icon,
    medalProb: a?.medalProb ?? 0,
    predictedMedal: a?.predictedMedal ?? "None",
    athlete: a?.name ?? fallbackName,
  });

  return [
    toPrediction("Discus Throw", "🥏", bestBy((a) => a.sport === "Athletics"), "No Athletics Contender"),
    toPrediction("Modern Pentathlon", "🤺", bestBy((a) => a.sport === "Modern Pentathlon"), "No Pentathlete"),
    toPrediction("Rowing", "🚣", bestBy((a) => a.sport === "Rowing"), "No Rower"),
    toPrediction("3x3 Basketball", "🏀", bestBy((a) => a.sport === "3x3 Basketball"), "No Team"),
    toPrediction("Swimming", "🏊", bestBy((a) => a.sport === "Swimming"), "No Swimmer"),
    toPrediction("Wrestling", "🤼", bestBy((a) => a.sport === "Wrestling"), "No Wrestler"),
    toPrediction("Canoeing", "🛶", bestBy((a) => a.sport === "Canoe"), "No Canoer"),
    toPrediction("Boxing", "🥊", bestBy((a) => a.sport === "Boxing"), "No Boxer"),
  ];
}

export const historicalData = [
  { year: "1992", gold: 1, silver: 0, bronze: 1, total: 2 },
  { year: "1996", gold: 0, silver: 0, bronze: 1, total: 1 },
  { year: "2000", gold: 2, silver: 0, bronze: 3, total: 5 },
  { year: "2004", gold: 1, silver: 2, bronze: 0, total: 3 },
  { year: "2008", gold: 0, silver: 3, bronze: 2, total: 5 },
  { year: "2012", gold: 2, silver: 0, bronze: 3, total: 5 },
  { year: "2016", gold: 0, silver: 1, bronze: 3, total: 4 },
  { year: "2020", gold: 0, silver: 1, bronze: 0, total: 1 },
  { year: "2024", gold: 0, silver: 2, bronze: 2, total: 4 },
];

export interface SimulationMessage {
  id: number;
  agentName: string;
  faction: string;
  message: string;
  round: number;
  sentiment: number;
}

const simulationDialogues: Record<string, string[]> = {
  "Medal Optimists": [
    "Alekna's training data shows he's peaking at exactly the right time. This could be a 2+ gold Games for us.",
    "The 3x3 basketball squad has improved dramatically since Paris. I'm seeing silver-level chemistry.",
    "Lithuania won the 2025 3x3 Europe Cup AND the U23 World Cup — they're the team to beat going into LA.",
    "Alekna's social media following is growing his endorsement portfolio — that financial stability helps focus.",
    "Senkutė qualified fastest in her heat at the 2025 World Rowing Championships — she's peaking perfectly.",
    "Government funding increase announced — this changes everything for our rowing program.",
    "Senkutė's split times in training are faster than her Paris bronze performance. She's medal-ready.",
    "The coaching infrastructure from the Alekna family ecosystem is unmatched for discus. Gold is almost certain.",
    "If we get 3x3 qualified and pentathlon talent emerges, we're looking at 5+ medals easily.",
    "Lithuania has historically outperformed expectations. Our per-capita medal efficiency is world-class.",
  ],
  "Skeptics": [
    "Let's be realistic — population of 2.8 million limits our depth. One injury derails everything.",
    "The swimming pipeline is empty since Meilutytė retired. That's a whole discipline gone.",
    "Doping scrutiny is increasing. Weightlifting results are unreliable for any nation.",
    "Čeh and Ståhl are both capable of beating Alekna on any given day. Discus gold isn't guaranteed.",
    "The 2025 season showed 5 men throwing 70m+ in one meet — the deepest discus field in history.",
    "Matthew Denny threw 74.78m in 2025 — just 0.78m off Alekna's world record. The field is closing in.",
    "Social media pressure during Olympics is crushing — 72% of elite athletes report heightened anxiety under scrutiny.",
    "809 abusive posts targeted athletes during Paris 2024 alone. That toxic environment degrades performance.",
    "The host country effect will disproportionately hurt small nations. US gains medals we'd otherwise contest.",
    "New pentathlon format introduces massive variance. Our athletes haven't adapted yet.",
    "Historical average is 3.33 medals. Expecting more than 4 ignores regression to the mean.",
  ],
  "Realists": [
    "Base case is 3-4 medals. Alekna is near-certain, 3x3 is probable, rowing is a coin flip.",
    "Social media is a double-edged sword — endorsement income stabilizes athletes financially, but toxic comments can cause choking under pressure.",
    "The competitive field matters enormously: in weak years Lithuania gets 5 medals, in strong years just 1-2.",
    "Alekna's 75.56m world record gives him a 3m+ margin over most rivals, but Denny showed the gap is narrowing.",
    "The Russia/Belarus ban opens 0.5 additional medal slots across our disciplines, statistically.",
    "Coaching quality matters most for small nations. The star coach effect adds 12-15% to medal counts.",
    "LA climate suits discus throwers but challenges our endurance athletes. Net effect is neutral.",
    "The new pentathlon format could help or hurt us equally. Too much uncertainty to call it.",
    "Our funding trajectory needs to reach €25M+ for meaningful impact on 2028 results.",
    "Data shows Lithuania medals every Olympics. The floor is 1, but 3-4 is most likely.",
  ],
  "Wildcards": [
    "What if a 17-year-old Lithuanian swimmer has a breakout season? It happened with Meilutytė.",
    "A single viral social media moment — like Ilona Maher's 5M followers — could transform Lithuanian Olympic funding overnight.",
    "3x3 basketball has the youngest, most social-media-savvy audience. Lithuanian players could become huge online.",
    "Russia could be re-admitted. That single change would drop Lithuania by 1 medal on average.",
    "What about a new sport addition? Lithuania has untapped potential in climbing and skateboarding.",
    "Injury during warm-up. Equipment malfunction. Judge error. These are the unknowns we can't model.",
    "The LA time zone shift could actually benefit Lithuanian athletes who train in European evening hours.",
    "Fan energy at 3x3 basketball could provide a legitimate 2-3% performance boost. Don't dismiss it.",
  ],
};

export function generateSimulationMessages(params: SimParams, rounds: number): SimulationMessage[] {
  const messages: SimulationMessage[] = [];
  const factions = ["Medal Optimists", "Skeptics", "Realists", "Wildcards"];
  let id = 0;

  const agentNames: Record<string, string[]> = {
    "Medal Optimists": ["Mykolas Alekna", "Domantas Užkuraitis", "Jonas Kazlauskas", "Artūras Zuokas", "Tomas Pukelis", "Paulius Motiejūnas"],
    "Skeptics": ["Aurimas Didžbalis", "Daniel Ståhl", "Rūta Meilutytė", "Dr. Sarah Chen"],
    "Realists": ["Laura Asadauskaitė", "Daina Gudzinevičiūtė", "Dr. Rasa Kreivėnaitė", "Agnė Sereikaitė", "Prof. Ian McMaster", "Simona Krupeckaitė"],
    "Wildcards": ["Kristjan Čeh", "Viktor Kovalev", "Mindaugas Griškonis"],
  };

  for (let round = 1; round <= Math.min(rounds, 50); round++) {
    const numMessages = Math.floor(Math.random() * 3) + 1;
    for (let m = 0; m < numMessages; m++) {
      const faction = factions[Math.floor(Math.random() * factions.length)];
      const names = agentNames[faction];
      const dialogues = simulationDialogues[faction];
      const agentName = names[Math.floor(Math.random() * names.length)];
      const message = dialogues[Math.floor(Math.random() * dialogues.length)];
      const sentiment = faction === "Medal Optimists" ? 0.5 + Math.random() * 0.5
        : faction === "Skeptics" ? -0.5 - Math.random() * 0.5
        : faction === "Wildcards" ? (Math.random() - 0.5) * 2
        : (Math.random() - 0.3) * 0.6;

      messages.push({ id: id++, agentName, faction, message, round, sentiment });
    }
  }
  return messages;
}
