import {
  type Agent, type InsertAgent, agents,
  type SimulationLog, type InsertSimulationLog, simulationLogs,
  type SimulationParams, type InsertSimulationParams, simulationParams,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);

export interface IStorage {
  getAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  getSimulationLogs(): Promise<SimulationLog[]>;
  createSimulationLog(log: InsertSimulationLog): Promise<SimulationLog>;
  clearSimulationLogs(): Promise<void>;
  getSimulationParams(): Promise<SimulationParams | undefined>;
  saveSimulationParams(params: InsertSimulationParams): Promise<SimulationParams>;
}

export class DatabaseStorage implements IStorage {
  async getAgents(): Promise<Agent[]> {
    return db.select().from(agents).all();
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    return db.select().from(agents).where(eq(agents.id, id)).get();
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    return db.insert(agents).values(agent).returning().get();
  }

  async getSimulationLogs(): Promise<SimulationLog[]> {
    return db.select().from(simulationLogs).all();
  }

  async createSimulationLog(log: InsertSimulationLog): Promise<SimulationLog> {
    return db.insert(simulationLogs).values(log).returning().get();
  }

  async clearSimulationLogs(): Promise<void> {
    db.delete(simulationLogs).run();
  }

  async getSimulationParams(): Promise<SimulationParams | undefined> {
    return db.select().from(simulationParams).get();
  }

  async saveSimulationParams(params: InsertSimulationParams): Promise<SimulationParams> {
    // Upsert: delete all then insert
    db.delete(simulationParams).run();
    return db.insert(simulationParams).values(params).returning().get();
  }
}

export const storage = new DatabaseStorage();
