import { consumers, type Consumer, type InsertConsumer } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Consumers
  getConsumers(): Promise<Consumer[]>;
  getConsumer(id: number): Promise<Consumer | undefined>;
  createConsumer(consumer: InsertConsumer): Promise<Consumer>;
  updateConsumer(id: number, consumer: Partial<InsertConsumer>): Promise<Consumer>;
  deleteConsumer(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Consumers
  async getConsumers(): Promise<Consumer[]> {
    return await db.select().from(consumers).orderBy(desc(consumers.createdAt));
  }

  async getConsumer(id: number): Promise<Consumer | undefined> {
    const [consumer] = await db.select().from(consumers).where(eq(consumers.id, id));
    return consumer;
  }

  async createConsumer(insertConsumer: InsertConsumer): Promise<Consumer> {
    const [consumer] = await db.insert(consumers).values(insertConsumer).returning();
    return consumer;
  }

  async updateConsumer(id: number, updates: Partial<InsertConsumer>): Promise<Consumer> {
    const [consumer] = await db
      .update(consumers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(consumers.id, id))
      .returning();
    return consumer;
  }

  async deleteConsumer(id: number): Promise<void> {
    await db.delete(consumers).where(eq(consumers.id, id));
  }
}

export const storage = new DatabaseStorage();
