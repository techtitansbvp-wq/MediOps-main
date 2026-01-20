import { Consumer, Inventory } from "./schema";

export const MOCK_CONSUMERS: Consumer[] = [
  {
    id: 9991,
    firstName: "Demo",
    lastName: "Patient 1",
    email: "demo1@example.com",
    phoneNumber: "555-0001",
    address: "123 Demo St",
    dateOfBirth: "1940-01-01",
    medicalHistory: "Sample medical history for demo.",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 9992,
    firstName: "Demo",
    lastName: "Patient 2",
    email: "demo2@example.com",
    phoneNumber: "555-0002",
    address: "456 Demo Ave",
    dateOfBirth: "1950-05-15",
    medicalHistory: "Another sample history.",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export const MOCK_INVENTORY: Inventory[] = [
  {
    id: 8881,
    productName: "Demo Medicine A",
    skuOrId: "DEMO-A",
    category: "General",
    stockQuantity: 50,
    expiryDate: "2026-12-31",
    supplier: "Demo Supplier",
    price: "10.00",
    availabilityStatus: "in_stock",
    updatedAt: new Date(),
  },
  {
    id: 8882,
    productName: "Demo Medicine B",
    skuOrId: "DEMO-B",
    category: "Special",
    stockQuantity: 5,
    expiryDate: "2025-06-30",
    supplier: "Demo Supplier",
    price: "25.00",
    availabilityStatus: "low_stock",
    updatedAt: new Date(),
  }
];
