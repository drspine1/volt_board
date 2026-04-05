import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { SubscriptionModel } from "@/models/Subscription";

export async function GET() {
  try {
    await connectDB();

    const [totalUsers, activeUsers, activeSubs, cancelledSubs] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ status: "active" }),
      SubscriptionModel.find({ status: "active" }),
      SubscriptionModel.countDocuments({ status: "cancelled" }),
    ]);

    const mrr = activeSubs.reduce((sum, s) => sum + s.mrr, 0);
    const arpu = activeSubs.length > 0 ? Math.round(mrr / activeSubs.length) : 0;
    const totalSubs = activeSubs.length + cancelledSubs;
    const churnRate = totalSubs > 0 ? ((cancelledSubs / totalSubs) * 100).toFixed(1) : "0.0";

    return NextResponse.json([
      { label: "Monthly Recurring Revenue", value: `$${mrr.toLocaleString()}`, change: 0, trend: "neutral" },
      { label: "Avg Revenue Per User",       value: `$${arpu}`,                change: 0, trend: "neutral" },
      { label: "Total Active Users",         value: activeUsers.toLocaleString(), change: 0, trend: "neutral" },
      { label: "Churn Rate",                 value: `${churnRate}%`,           change: 0, trend: "neutral" },
    ]);
  } catch (err) {
    console.error("[metrics]", err);
    return NextResponse.json({ error: "Failed to load metrics." }, { status: 500 });
  }
}
