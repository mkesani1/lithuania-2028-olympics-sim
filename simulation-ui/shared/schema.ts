import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const simulationParams = sqliteTable("simulation_params", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  athleteReadiness: integer("athlete_readiness").notNull().default(75),
  governmentFunding: integer("government_funding").notNull().default(18),
  coachingQuality: integer("coaching_quality").notNull().default(7),
  russiaBan: integer("russia_ban").notNull().default(1),
  aleknaForm: text("alekna_form").notNull().default("Strong"),
  pentathalonTalent: integer("pentathlon_talent").notNull().default(0),
  basketballQualified: integer("basketball_qualified").notNull().default(1),
  rowingDepth: integer("rowing_depth").notNull().default(3),
  hostEffect: integer("host_effect").notNull().default(3),
  simulationRounds: integer("simulation_rounds").notNull().default(100),
});

export const agents = sqliteTable("agents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  faction: text("faction").notNull(),
  stance: text("stance").notNull(),
  bio: text("bio").notNull(),
  avatar: text("avatar").notNull().default(""),
});

export const simulationLogs = sqliteTable("simulation_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agentId: integer("agent_id").notNull(),
  agentName: text("agent_name").notNull(),
  faction: text("faction").notNull(),
  message: text("message").notNull(),
  round: integer("round").notNull(),
  sentiment: real("sentiment").notNull().default(0),
});

export const insertSimulationParamsSchema = createInsertSchema(simulationParams).omit({ id: true });
export const insertAgentSchema = createInsertSchema(agents).omit({ id: true });
export const insertSimulationLogSchema = createInsertSchema(simulationLogs).omit({ id: true });

export type InsertSimulationParams = z.infer<typeof insertSimulationParamsSchema>;
export type SimulationParams = typeof simulationParams.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;
export type InsertSimulationLog = z.infer<typeof insertSimulationLogSchema>;
export type SimulationLog = typeof simulationLogs.$inferSelect;
