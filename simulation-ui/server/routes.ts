import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAgentSchema, insertSimulationLogSchema, insertSimulationParamsSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Agents
  app.get("/api/agents", async (_req, res) => {
    const allAgents = await storage.getAgents();
    res.json(allAgents);
  });

  app.post("/api/agents", async (req, res) => {
    const parsed = insertAgentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const agent = await storage.createAgent(parsed.data);
    res.json(agent);
  });

  // Simulation Logs
  app.get("/api/simulation-logs", async (_req, res) => {
    const logs = await storage.getSimulationLogs();
    res.json(logs);
  });

  app.post("/api/simulation-logs", async (req, res) => {
    const parsed = insertSimulationLogSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const log = await storage.createSimulationLog(parsed.data);
    res.json(log);
  });

  app.delete("/api/simulation-logs", async (_req, res) => {
    await storage.clearSimulationLogs();
    res.json({ ok: true });
  });

  // Simulation Params
  app.get("/api/simulation-params", async (_req, res) => {
    const params = await storage.getSimulationParams();
    res.json(params || null);
  });

  app.post("/api/simulation-params", async (req, res) => {
    const parsed = insertSimulationParamsSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const params = await storage.saveSimulationParams(parsed.data);
    res.json(params);
  });

  // Seed agents if empty
  const existingAgents = await storage.getAgents();
  if (existingAgents.length === 0) {
    const seedAgents = [
      { name: "Mykolas Alekna", role: "Lithuanian Discus Athlete", faction: "Medal Optimists", stance: "optimistic", bio: "World record holder in discus throw (75.56m). Son of 2x Olympic champion Virgilijus Alekna. Entering physical prime at age 25-26 for LA 2028. Near-certain medal contender and strong gold favorite.", avatar: "🥇" },
      { name: "Viktorija Senkutė", role: "Lithuanian Rower", faction: "Medal Optimists", stance: "optimistic", bio: "2024 Paris Olympics bronze medalist in women's single sculls. Training at Kaunas rowing center with strong support infrastructure. Aiming to medal again at 2028.", avatar: "🚣" },
      { name: "Domantas Užkuraitis", role: "Lithuanian Discus Coach", faction: "Medal Optimists", stance: "optimistic", bio: "Head coach of Lithuanian athletics throwing program. Part of the Alekna coaching ecosystem that has produced 5 Olympic discus medals since 1992.", avatar: "🏋️" },
      { name: "Laura Asadauskaitė", role: "Retired Pentathlete / Mentor", faction: "Realists", stance: "neutral", bio: "2012 Olympic gold medalist in modern pentathlon. Now 44 and mentoring the next generation. Cautiously optimistic about Lithuania's pentathlon pipeline adapting to the new format.", avatar: "🤺" },
      { name: "Mindaugas Griškonis", role: "Lithuanian Rowing Coach", faction: "Medal Optimists", stance: "optimistic", bio: "Former Olympic silver medalist rower (2016) turned coach. Developing Lithuania's rowing pipeline with focus on women's sculls program.", avatar: "🏅" },
      { name: "Daina Gudzinevičiūtė", role: "LTOK President", faction: "Realists", stance: "neutral", bio: "President of Lithuanian National Olympic Committee. Former Olympic gold medalist in shooting (2000). Manages strategic allocation of €15-20M annual sports budget.", avatar: "🏛️" },
      { name: "Jonas Kazlauskas", role: "Lithuanian Basketball Legend", faction: "Medal Optimists", stance: "optimistic", bio: "Legendary basketball coach who guided Lithuania to Olympic bronze medals. Advocates for 3x3 basketball investment as Lithuania's best team sport medal opportunity.", avatar: "🏀" },
      { name: "Aurimas Didžbalis", role: "Sports Commentator", faction: "Skeptics", stance: "pessimistic", bio: "Former Olympic weightlifter, now sports analyst. Concerned about doping scrutiny reducing Lithuania's medal chances in strength sports. Skeptical of overly optimistic projections.", avatar: "📊" },
      { name: "Dr. Rasa Kreivėnaitė", role: "Sports Science Researcher", faction: "Realists", stance: "neutral", bio: "Lead researcher at Lithuanian Sports University in Kaunas. Studies peak performance timing and injury prevention. Provides data-driven athlete readiness assessments.", avatar: "🔬" },
      { name: "Daniel Ståhl", role: "Rival Athlete - Sweden", faction: "Skeptics", stance: "pessimistic", bio: "Swedish discus thrower and Alekna's main rival. 2019 World Champion, aging but still dangerous. Believes the discus final will be more competitive than predicted.", avatar: "🇸🇪" },
      { name: "Kristjan Čeh", role: "Rival Athlete - Slovenia", faction: "Wildcards", stance: "neutral", bio: "Slovenian discus star and emerging threat. Younger generation rival to Alekna with 71m+ capability. Could disrupt Lithuanian gold medal expectations.", avatar: "🇸🇮" },
      { name: "Artūras Zuokas", role: "Government Sports Advisor", faction: "Medal Optimists", stance: "optimistic", bio: "Lithuanian government advisor on Olympic sports funding. Pushing for increased investment from €18M to €30M+ citing potential ROI from Olympic success.", avatar: "💼" },
      { name: "Tomas Pukelis", role: "3x3 Basketball Player", faction: "Medal Optimists", stance: "optimistic", bio: "Key member of Lithuania's 2024 Paris Olympic bronze medal 3x3 basketball team. Believes the squad can improve to silver or gold at LA 2028.", avatar: "🏀" },
      { name: "Agnė Sereikaitė", role: "Lithuanian Sports Journalist", faction: "Realists", stance: "neutral", bio: "Senior Olympics correspondent for Delfi.lt. Covers Lithuanian sports with balanced analysis. Notes the gap between public expectations and realistic medal counts.", avatar: "📰" },
      { name: "Prof. Ian McMaster", role: "IOC Analytics Expert", faction: "Realists", stance: "neutral", bio: "International Olympic Committee consultant specializing in medal prediction models. Uses GA-BP neural networks and Random Forest models for forecasting.", avatar: "🎯" },
      { name: "Rūta Meilutytė", role: "Former Olympic Champion", faction: "Skeptics", stance: "pessimistic", bio: "2012 Olympic gold medalist in swimming. Now retired. Warns that Lithuania's swimming pipeline is empty and funding is insufficient for aquatic sports development.", avatar: "🏊" },
      { name: "Paulius Motiejūnas", role: "Lithuanian Fan Leader", faction: "Wildcards", stance: "optimistic", bio: "President of Lithuanian Olympic fans association. Organizes supporter travel to Games. Believes national spirit and fan energy can provide a performance boost.", avatar: "🇱🇹" },
      { name: "Dr. Sarah Chen", role: "Global Sports Economist", faction: "Skeptics", stance: "pessimistic", bio: "Economist studying small nation competitiveness in Olympic sports. Research shows 2.8M population countries face structural disadvantages despite per-capita outperformance.", avatar: "📈" },
      { name: "Viktor Kovalev", role: "Rival Coach - Belarus (banned)", faction: "Wildcards", stance: "neutral", bio: "Belarusian wrestling and weightlifting coach. If Russia/Belarus bans continue, his athletes cannot compete — opening medal slots for nations like Lithuania.", avatar: "🚫" },
      { name: "Simona Krupeckaitė", role: "Lithuanian Cycling Legend", faction: "Realists", stance: "neutral", bio: "Former Olympic track cyclist. Now analyzes Lithuania's broader Olympic program. Advocates for diversifying sport investments beyond traditional strong sports.", avatar: "🚴" },
    ];
    for (const a of seedAgents) {
      await storage.createAgent(a);
    }
  }

  return httpServer;
}
