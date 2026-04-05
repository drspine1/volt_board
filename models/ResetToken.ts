import { Schema, model, models } from "mongoose";

export interface IResetToken {
  userId: string;
  token: string;
  expiresAt: Date;
}

const ResetTokenSchema = new Schema<IResetToken>({
  userId:    { type: String, required: true },
  token:     { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

// Auto-delete expired tokens
ResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ResetTokenModel = models.ResetToken ?? model<IResetToken>("ResetToken", ResetTokenSchema);
