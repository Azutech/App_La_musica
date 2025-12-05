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
  // Serialize file for microservice transfer
  const serializedFile = {
    buffer: file.buffer.toString('base64'), // Convert buffer to base64
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  };

  const data = await this.fileUploadService.uploadFile(serializedFile);

  return res
    .status(HttpStatus.OK)
    .json({ message: 'Successfully uploaded file', data });
}
}
