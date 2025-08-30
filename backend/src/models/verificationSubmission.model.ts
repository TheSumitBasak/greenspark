import mongoose, { Document, Schema, Types } from "mongoose";

export interface IVerificationSubmission extends Document {
  sellerId: Types.ObjectId;
  amount: number;
  documents: string[]; // Cloudinary URLs
  status: "pending" | "approved" | "rejected";
  verifierId: Types.ObjectId;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const verificationSubmissionSchema = new Schema<IVerificationSubmission>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    documents: [
      {
        type: String,
        required: false,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verifierId: {
      type: Schema.Types.ObjectId,
      ref: "Verifier",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Indexes for better query performance
verificationSubmissionSchema.index({ sellerId: 1 });
verificationSubmissionSchema.index({ verifierId: 1 });
verificationSubmissionSchema.index({ status: 1 });
verificationSubmissionSchema.index({ timestamp: 1 });

export const VerificationSubmission = mongoose.model<IVerificationSubmission>(
  "VerificationSubmission",
  verificationSubmissionSchema
);
