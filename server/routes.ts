import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReportSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Reports endpoints
  app.post("/api/reports", async (req, res) => {
    try {
      const reportData = insertReportSchema.parse(req.body);
      
      // Simulate blockchain submission - in reality this would call the smart contract
      const report = await storage.createReport({
        blockchainId: Math.floor(Math.random() * 1000000),
        aggressorName: reportData.aggressorName,
        institution: reportData.institution,
        description: reportData.description,
        incidentYear: reportData.incidentYear,
        city: reportData.city || "",
        reporterAddress: "0x" + Math.random().toString(16).substr(2, 40), // Mock address
        transactionHash: "0x" + Math.random().toString(16).substr(2, 64), // Mock tx hash
        isActive: true,
      });

      res.json({ success: true, report });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create report" });
      }
    }
  });

  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getAllReports();
      
      // Transform to frontend format with pattern detection
      const reportsWithPatterns = await Promise.all(
        reports.map(async (report) => {
          const aggressorReports = await storage.getReportsByAggressor(report.aggressorName);
          return {
            id: report.blockchainId,
            aggressorName: report.aggressorName,
            institution: report.institution,
            description: report.description,
            incidentYear: report.incidentYear,
            city: report.city,
            timestamp: report.timestamp.getTime(),
            patternCount: aggressorReports.length,
            category: getCategoryFromInstitution(report.institution),
          };
        })
      );

      res.json(reportsWithPatterns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  // Support organizations endpoints
  app.get("/api/support-organizations", async (req, res) => {
    try {
      const category = req.query.category as string;
      const organizations = category 
        ? await storage.getSupportOrgsByCategory(category)
        : await storage.getSupportOrganizations();
      
      res.json(organizations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch support organizations" });
    }
  });

  // Analytics endpoint (simplified - in reality would use FHE computations)
  app.get("/api/analytics", async (req, res) => {
    try {
      const allReports = await storage.getAllReports();
      
      // Calculate basic statistics
      const totalReports = allReports.length;
      const uniqueAggressors = new Set(allReports.map(r => r.aggressorName)).size;
      
      // Count patterns (aggressors with multiple reports)
      const aggressorCounts = new Map<string, number>();
      allReports.forEach(report => {
        const count = aggressorCounts.get(report.aggressorName) || 0;
        aggressorCounts.set(report.aggressorName, count + 1);
      });
      const patternsDetected = Array.from(aggressorCounts.values()).filter(count => count > 1).length;

      // Institution categorization
      const institutionStats = allReports.reduce((acc, report) => {
        const category = getCategoryFromInstitution(report.institution);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      res.json({
        totalReports,
        uniqueAggressors,
        patternsDetected,
        institutionStats,
        supportOrganizations: await storage.getSupportOrganizations().then(orgs => orgs.length),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getCategoryFromInstitution(institution: string): string {
  const lower = institution.toLowerCase();
  if (lower.includes('universidad') || lower.includes('instituto') || lower.includes('colegio')) {
    return 'Educación';
  }
  if (lower.includes('hospital') || lower.includes('clínica') || lower.includes('salud')) {
    return 'Salud';
  }
  if (lower.includes('gobierno') || lower.includes('municipal') || lower.includes('estatal')) {
    return 'Gobierno';
  }
  if (lower.includes('empresa') || lower.includes('corporativ')) {
    return 'Laboral';
  }
  return 'Otros';
}
