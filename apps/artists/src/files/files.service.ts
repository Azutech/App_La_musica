import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get('B2_BUCKET_NAME');

    this.s3Client = new S3Client({
      endpoint: this.configService.get('B2_ENDPOINT'),
      region: this.configService.get('B2_REGION'),
      credentials: {
        accessKeyId: this.configService.get('B2_KEY_ID'),
        secretAccessKey: this.configService.get('B2_APPLICATION_KEY'),
      },
    });

    this.logger.log('B2 Storage initialized');
  }

async uploadFile(
  file: any,
  options?: {
    folder?: string;
    customFilename?: string;
    metadata?: Record<string, string>;
  },
): Promise<{ url: string; key: string; size: number; hash?: string }> {
  try {
    // Add validation at the start
    if (!file || !file.buffer) {
      throw new Error('Invalid file: buffer is required');
    }

    const buffer = Buffer.isBuffer(file.buffer) ? file.buffer : file.buffer;
    const originalName = file.originalname;
    const mimeType = file.mimetype;

    // Generate unique filename
    const fileExtension = originalName?.split('.').pop() || 'bin';
    const uniqueFilename =
      options?.customFilename || `${uuidv4()}.${fileExtension}`;
    const folder = options?.folder || 'uploads';
    const key = `${folder}/${uniqueFilename}`;

    // Generate hash for document integrity
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        Metadata: options?.metadata,
      },
    });

    await upload.done();

    const url = `${this.configService.get('B2_ENDPOINT')}/${this.bucketName}/${key}`;

    this.logger.log(`File uploaded: ${key}`);

    return {
      url,
      key,
      size: buffer.length,
      hash,
    };
  } catch (error) {
    this.logger.error('Upload failed', error);
    throw error;
  }
}
// ```

// ## Complete Flow:
// ```
// HTTP Request (Multer File with Buffer)
//          ↓
// API Gateway: Convert buffer to base64 string
//          ↓
// Redis/Microservice: Transfer serialized data
//          ↓
// Microservice Controller: Convert base64 back to Buffer
//          ↓
// FilesService: Upload to B2
//          ↓
// Return result
}
