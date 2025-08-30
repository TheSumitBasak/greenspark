import mongoose, { Document, Schema, Types } from "mongoose";

interface LeaderboardEntry {
  userId: Types.ObjectId;
  amount: number;
  badges: string[];
}

export interface ILeaderboard extends Document {
  month: string; // e.g., "2025-08"
  topProducers: LeaderboardEntry[];
  topBuyers: LeaderboardEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const leaderboardEntrySchema = new Schema<LeaderboardEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    badges: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { _id: false }
);

const leaderboardSchema = new Schema<ILeaderboard>(
  {
    month: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // Format: YYYY-MM
      match: /^\d{4}-\d{2}$/,
    },
    topProducers: [leaderboardEntrySchema],
    topBuyers: [leaderboardEntrySchema],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Indexes for better query performance
leaderboardSchema.index({ month: 1 });
leaderboardSchema.index({ "topProducers.userId": 1 });
leaderboardSchema.index({ "topBuyers.userId": 1 });

export const Leaderboard = mongoose.model<ILeaderboard>(
  "Leaderboard",
  leaderboardSchema
);
