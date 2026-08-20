import { Request, Response, NextFunction } from 'express';
import { TenderService } from '../services/tenders/tenderService';

export class TenderController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, status, page, limit } = req.query;
      const result = await TenderService.listTenders({
        search: search as string,
        status: status as any,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const tender = await TenderService.getTenderById(req.params.id);
      if (!tender) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Tender not found' } });
      }
      res.status(200).json({ success: true, data: { tender } });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tender = await TenderService.createTender(req.body, req.user?.id);
      res.status(201).json({ success: true, data: { tender }, message: 'Tender recorded' });
    } catch (error) {
      next(error);
    }
  }

  static async analyze(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await TenderService.analyzeTender(req.params.id);
      res.status(200).json({ success: true, data: { tender: updated }, message: 'Tender intelligence analysis completed.' });
    } catch (error) {
      next(error);
    }
  }

  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.body;
      const result = await TenderService.searchTender(req.params.id, query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
