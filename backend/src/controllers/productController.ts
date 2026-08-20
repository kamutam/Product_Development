import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/products/productService';

export class ProductController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, categoryId, status, page, limit } = req.query;
      const result = await ProductService.listProducts({
        search: search as string,
        categoryId: categoryId as string,
        status: status as any,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
      }
      res.status(200).json({ success: true, data: { product } });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body, req.user?.id);
      res.status(201).json({ success: true, data: { product }, message: 'Product created' });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      res.status(200).json({ success: true, data: { product }, message: 'Product updated' });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async listIdeas(req: Request, res: Response, next: NextFunction) {
    try {
      const ideas = await ProductService.listIdeas();
      res.status(200).json({ success: true, data: { ideas } });
    } catch (error) {
      next(error);
    }
  }

  static async createIdea(req: Request, res: Response, next: NextFunction) {
    try {
      const idea = await ProductService.createIdea(req.body);
      res.status(201).json({ success: true, data: { idea } });
    } catch (error) {
      next(error);
    }
  }

  static async listRoadmaps(req: Request, res: Response, next: NextFunction) {
    try {
      const roadmaps = await ProductService.listRoadmaps();
      res.status(200).json({ success: true, data: { roadmaps } });
    } catch (error) {
      next(error);
    }
  }
}
