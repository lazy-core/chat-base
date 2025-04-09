// src/db.ts
import mongoose from "mongoose";

export async function startMongoDB(): Promise<void> {
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