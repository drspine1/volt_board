import { Schema, model, models } from "mongoose";

export type EventType = "signup" | "upgrade" | "cancel" | "login" | "export";

export interface IEvent {
  type: EventType;
  userId: string;
  userName: string;
  message: string;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    type:     { type: String, enum: ["signup", "upgrade", "cancel", "login", "export"], required: true },
    userId:   { type: String, required: true },
    userName: { type: String, required: true },
    message:  { type: String, required: true },
  },
  { timestamps: true }
);

export const EventModel = models.Event ?? model<IEvent>("Event", EventSchema);
