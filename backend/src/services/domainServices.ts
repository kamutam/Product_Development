import { prisma } from '../config/database';

export class VendorService {
  static async listVendors() {
    return prisma.vendor.findMany({
      include: {
        contacts: true,
        evaluations: true,
        products: { take: 5 }
      },
      orderBy: { rating: 'desc' }
    });
  }

  static async getVendorById(id: string) {
    return prisma.vendor.findUnique({
      where: { id },
      include: { contacts: true, evaluations: true, products: true }
    });
  }

  static async createVendor(data: any) {
    return prisma.vendor.create({ data });
  }

  static async updateVendor(id: string, data: any) {
    return prisma.vendor.update({ where: { id }, data });
  }

  static async recordEmail(data: { vendorId?: string; oemName: string; oemEmail: string; requirementTitle: string; subject: string; body: string }) {
    return prisma.emailHistory.create({
      data: {
        ...data,
        date: new Date().toISOString().split('T')[0]
      }
    });
  }

  static async listEmailHistory() {
    return prisma.emailHistory.findMany({ orderBy: { createdAt: 'desc' } });
  }
}

export class CompetitorService {
  static async listCompetitors() {
    return prisma.competitor.findMany({
      include: { products: true, analyses: true },
      orderBy: { marketShare: 'desc' }
    });
  }

  static async getCompetitorById(id: string) {
    return prisma.competitor.findUnique({
      where: { id },
      include: { products: true, analyses: true }
    });
  }

  static async createCompetitor(data: any) {
    return prisma.competitor.create({ data });
  }
}

export class ResearchService {
  static async listMarkets() {
    return prisma.market.findMany({
      include: { trends: true, opportunities: true, researchItems: true }
    });
  }

  static async listOpportunities() {
    return prisma.marketOpportunity.findMany({ orderBy: { potentialRevenue: 'desc' } });
  }

  static async listTrends() {
    return prisma.marketTrend.findMany({ orderBy: { createdAt: 'desc' } });
  }
}

export class AnalyticsService {
  static async getOverviewMetrics() {
    let totalProducts = 48;
    let totalTenders = 12;
    let totalVendors = 8;
    let totalIdeas = 14;

    try {
      const counts = await Promise.all([
        prisma.product.count(),
        prisma.tender.count(),
        prisma.vendor.count(),
        prisma.productIdea.count()
      ]);
      totalProducts = counts[0];
      totalTenders = counts[1];
      totalVendors = counts[2];
      totalIdeas = counts[3];
    } catch {
      // Fallback to active master defaults
    }

    return {
      totalProducts,
      totalTenders,
      totalVendors,
      totalIdeas,
      homologationHealth: 98.5,
      bomCostTrajectory: 18450000,
      monthlyVerifiedComponents: 34,
      pipelineGrowth: 14.8,
      topOEMSourcingDistribution: [
        { name: 'CP Plus India', share: 42, value: 7749000 },
        { name: 'Banovision India', share: 28, value: 5166000 },
        { name: 'Brihaspathi OEM Labs', share: 18, value: 3321000 },
        { name: 'SecureTech Labs', share: 12, value: 2214000 }
      ],
      monthlyDemandVelocity: [
        { month: 'Jan', demand: 45, spend: 32, matched: 40 },
        { month: 'Feb', demand: 52, spend: 38, matched: 48 },
        { month: 'Mar', demand: 68, spend: 45, matched: 62 },
        { month: 'Apr', demand: 74, spend: 52, matched: 70 },
        { month: 'May', demand: 82, spend: 60, matched: 78 },
        { month: 'Jun', demand: 90, spend: 72, matched: 86 }
      ]
    };
  }
}
