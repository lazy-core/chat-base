import { App } from "./app";
import { sequelize } from "./models";
import AppRoutes from "./routes";
import { ValidateEnv } from "./utils/validateEnv";
ValidateEnv();

const app = new App(AppRoutes, sequelize);

app.listen();
