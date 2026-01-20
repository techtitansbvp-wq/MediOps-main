import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Authentication
  await setupAuth(app);
  registerAuthRoutes(app);

  // Consumers API
  app.get(api.consumers.list.path, async (req, res) => {
    // Optional: Check auth here if strict
    // if (!req.isAuthenticated()) return res.sendStatus(401);
    const consumers = await storage.getConsumers();
    res.json(consumers);
  });

  app.get(api.consumers.get.path, async (req, res) => {
    const consumer = await storage.getConsumer(Number(req.params.id));
    if (!consumer) {
      return res.status(404).json({ message: 'Consumer not found' });
    }
    res.json(consumer);
  });

  app.post(api.consumers.create.path, async (req, res) => {
    try {
      const input = api.consumers.create.input.parse(req.body);
      const consumer = await storage.createConsumer(input);
      res.status(201).json(consumer);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.consumers.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.consumers.update.input.parse(req.body);
      
      const existing = await storage.getConsumer(id);
      if (!existing) {
        return res.status(404).json({ message: 'Consumer not found' });
      }

      const consumer = await storage.updateConsumer(id, input);
      res.json(consumer);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.consumers.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    const existing = await storage.getConsumer(id);
    if (!existing) {
      return res.status(404).json({ message: 'Consumer not found' });
    }
    await storage.deleteConsumer(id);
    res.status(204).send();
  });

  // Inventory API
  app.get(api.inventory.list.path, async (req, res) => {
    const inventory = await storage.getInventory();
    res.json(inventory);
  });

  app.post(api.inventory.create.path, async (req, res) => {
    try {
      const input = api.inventory.create.input.parse(req.body);
      const item = await storage.createInventoryItem(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.inventory.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.inventory.update.input.parse(req.body);
      const item = await storage.updateInventoryItem(id, input);
      res.json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.inventory.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteInventoryItem(id);
    res.status(204).send();
  });

  // Analytics API
  app.get(api.analytics.list.path, async (req, res) => {
    const data = await storage.getAnalytics();
    res.json(data);
  });

  // Emergency API
  app.get("/api/emergencies", async (_req, res) => {
    const data = await storage.getEmergencies();
    res.json(data);
  });

  app.post("/api/emergencies", async (req, res) => {
    try {
      const { insertEmergencySchema } = await import("@shared/schema");
      const input = insertEmergencySchema.parse(req.body);
      const emergency = await storage.createEmergency(input);
      res.status(201).json(emergency);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/emergencies/:id/status", async (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;
    const updated = await storage.updateEmergencyStatus(id, status);
    res.json(updated);
  });

  app.delete("/api/emergencies/:id", async (req, res) => {
    await storage.deleteEmergency(Number(req.params.id));
    res.status(204).send();
  });

  // Seed Data (if empty)
  const existingConsumers = await storage.getConsumers();
  if (existingConsumers.length === 0) {
    await storage.createConsumer({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "555-0123",
      address: "123 Main St, Springfield",
      dateOfBirth: "1950-01-01",
      medicalHistory: "Hypertension, Type 2 Diabetes",
      status: "active"
    });
    await storage.createConsumer({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phoneNumber: "555-0124",
      address: "456 Oak Ave, Springfield",
      dateOfBirth: "1945-05-15",
      medicalHistory: "Arthritis, Glaucoma",
      status: "active"
    });
  }

  const existingInventory = await storage.getInventory();
  if (existingInventory.length === 0) {
    await storage.createInventoryItem({
      productName: "Amoxicillin 500mg",
      skuOrId: "AMX-500",
      category: "Antibiotics",
      stockQuantity: 150,
      price: "15.50",
      expiryDate: "2026-12-31",
      supplier: "Global Pharma",
      availabilityStatus: "in_stock"
    });
    await storage.createInventoryItem({
      productName: "Lisinopril 10mg",
      skuOrId: "LSN-010",
      category: "Hypertension",
      stockQuantity: 25,
      price: "12.00",
      expiryDate: "2027-06-30",
      supplier: "HealthCare Supplies",
      availabilityStatus: "low_stock"
    });
  }

  return httpServer;
}
