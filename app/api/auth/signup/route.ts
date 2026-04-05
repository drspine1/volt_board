import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { signToken } from "@/lib/jwt";
import type { Role } from "@/lib/types";
import { planForRole } from "@/lib/plan-from-role";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json() as {
      name: string; email: string; password: string; role: Role;
    };

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    await connectDB();

    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    // Detect country from IP
    let country = "Unknown";
    try {
      const geoip = (await import("geoip-lite")).default;
      const forwarded = req.headers.get("x-forwarded-for");
      const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
      const geo = geoip.lookup(ip);
      if (geo?.country) country = geo.country;
    } catch { /* geoip optional */ }

    const user = await UserModel.create({ name, email, password: hashed, role: role ?? "viewer", country });

    const { SubscriptionModel } = await import("@/models/Subscription");
    const { plan, mrr } = planForRole(user.role);
    await SubscriptionModel.create({
      userId: user._id.toString(),
      plan,
      mrr,
      status: "active",
    });

    // Log signup event for the live feed
    const { EventModel } = await import("@/models/Event");
    await EventModel.create({
      type: "signup",
      userId: user._id.toString(),
      userName: user.name,
      message: `New user signed up on ${role ?? "viewer"} plan`,
    });

    const token = await signToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    }, { status: 201 });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("[signup]", err);
    const msg = err instanceof Error ? err.message : "";
    const isDbUnreachable =
      msg.includes("querySrv") ||
      msg.includes("ECONNREFUSED") ||
      msg.includes("ENOTFOUND") ||
      msg.includes("MongoServerSelectionError") ||
      msg.includes("MongoNetworkError");
    if (isDbUnreachable) {
      return NextResponse.json(
        {
          error:
            "Cannot reach the database. Check your internet connection, MongoDB Atlas (cluster running, IP allowlist), and MONGODB_URI in .env.local.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
