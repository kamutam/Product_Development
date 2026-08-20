import { prisma } from '../../config/database';
import { TenderAgent } from '../agents/tenderAgent';
import { TenderStatus } from '@prisma/client';

export class TenderService {
  static async listTenders(params: { search?: string; status?: TenderStatus; page?: number; limit?: number }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.search) {
      where.OR = [
        { tenderRefNo: { contains: params.search, mode: 'insensitive' } },
        { title: { contains: params.search, mode: 'insensitive' } },
        { organisationName: { contains: params.search, mode: 'insensitive' } },
        { gemBidId: { contains: params.search, mode: 'insensitive' } }
      ];
    }
    if (params.status) where.status = params.status;

    const [items, total] = await Promise.all([
      prisma.tender.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { documents: true }
      }),
      prisma.tender.count({ where })
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getTenderById(id: string) {
    return prisma.tender.findUnique({
      where: { id },
      include: {
        documents: true,
        analyses: true
      }
    });
  }

  static async createTender(data: any, creatorId?: string) {
    return prisma.tender.create({
      data: {
        ...data,
        creatorId
      }
    });
  }

  static async analyzeTender(id: string) {
    const tender = await prisma.tender.findUnique({ where: { id } });
    if (!tender) throw new Error('Tender record not found');

    const pageMap = (tender.pageMap as any) || [];
    const extracted14Points = await TenderAgent.extract14PointsFromPages(pageMap);

    const updated = await prisma.tender.update({
      where: { id },
      data: {
        statutoryDossier: extracted14Points,
        status: TenderStatus.HOMOLOGATED
      }
    });

    return updated;
  }

  static async searchTender(id: string, query: string) {
    const tender = await prisma.tender.findUnique({ where: { id } });
    if (!tender) throw new Error('Tender record not found');

    const pageMap = (tender.pageMap as any) || [];
    return TenderAgent.searchTenderPackage(query, pageMap);
  }
}
