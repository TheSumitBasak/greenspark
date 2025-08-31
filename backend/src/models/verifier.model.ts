import mongoose, { Document, Schema } from "mongoose";

export interface IVerifier extends Document {
  organizationName: string;
  walletAddress: string;
  email: string;
  documents: string[]; // Cloudinary URLs for verification
  status: "pending" | "active" | "rejected" | "banned";
  voteStarted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const verifierSchema = new Schema<IVerifier>(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    documents: [
      {
        type: String,
        required: false,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "banned"],
      default: "pending",
    },
    voteStarted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Indexes for better query performance
verifierSchema.index({ walletAddress: 1 });
verifierSchema.index({ status: 1 });
verifierSchema.index({ organizationName: 1 });

export const Verifier = mongoose.model<IVerifier>("Verifier", verifierSchema);
