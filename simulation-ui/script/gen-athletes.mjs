import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rosterPath = resolve(__dirname, "../../seeds/athlete_roster.json");
const outPath = resolve(__dirname, "../client/src/lib/athletes.ts");

const data = JSON.parse(readFileSync(rosterPath, "utf8"));
const roster = data.roster;

const header = `// AUTO-GENERATED from seeds/athlete_roster.json. Do not edit by hand.
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

export const athletes: Athlete[] = ${JSON.stringify(roster, null, 2)};
`;

writeFileSync(outPath, header);
console.log(`Wrote ${roster.length} athletes to ${outPath}`);
