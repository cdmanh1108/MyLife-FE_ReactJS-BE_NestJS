import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
@Injectable()
export class StorageService {
  constructor(private readonly config: ConfigService) {}
  async saveLocal(file: Express.Multer.File) {
    const base = this.config.get<string>('LOCAL_STORAGE_PATH') ?? 'uploads';
    await fs.mkdir(base, { recursive: true });
    const ext = file.originalname.includes('.') ? file.originalname.substring(file.originalname.lastIndexOf('.')) : '';
    const filename = `${uuid()}${ext}`;
    const storageKey = join(base, filename);
    await fs.writeFile(storageKey, file.buffer);
    return { filename, storageKey, url: `/${base}/${filename}` };
  }
  async deleteLocal(storageKey: string) {
    try {
      await fs.unlink(storageKey);
    } catch {
      /* ignore missing file */
    }
  }
}
