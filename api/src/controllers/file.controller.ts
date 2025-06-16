import { Request, Response } from 'express';
import { Container } from 'typedi';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import FileService from '../services/file.service';

export class FileController {
  private fileService = Container.get(FileService);
  public uploadFile = catchAsync(async (req: Request, res: Response) => {
    const file = req.file;

    const url = await this.fileService.uploadFile(file);
    res.status(httpStatus.OK).send({ url });
  });
}
