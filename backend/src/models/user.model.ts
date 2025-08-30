import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId,
  role: "buyer" | "seller";
  name: string;
  email: string;
  walletAddress: string;
  documents: string[]; // Cloudinary URLs
  status: "pending" | "verified" | "rejected" | "banned";
  badges: string[]; // earned badges
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      enum: ["buyer", "seller"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    documents: [
      {
        type: String,
        required: false,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "verified", "rejected", "banned"],
      default: "pending",
    },
    badges: [
      {
        type: String,
        required: false,
      },
    ],
    country: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });
userSchema.index({ country: 1 });

export const User = mongoose.model<IUser>("User", userSchema);
