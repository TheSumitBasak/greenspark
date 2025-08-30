// Export all models
export { User, IUser } from "./user.model";
export { Verifier, IVerifier } from "./verifier.model";
export {
  VerificationSubmission,
  IVerificationSubmission,
} from "./verificationSubmission.model";
export { Order, IOrder } from "./order.model";
export { Leaderboard, ILeaderboard } from "./leaderboard.model";

// Export types for use in other parts of the application
export type UserRole = "buyer" | "seller";
export type UserStatus = "pending" | "verified" | "rejected" | "banned";
export type VerifierStatus = "pending" | "active" | "rejected" | "banned";
export type VerificationStatus = "pending" | "approved" | "rejected";
export type OrderStatus = "open" | "matched" | "completed" | "cancelled";
