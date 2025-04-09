// src/models/team.model.ts
import mongoose, { Document, Schema } from "mongoose";

// Define the interface for a Team document.
export interface ITeam extends Document {
  name: string;
  members: {
    user: mongoose.Types.ObjectId; // Reference to a User document
    role: "admin" | "member";       // Role of the user in the team
  }[];
  projectIds: mongoose.Types.ObjectId[]; // Array of references to Projects
}

// Create the Team schema.
const TeamSchema: Schema<ITeam> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User", // assuming you have a User model defined elsewhere
          required: true
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          required: true
        }
      }
    ],
    projectIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project" // reference to Project model
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITeam>("Team", TeamSchema);