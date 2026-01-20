import { pgTable, text, serial, integer, boolean, timestamp, date, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Import auth tables
export * from "./models/auth";
import { users } from "./models/auth";

export const consumers = pgTable("consumers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  address: text("address"),
  dateOfBirth: date("date_of_birth"),
  medicalHistory: text("medical_history"),
  status: text("status").default("active"),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  productName: text("product_name").notNull(),
  skuOrId: text("sku_or_id").notNull(),
  category: text("category").notNull(),
  stockQuantity: integer("stock_quantity").notNull(),
  expiryDate: date("expiry_date"),
  supplier: text("supplier"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  availabilityStatus: text("availability_status").notNull().default("in_stock"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  revenue: numeric("revenue", { precision: 12, scale: 2 }).notNull(),
  orders: integer("orders").notNull(),
  newPatients: integer("new_patients").notNull(),
});

export const insertConsumerSchema = createInsertSchema(consumers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInventorySchema = createInsertSchema(inventory).omit({ id: true, updatedAt: true });
export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true });

export type Consumer = typeof consumers.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;

export type InsertConsumer = typeof consumers.$inferInsert;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
