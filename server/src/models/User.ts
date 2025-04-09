// src/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

// Define the interface for a User document.
// This extends Document so that it includes Mongoose-specific properties.
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Create the schema with validations.
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      // Optionally, add a simple regex for email format validation:
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields.
  }
);

// Export the model.
export default mongoose.model<IUser>("User", UserSchema);