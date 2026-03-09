import { Controller, Get, Post, Delete, Body, Param, Query, Headers, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from '../services/documents.service';
import { Response } from 'express';

@Controller('api/v1/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  private getTenantId(headers: any): string {
    return headers['x-tenant-id'] || 'default-tenant';
  }

  @Get()
  async findAll(@Headers() headers: any, @Query('folder') folder?: string) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.documentsService.findAll(tenantId, folder) };
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.documentsService.findById(id, tenantId) };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: {
      name?: string;
      description?: string;
      type?: string;
      folder?: string;
      entityId?: string;
      entityType?: string;
    },
    @Headers() headers: any,
  ) {
    const tenantId = this.getTenantId(headers);
    return {
      data: await this.documentsService.upload(tenantId, file, {
        name: body.name,
        description: body.description,
        type: body.type as any,
        folder: body.folder,
        entityId: body.entityId,
        entityType: body.entityType,
      }),
    };
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Headers() headers: any, @Res() res: Response) {
    const tenantId = this.getTenantId(headers);
    const { file, buffer } = await this.documentsService.getFile(id, tenantId);

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
      'Content-Length': file.size,
    });

    res.send(buffer);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    await this.documentsService.delete(id, tenantId);
    return { success: true };
  }
}
