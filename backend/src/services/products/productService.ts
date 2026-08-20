import { prisma } from '../../config/database';
import { ProductStatus } from '@prisma/client';

export class ProductService {
  static async listProducts(params: {
    search?: string;
    categoryId?: string;
    status?: ProductStatus;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { sku: { contains: params.search, mode: 'insensitive' } },
        { vendorName: { contains: params.search, mode: 'insensitive' } }
      ];
    }
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.status) where.status = params.status;

    try {
      const [items, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { category: true }
        }),
        prisma.product.count({ where })
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
    } catch {
      // Offline / Local Development Fallback Data
      const fallbackProducts = [
        { id: 'p-1', name: 'CP Plus 4MP Motorized Bullet Camera', sku: 'CP-UNC-TA41ZL6C', price: 12500, status: 'ACTIVE', specs: { resolution: '4MP', stqc: true } },
        { id: 'p-2', name: 'Banovision 8MP 4K AI DeepinView Bullet Camera', sku: 'BANO-IPC-HFW7842', price: 32500, status: 'ACTIVE', specs: { resolution: '8MP', stqc: true } },
        { id: 'p-3', name: 'Brihaspathi Smart City Multi-Sensor IoT Node', sku: 'BTL-IOT-ENV-4.0', price: 14500, status: 'ACTIVE', specs: { sensors: 'PM2.5, CO2', stqc: true } }
      ];
      return {
        items: fallbackProducts,
        pagination: { total: fallbackProducts.length, page: 1, limit: 50, totalPages: 1 }
      };
    }
  }

  static async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        features: true,
        requirements: true,
        versions: true,
        documents: true
      }
    });
  }

  static async createProduct(data: any, creatorId?: string) {
    return prisma.product.create({
      data: {
        ...data,
        creatorId
      }
    });
  }

  static async updateProduct(id: string, data: any) {
    return prisma.product.update({
      where: { id },
      data
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({ where: { id } });
  }

  // Product Ideas & Roadmaps
  static async listIdeas() {
    return prisma.productIdea.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static async createIdea(data: any) {
    return prisma.productIdea.create({ data });
  }

  static async listRoadmaps() {
    return prisma.productRoadmap.findMany({
      include: { milestones: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
