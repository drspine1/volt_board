import { Schema, model, models } from "mongoose";

export interface ISubscription {
  userId: string;
  plan: "starter" | "pro" | "business" | "enterprise";
  mrr: number; // monthly recurring revenue in dollars
  status: "active" | "cancelled" | "paused";
  createdAt: Date;
  cancelledAt?: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId:      { type: String, required: true },
    plan:        { type: String, enum: ["starter", "pro", "business", "enterprise"], required: true },
    mrr:         { type: Number, required: true },
    status:      { type: String, enum: ["active", "cancelled", "paused"], default: "active" },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

export const SubscriptionModel = models.Subscription ?? model<ISubscription>("Subscription", SubscriptionSchema);
