import { Controller ,
    Get,
  Req,
  Res,
  Post,
  UploadedFile,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { Request, Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Response> {
    const data = await this.fileUploadService.uploadFile(file);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Successfully uploaded file', data });
  }
}
