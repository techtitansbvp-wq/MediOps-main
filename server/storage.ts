import { consumers, inventory, analytics, type Consumer, type InsertConsumer, type Inventory, type InsertInventory, type Analytics } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Consumers
  getConsumers(): Promise<Consumer[]>;
  getConsumer(id: number): Promise<Consumer | undefined>;
  createConsumer(consumer: InsertConsumer): Promise<Consumer>;
  updateConsumer(id: number, consumer: Partial<InsertConsumer>): Promise<Consumer>;
  deleteConsumer(id: number): Promise<void>;

  // Inventory
  getInventory(): Promise<Inventory[]>;
  getInventoryItem(id: number): Promise<Inventory | undefined>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;
  updateInventoryItem(id: number, item: Partial<InsertInventory>): Promise<Inventory>;
  deleteInventoryItem(id: number): Promise<void>;

  // Analytics
  getAnalytics(): Promise<Analytics[]>;
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

  // Inventory
  async getInventory(): Promise<Inventory[]> {
    return await db.select().from(inventory);
  }

  async getInventoryItem(id: number): Promise<Inventory | undefined> {
    const [item] = await db.select().from(inventory).where(eq(inventory.id, id));
    return item;
  }

  async createInventoryItem(item: InsertInventory): Promise<Inventory> {
    const [newItem] = await db.insert(inventory).values(item).returning();
    return newItem;
  }

  async updateInventoryItem(id: number, updates: Partial<InsertInventory>): Promise<Inventory> {
    const [updatedItem] = await db
      .update(inventory)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(inventory.id, id))
      .returning();
    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<void> {
    await db.delete(inventory).where(eq(inventory.id, id));
  }

  // Analytics
  async getAnalytics(): Promise<Analytics[]> {
    return await db.select().from(analytics).orderBy(desc(analytics.date));
  }
}

export const storage = new DatabaseStorage();
