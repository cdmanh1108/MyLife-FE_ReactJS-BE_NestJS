import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { put, del } from '@vercel/blob';

@Injectable()
export class StorageService {
  constructor(private readonly config: ConfigService) {}

  async saveLocal(file: Express.Multer.File) {
    const token = this.config.get<string>('BLOB_READ_WRITE_TOKEN') || process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      const ext = file.originalname.includes('.') ? file.originalname.substring(file.originalname.lastIndexOf('.')) : '';
      const filename = `${uuid()}${ext}`;
      const blob = await put(filename, file.buffer, {
        access: 'public',
        token,
      });
      return { filename: file.originalname, storageKey: blob.url, url: blob.url };
    }

    const base = this.config.get<string>('LOCAL_STORAGE_PATH') ?? 'uploads';
    await fs.mkdir(base, { recursive: true });
    const ext = file.originalname.includes('.') ? file.originalname.substring(file.originalname.lastIndexOf('.')) : '';
    const filename = `${uuid()}${ext}`;
    const storageKey = join(base, filename);
    await fs.writeFile(storageKey, file.buffer);
    return { filename, storageKey, url: `/${base}/${filename}` };
  }

  async deleteLocal(storageKey: string) {
    if (!storageKey) return;

    if (storageKey.startsWith('http://') || storageKey.startsWith('https://')) {
      try {
        const token = this.config.get<string>('BLOB_READ_WRITE_TOKEN') || process.env.BLOB_READ_WRITE_TOKEN;
        await del(storageKey, { token });
      } catch {
        /* ignore delete error */
      }
      return;
    }

    try {
      await fs.unlink(storageKey);
    } catch {
      /* ignore missing file */
    }
  }
}
