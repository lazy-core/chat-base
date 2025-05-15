import { config } from "dotenv";
import { resolve } from "path";
const envPath = resolve(__dirname, "../../../.env");

config({ path: envPath });
export const CREDENTIALS = process.env.CREDENTIALS === "true";

export const { NODE_ENV, PORT, JWT_SECRET } = process.env;
