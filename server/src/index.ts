import express, { Request, Response } from 'express';
import mongoose from "mongoose";

import { responseErrorHandler } from "./middlewares/error";

import routes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(responseErrorHandler)

async function startMongoDB(): Promise<void> {
  const mongoUrl = `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@mongodb:27017/${process.env.MONGO_DB_NAME}?authSource=admin&retryWrites=true&w=majority`
  
  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB Connection Successful");
  } catch (error: any) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
}

async function startServer() {
  await startMongoDB();

  app.use('/', routes)

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();