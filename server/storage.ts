import { type User, type InsertUser, type Report, type InsertReport, type SupportOrg, type InsertSupportOrg } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createReport(report: InsertReport): Promise<Report>;
  getReport(id: string): Promise<Report | undefined>;
  getAllReports(): Promise<Report[]>;
  getReportsByAggressor(aggressorName: string): Promise<Report[]>;
  
  getSupportOrganizations(): Promise<SupportOrg[]>;
  getSupportOrgsByCategory(category: string): Promise<SupportOrg[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private reports: Map<string, Report>;
  private supportOrgs: Map<string, SupportOrg>;

  constructor() {
    this.users = new Map();
    this.reports = new Map();
    this.supportOrgs = new Map();
    this.initializeSupportOrganizations();
  }

  private initializeSupportOrganizations() {
    const mexSupportOrgs: InsertSupportOrg[] = [
      // Emergency
      {
        name: "LOCATEL Emergencias",
        category: "emergency",
        phone: "56-58-1111",
        description: "Ciudad de México - Emergencias",
        region: "Ciudad de México",
        available24h: true,
      },
      {
        name: "911 Nacional",
        category: "emergency", 
        phone: "911",
        description: "Nacional - Emergencias",
        region: "Nacional",
        available24h: true,
      },
      
      // Government
      {
        name: "CAVI CDMX",
        category: "government",
        phone: "555-533-5533",
        description: "Ciudad de México - Atención a víctimas",
        region: "Ciudad de México",
        available24h: false,
      },
      {
        name: "Instituto Nacional de las Mujeres",
        category: "government",
        phone: "01-800-911-2511",
        description: "Nacional - Apoyo integral",
        region: "Nacional",
        available24h: true,
      },
      
      // NGO
      {
        name: "Red Nacional de Refugios",
        category: "ngo",
        phone: "01-800-822-4460",
        description: "Nacional - Refugios seguros",
        region: "Nacional",
        website: "https://rednacionalderefugios.org.mx",
        available24h: true,
      },
      {
        name: "Fundación Origen",
        category: "ngo",
        phone: "555-207-8058",
        description: "Nacional - Apoyo psicológico",
        region: "Nacional",
        available24h: false,
      },
      
      // Legal
      {
        name: "Defensoría Pública",
        category: "legal",
        phone: "555-627-1700",
        description: "Ciudad de México - Asesoría gratuita",
        region: "Ciudad de México",
        available24h: false,
      },
      
      // Psychological
      {
        name: "SAPTEL",
        category: "psychological",
        phone: "01-800-472-7835",
        description: "Nacional - Crisis emocional",
        region: "Nacional",
        available24h: true,
      },
    ];

    mexSupportOrgs.forEach(org => {
      const id = randomUUID();
      const supportOrg: SupportOrg = { 
        ...org, 
        id,
        website: org.website || null
      };
      this.supportOrgs.set(id, supportOrg);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = randomUUID();
    const report: Report = { 
      ...insertReport, 
      id,
      timestamp: new Date(),
      city: insertReport.city || null,
    };
    this.reports.set(id, report);
    return report;
  }

  async getReport(id: string): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values())
      .filter(report => report.isActive)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getReportsByAggressor(aggressorName: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      report => report.aggressorName.toLowerCase() === aggressorName.toLowerCase() && report.isActive
    );
  }

  async getSupportOrganizations(): Promise<SupportOrg[]> {
    return Array.from(this.supportOrgs.values());
  }

  async getSupportOrgsByCategory(category: string): Promise<SupportOrg[]> {
    return Array.from(this.supportOrgs.values()).filter(
      org => org.category === category
    );
  }
}

export const storage = new MemStorage();
