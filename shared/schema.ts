import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  blockchainId: integer("blockchain_id").notNull(),
  aggressorName: text("aggressor_name").notNull(),
  institution: text("institution").notNull(),
  description: text("description").notNull(),
  incidentYear: integer("incident_year").notNull(),
  city: text("city"),
  reporterAddress: text("reporter_address").notNull(),
  transactionHash: text("transaction_hash").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const supportOrganizations = pgTable("support_organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // emergency, government, ngo, legal, psychological
  phone: text("phone").notNull(),
  description: text("description").notNull(),
  region: text("region").notNull(),
  website: text("website"),
  available24h: boolean("available_24h").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  timestamp: true,
}).extend({
  // Frontend form validation
  aggressorName: z.string().min(2, "Nombre del agresor requerido"),
  institution: z.string().min(2, "Institución requerida"),
  description: z.string().min(10, "Descripción debe tener al menos 10 caracteres"),
  incidentYear: z.number().min(2020).max(2025),
  city: z.string().optional(),
  // Private data (will be encrypted)
  victimAge: z.string().optional(),
  relationshipType: z.string().optional(),
  violenceType: z.string().optional(),
  urgencyLevel: z.string().optional(),
});

export const insertSupportOrgSchema = createInsertSchema(supportOrganizations).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertSupportOrg = z.infer<typeof insertSupportOrgSchema>;
export type SupportOrg = typeof supportOrganizations.$inferSelect;

// Frontend-specific types
export interface PublicReport {
  id: number;
  aggressorName: string;
  institution: string;
  description: string;
  incidentYear: number;
  city?: string;
  timestamp?: number;
  patternCount?: number;
  category?: string;
  supportOrganizations?: any[];
  transactionHash?: string;
}

export interface PrivateAnalytics {
  totalReports: number;
  uniqueAggressors: number;
  patternsDetected: number;
  averageAge?: number;
  commonRelationship?: string;
  commonViolenceType?: string;
  urgencyDistribution?: Record<string, number>;
}
