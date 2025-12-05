import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  UploadedFile,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @MessagePattern({ cmd: 'uploadFile' })
  async getUserApplication(@Payload() payload: { file: any }) {
    // Deserialize the file
    const file = {
      buffer: Buffer.from(payload.file.buffer, 'base64'), // Convert back to buffer
      originalname: payload.file.originalname,
      mimetype: payload.file.mimetype,
      size: payload.file.size,
    };

    return await this.filesService.uploadFile(file);
  }
}
