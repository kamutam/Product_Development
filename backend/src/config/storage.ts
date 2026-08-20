import fs from 'fs';
import path from 'path';
import { env } from './env';
import { logger } from './logger';

export interface StorageProvider {
  saveFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<{ url: string; path: string; size: number }>;
  deleteFile(filePath: string): Promise<boolean>;
  getFile(filePath: string): Promise<Buffer>;
}

class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), env.STORAGE_LOCAL_DIR);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(fileBuffer: Buffer, fileName: string, mimeType: string) {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const destination = path.join(this.uploadDir, uniqueName);
    
    await fs.promises.writeFile(destination, fileBuffer);
    return {
      url: `/uploads/${uniqueName}`,
      path: destination,
      size: fileBuffer.length
    };
  }

  async deleteFile(filePath: string) {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
      return true;
    } catch {
      return false;
    }
  }

  async getFile(filePath: string) {
    return await fs.promises.readFile(filePath);
  }
}

export const storage: StorageProvider = new LocalStorageProvider();
