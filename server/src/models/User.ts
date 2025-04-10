// src/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

// Define the interface for a User document.
// This extends Document so that it includes Mongoose-specific properties.
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  teamIds: mongoose.Types.ObjectId[];
  sessions: {
    authToken: string;
  }[];
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String
    },
    teamIds: [{
      type: mongoose.Schema.Types.ObjectId,
    }],
    sessions: [{
      authToken: String
    }]
  },
  {
    timestamps: true,
  }
);

// Export the model.
export default mongoose.model<IUser>("User", UserSchema);