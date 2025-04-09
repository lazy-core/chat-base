// src/models/project.model.ts
import mongoose, { Document, Schema } from "mongoose";

// Define the interface for a Project document.
export interface IProject extends Document {
  name: string;
  keys: {
    secret: string;
    publishable: string;
  };
}

// Create the Project schema.
const ProjectSchema: Schema<IProject> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true
    },
    keys: {
      secret: {
        type: String,
        required: [true, "Secret key is required"]
      },
      publishable: {
        type: String,
        required: [true, "Publishable key is required"]
      }
    }
  },
  {
    timestamps: true
  }
);

// Export the Project model.
export default mongoose.model<IProject>("Project", ProjectSchema);