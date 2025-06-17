import { App } from './app';
import AppRoutes from './routes';
import { ValidateEnv } from './utils/validateEnv';
ValidateEnv();

const app = new App(AppRoutes);

app.listen();
