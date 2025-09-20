import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 } from 'uuid';
import { FileType } from '../entities/file.entity';

export interface StoredFileInfo {
  storagePath: string;
  filename: string;
}

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD_DIR', './uploads');
    this.ensureUploadDirectoryExists();
  }

  private async ensureUploadDirectoryExists(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadDir}`);
    }
  }

  async storeFile(
    buffer: Buffer,
    originalName: string,
    fileType: FileType,
  ): Promise<StoredFileInfo> {
    const fileExtension = path.extname(originalName);
    const filename = `${v4()}${fileExtension}`;
    const typeDir = path.join(this.uploadDir, fileType);
    const storagePath = path.join(typeDir, filename);

    // Ensure type-specific directory exists
    await fs.mkdir(typeDir, { recursive: true });

    // Store the file
    await fs.writeFile(storagePath, buffer);

    this.logger.log(`File stored: ${storagePath}`);

    return {
      storagePath,
      filename,
    };
  }

  async readFile(storagePath: string): Promise<Buffer> {
    try {
      return await fs.readFile(storagePath);
    } catch (error) {
      this.logger.error(`Failed to read file: ${storagePath}`, error);
      throw new Error(`File not found or inaccessible: ${storagePath}`);
    }
  }

  async deleteFile(storagePath: string): Promise<void> {
    try {
      await fs.unlink(storagePath);
      this.logger.log(`File deleted: ${storagePath}`);
    } catch (error) {
      this.logger.warn(`Failed to delete file: ${storagePath}`, error);
      // Don't throw error for cleanup operations
    }
  }

  async fileExists(storagePath: string): Promise<boolean> {
    try {
      await fs.access(storagePath);
      return true;
    } catch {
      return false;
    }
  }

  getStoragePath(fileType: FileType, filename: string): string {
    return path.join(this.uploadDir, fileType, filename);
  }

  async cleanupExpiredFiles(expirationDate: Date): Promise<number> {
    let cleanedCount = 0;
    
    try {
      const typeDirectories = await fs.readdir(this.uploadDir);
      
      for (const typeDir of typeDirectories) {
        const typePath = path.join(this.uploadDir, typeDir);
        const stat = await fs.stat(typePath);
        
        if (stat.isDirectory()) {
          const files = await fs.readdir(typePath);
          
          for (const file of files) {
            const filePath = path.join(typePath, file);
            const fileStat = await fs.stat(filePath);
            
            if (fileStat.mtime < expirationDate) {
              await this.deleteFile(filePath);
              cleanedCount++;
            }
          }
        }
      }
    } catch (error) {
      this.logger.error('Error during file cleanup:', error);
    }

    this.logger.log(`Cleaned up ${cleanedCount} expired files`);
    return cleanedCount;
  }
} 