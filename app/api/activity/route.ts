import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { EventModel } from "@/models/Event";

export async function GET() {
  try {
    await connectDB();
    const events = await EventModel.find().sort({ createdAt: -1 }).limit(10).lean();

    const data = events.map((e) => ({
      id: e._id.toString(),
      type: e.type,
      user: e.userName,
      message: e.message,
      timestamp: timeAgo(new Date(e.createdAt)),
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("[activity]", err);
    return NextResponse.json({ error: "Failed to load activity." }, { status: 500 });
  }
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}
