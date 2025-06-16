import { Request, Response } from 'express';
import { Container } from 'typedi';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import FileService from '../services/file.service';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/chat.dto';

export class UserController {
  private userService = Container.get(UserService);

  public createUser = catchAsync(async (req: Request, res: Response) => {
    const data: CreateUserDto = req.body;

    const response = await this.userService.createUser(
      { apiKey: req.headers['x-api-key'] as string, secretKey: req.headers['x-api-secret'] as string },
      data,
    );
    res.status(httpStatus.OK).send(response);
  });
}
