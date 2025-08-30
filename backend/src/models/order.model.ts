import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrder extends Document {
  tokenId: string;
  sellerId: Types.ObjectId;
  buyerId: Types.ObjectId;
  amount: number;
  price: number;
  status: "open" | "matched" | "completed" | "cancelled";
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    tokenId: {
      type: String,
      required: true,
      trim: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["open", "matched", "completed", "cancelled"],
      default: "open",
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
orderSchema.index({ tokenId: 1 });
orderSchema.index({ sellerId: 1 });
orderSchema.index({ buyerId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ timestamp: 1 });
orderSchema.index({ price: 1 });
orderSchema.index({ amount: 1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);
