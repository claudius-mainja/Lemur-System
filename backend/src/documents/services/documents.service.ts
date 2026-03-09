import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentType } from '../entities/document.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  private getTenantId(headers: any): string {
    return headers['x-tenant-id'] || 'default-tenant';
  }

  private getUploadPath(): string {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    return uploadPath;
  }

  async findAll(tenantId: string, folder?: string): Promise<Document[]> {
    const where: any = { tenantId };
    if (folder) {
      where.folder = folder;
    }
    return this.documentRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, tenantId: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id, tenantId },
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async upload(
    tenantId: string,
    file: Express.Multer.File,
    data: {
      name?: string;
      description?: string;
      type?: DocumentType;
      folder?: string;
      entityId?: string;
      entityType?: string;
    },
  ): Promise<Document> {
    const uploadPath = this.getUploadPath();
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadPath, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const document = this.documentRepository.create({
      name: data.name || file.originalname,
      description: data.description,
      type: data.type || DocumentType.OTHER,
      fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      folder: data.folder,
      entityId: data.entityId,
      entityType: data.entityType,
      tenantId,
    });

    return this.documentRepository.save(document);
  }

  async getFile(id: string, tenantId: string): Promise<{ file: Document; buffer: Buffer }> {
    const document = await this.findById(id, tenantId);
    const filePath = path.join(this.getUploadPath(), document.fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found on disk');
    }

    return {
      file: document,
      buffer: fs.readFileSync(filePath),
    };
  }

  async delete(id: string, tenantId: string): Promise<void> {
    const document = await this.findById(id, tenantId);
    const filePath = path.join(this.getUploadPath(), document.fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.documentRepository.remove(document);
  }
}
