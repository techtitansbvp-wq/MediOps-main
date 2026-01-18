import { pgTable, text, serial, integer, boolean, timestamp, date, varchar } from "drizzle-orm/pg-core";
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
  status: text("status").default("active"), // active, inactive
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertConsumerSchema = createInsertSchema(consumers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Consumer = typeof consumers.$inferSelect;
export type InsertConsumer = z.infer<typeof insertConsumerSchema>;

export type CreateConsumerRequest = InsertConsumer;
export type UpdateConsumerRequest = Partial<InsertConsumer>;
