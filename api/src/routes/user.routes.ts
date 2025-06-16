import { Router } from 'express';
import { upload } from '../middlewares/multer';
import { Routes } from '../interfaces/routes.interface';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';

export class UserRoute implements Routes {
  public router = Router();
  private userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/createUser', this.userController.createUser);
  }
}
