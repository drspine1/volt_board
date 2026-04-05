import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const range = searchParams.get("range") ?? "30d";

    // Return full user list for the table
    if (type === "table") {
      const users = await UserModel.find({}, "-password").sort({ createdAt: -1 }).lean();
      return NextResponse.json(
        users.map((u) => ({
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          createdAt: new Date(u.createdAt).toISOString().split("T")[0],
          lastActive: new Date(u.lastActive).toLocaleString("en-US", { month: "short", day: "numeric" }),
        }))
      );
    }

    // Return monthly signups vs active for chart
    const monthsBack = range === "7d" ? 2 : range === "ytd" ? 12 : 6;
    const since = new Date();
    since.setMonth(since.getMonth() - monthsBack);

    const users = await UserModel.find({ createdAt: { $gte: since } }).lean();

    const buckets: Record<string, { signups: number }> = {};
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString("en-US", { month: "short" });
      buckets[key] = { signups: 0 };
    }

    for (const u of users) {
      const key = new Date(u.createdAt).toLocaleString("en-US", { month: "short" });
      if (buckets[key]) buckets[key].signups += 1;
    }

    const totalActive = await UserModel.countDocuments({ status: "active" });

    const data = Object.entries(buckets).map(([month, { signups }]) => ({
      month,
      signups,
      active: totalActive,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("[users]", err);
    return NextResponse.json({ error: "Failed to load user data." }, { status: 500 });
  }
}
