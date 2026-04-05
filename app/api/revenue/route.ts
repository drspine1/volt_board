import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SubscriptionModel } from "@/models/Subscription";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") ?? "30d";

    const monthsBack = range === "7d" ? 2 : range === "ytd" ? 12 : 6;
    const since = new Date();
    since.setMonth(since.getMonth() - monthsBack);

    // Group subscriptions by month
    const subs = await SubscriptionModel.find({
      createdAt: { $gte: since },
    }).lean();

    // Build month buckets
    const buckets: Record<string, { mrr: number; count: number }> = {};
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString("en-US", { month: "short" });
      buckets[key] = { mrr: 0, count: 0 };
    }

    for (const sub of subs) {
      if (sub.status !== "active") continue;
      const key = new Date(sub.createdAt).toLocaleString("en-US", { month: "short" });
      if (buckets[key]) {
        buckets[key].mrr += sub.mrr;
        buckets[key].count += 1;
      }
    }

    const data = Object.entries(buckets).map(([month, { mrr, count }]) => ({
      month,
      mrr,
      arpu: count > 0 ? Math.round(mrr / count) : 0,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("[revenue]", err);
    return NextResponse.json({ error: "Failed to load revenue data." }, { status: 500 });
  }
}
