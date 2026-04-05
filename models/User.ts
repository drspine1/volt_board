import mongoose, { Schema, model, models } from "mongoose";
import type { Role } from "@/lib/types";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string; // hashed
  role: Role;
  status: "active" | "inactive";
  country: string;
  createdAt: Date;
  lastActive: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:   { type: String, required: true },
    role:       { type: String, enum: ["admin", "editor", "viewer"], default: "viewer" },
    status:     { type: String, enum: ["active", "inactive"], default: "active" },
    country:    { type: String, default: "Unknown" },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent model re-compilation during hot reload
export const UserModel = models.User ?? model<IUser>("User", UserSchema);
