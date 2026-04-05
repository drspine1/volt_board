import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const rows = await UserModel.aggregate<{ _id: string | null; users: number }>([
      { $group: { _id: "$country", users: { $sum: 1 } } },
      { $sort: { users: -1 } },
    ]);
    const total = rows.reduce((s, r) => s + r.users, 0);
    if (total === 0) {
      return NextResponse.json([{ country: "—", users: 0, percentage: 0 }]);
    }
    const data = rows.map((r) => ({
      country: r._id?.trim() ? r._id : "Unknown",
      users: r.users,
      percentage: Math.round((r.users / total) * 1000) / 10,
    }));
    return NextResponse.json(data);
  } catch (err) {
    console.error("[geo]", err);
    return NextResponse.json({ error: "Failed to load geo data." }, { status: 500 });
  }
}
