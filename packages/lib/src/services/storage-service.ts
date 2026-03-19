import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { nanoid } from 'nanoid';
import { env } from '../env';

export interface StoredAsset {
  fileUrl: string;
  key: string;
}

export class StorageService {
  async saveBase64Asset(input: { fileName: string; contentBase64: string }) : Promise<StoredAsset> {
    const dir = join(process.cwd(), env.localStorageDir);
    await mkdir(dir, { recursive: true });
    const key = `${nanoid()}-${input.fileName}`;
    const outputPath = join(dir, key);
    await writeFile(outputPath, Buffer.from(input.contentBase64, 'base64'));
    return { key, fileUrl: `/${env.localStorageDir}/${key}` };
  }
}
