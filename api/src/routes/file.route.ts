import { Router } from 'express';
import { upload } from '../middlewares/multer';
import { Routes } from '../interfaces/routes.interface';
import { FileController } from '../controllers/file.controller';

export class FileRoute implements Routes {
  public router = Router();
  private fileController = new FileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/upload', upload.single('file'), this.fileController.uploadFile);
  }
}
