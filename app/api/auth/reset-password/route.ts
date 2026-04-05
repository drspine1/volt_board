import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { ResetTokenModel } from "@/models/ResetToken";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json() as { token: string; password: string };
    if (!token || !password) return NextResponse.json({ error: "Token and password are required." }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

    await connectDB();

    const resetToken = await ResetTokenModel.findOne({ token });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Reset link is invalid or has expired." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await UserModel.findByIdAndUpdate(resetToken.userId, { password: hashed });
    await ResetTokenModel.deleteOne({ token });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}
