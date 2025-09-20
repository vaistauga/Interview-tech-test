import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { File, FileStatus, FileType } from '../entities/file.entity';
import { FileStorageService } from './file-storage.service';

export interface CreateFileDto {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
  fileType: FileType;
  expirationHours?: number;
}

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async createFile(dto: CreateFileDto): Promise<File> {
    const { buffer, originalName, mimeType, size, fileType, expirationHours = 24 } = dto;

    // Store file on filesystem
    const { storagePath } = await this.fileStorageService.storeFile(
      buffer,
      originalName,
      fileType,
    );

    // Create file entity
    const file = new File();
    file.originalName = originalName;
    file.mimeType = mimeType;
    file.size = size;
    file.storagePath = storagePath;
    file.fileType = fileType;
    file.status = FileStatus.UPLOADED;
    file.expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

    await this.em.persistAndFlush(file);

    this.logger.log(`File created: ${file.id} (${originalName})`);
    return file;
  }

  async getFileById(id: string): Promise<File> {
    const file = await this.em.findOne(File, { id });
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    return file;
  }

  async getFileBuffer(id: string): Promise<Buffer> {
    const file = await this.getFileById(id);
    
    if (!(await this.fileStorageService.fileExists(file.storagePath))) {
      throw new NotFoundException(`File content not found: ${id}`);
    }

    return this.fileStorageService.readFile(file.storagePath);
  }

  async updateFileStatus(
    id: string,
    status: FileStatus,
    jobId?: string,
    errorMessage?: string,
    metadata?: any,
  ): Promise<File> {
    const file = await this.getFileById(id);
    
    file.status = status;
    if (jobId) file.jobId = jobId;
    if (errorMessage) file.errorMessage = errorMessage;
    if (metadata) file.metadata = metadata;

    await this.em.flush();

    this.logger.log(`File status updated: ${id} -> ${status}`);
    return file;
  }

  async deleteFile(id: string): Promise<void> {
    const file = await this.getFileById(id);
    
    // Delete from filesystem
    await this.fileStorageService.deleteFile(file.storagePath);
    
    // Delete from database
    await this.em.removeAndFlush(file);

    this.logger.log(`File deleted: ${id}`);
  }

  async getFilesByStatus(status: FileStatus): Promise<File[]> {
    return this.em.find(File, { status });
  }

  async getFilesByJobId(jobId: string): Promise<File[]> {
    return this.em.find(File, { jobId });
  }

  async cleanupExpiredFiles(): Promise<number> {
    const now = new Date();
    const expiredFiles = await this.em.find(File, {
      expiresAt: { $lt: now },
    });

    let cleanedCount = 0;
    for (const file of expiredFiles) {
      try {
        await this.fileStorageService.deleteFile(file.storagePath);
        file.status = FileStatus.EXPIRED;
        cleanedCount++;
      } catch (error) {
        this.logger.error(`Failed to cleanup file ${file.id}:`, error);
      }
    }

    if (expiredFiles.length > 0) {
      await this.em.flush();
    }

    // Also cleanup orphaned files from filesystem
    const filesystemCleanedCount = await this.fileStorageService.cleanupExpiredFiles(
      new Date(Date.now() - 48 * 60 * 60 * 1000), // 48 hours ago
    );

    const totalCleaned = cleanedCount + filesystemCleanedCount;
    this.logger.log(`Cleanup completed: ${totalCleaned} files processed`);
    
    return totalCleaned;
  }

  async getFileStats(): Promise<{
    total: number;
    byStatus: Record<FileStatus, number>;
    byType: Record<FileType, number>;
  }> {
    const files = await this.em.find(File, {});
    
    const byStatus = files.reduce((acc, file) => {
      acc[file.status] = (acc[file.status] || 0) + 1;
      return acc;
    }, {} as Record<FileStatus, number>);

    const byType = files.reduce((acc, file) => {
      acc[file.fileType] = (acc[file.fileType] || 0) + 1;
      return acc;
    }, {} as Record<FileType, number>);

    return {
      total: files.length,
      byStatus,
      byType,
    };
  }
} 