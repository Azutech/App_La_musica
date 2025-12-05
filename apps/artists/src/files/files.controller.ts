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
    return await this.filesService.uploadFile(
      payload.file,
    );
  }

}
