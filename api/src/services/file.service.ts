import { Service } from 'typedi';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpException } from '../utils/httpException';
import httpStatus from 'http-status';
import { AWS_ACCESS_KEY_ID, AWS_BUCKET, AWS_REGION, AWS_SECRET_KEY_ID } from '../config';

@Service()
export default class FileService {
  private static instance: FileService;
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_KEY_ID,
      },
      region: AWS_REGION,
    });
  }

  static getInstance() {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        throw new HttpException(httpStatus.NOT_FOUND, 'File not found');
      }

      const key = `${uuidv4()}-${file?.originalname}`;

      const command = new PutObjectCommand({
        Bucket: AWS_BUCKET,
        Key: key,
        Body: file?.buffer,
        ContentType: file.mimetype,
      });

      const response = await this.s3.send(command);

      console.log('response', response);

      const getPublicUrl = (bucketName: string, fileName: string) => {
        return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
      };

      // Generate a public URL for the uploaded object
      const params = {
        Bucket: AWS_BUCKET,
        Key: key,
      };

      const url = getPublicUrl(params.Bucket, params.Key);

      return url;
    } catch (error) {
      throw new HttpException(error?.status, error?.message);
    }
  }
}
