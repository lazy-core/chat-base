import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, API_PORT } from './config';
import { createServer, Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import { Routes } from './interfaces/routes.interface';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { initSocket } from './config/socket.config';
import { UserSocketHandler } from './sockets/user.socket';
import { ChatSocketHandler } from './sockets/chat.socket';
import { socketAuthMiddleware } from './middlewares/socketAuthMiddleware';
import Container from 'typedi';
import { NotificationService } from './services/notification.service';
import { initCassandra } from './models/index';
import { stream } from './utils/stream';
import { userJwtStrategy, userPassport } from './config/passport';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public httpServer: Server;
  public io: SocketServer;
  public db: void;
  public notificationService = Container.get(NotificationService);

  constructor(routes: Routes[]) {
    this.handleGraceFullShutDown();
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = API_PORT || 3005;

    this.httpServer = createServer(this.app);

    this.io = initSocket(this.httpServer);

    this.app.set('socketio', this.io);

    this.app.disable('x-powered-by');

    this.app.set('trust proxy', 1);

    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSockets();
    this.initializeErrorHandling();
  }

  private initializeDatabase() {
    try {
      initCassandra();
    } catch (e) {
      throw e;
    }
  }

  public listen() {
    this.httpServer.listen(this.port, () => {
      console.info(`=================================`);
      console.info(`======= ENV: ${this.env} =======`);
      console.info(`🚀 App listening on the port ${this.port}`);
      console.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(
      express.json({
        verify(req, res, buf) {
          (req as any).rawBody = buf;
        },
      }),
    );
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use(
      userPassport.initialize({
        userProperty: 'user',
        assignProperty: 'user',
        key: 'user',
      }),
    );
    userPassport.use('user', userJwtStrategy);
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/health', (_, res) => {
        res.status(200).json({ message: 'All is green 🚀' });
      });
      this.app.use('/', route.router);
    });
  }

  private initializeSockets() {
    this.io.use(socketAuthMiddleware);
    this.io.on('connection', socket => {
      console.log('Socket connected', socket.id);
      new UserSocketHandler(this.io, socket);
      new ChatSocketHandler(this.io, socket);
      this.notificationService.initialize(this.io);

      socket.onAny((event, ...args) => {
        console.info(`IO:: Event: ${event}, Args: ${JSON.stringify(args)}`);
      });
    });

    this.io.on('disconnect', socket => {
      console.log('Socket disconnected', socket.id);
    });

    this.io.on('error', error => {
      console.log('Socket error', error);
    });
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }

  private handleGraceFullShutDown() {
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    process.on('uncaughtException', err => {
      console.error('Uncaught Exception:', err);
      console.error(`Uncaught Exception: ${err.message}`);
      process.exit(1);
    });
  }
}
