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
import { Request, Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}


    @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Response> {
    const data = await this.filesService.uploadFile(file);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Successfully uploaded file', data });
  }
}
