import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { ResetTokenModel } from "@/models/ResetToken";
import { APP_NAME } from "@/lib/branding";
import { Resend } from "resend";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json() as { email: string };
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

    await connectDB();
    const user = await UserModel.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ ok: true });

    // Delete any existing token for this user
    await ResetTokenModel.deleteMany({ userId: user._id.toString() });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await ResetTokenModel.create({ userId: user._id.toString(), token, expiresAt });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const resend = getResend();
    if (!resend) {
      console.warn("[forgot-password] RESEND_API_KEY not set; skipping email");
      return NextResponse.json({ ok: true });
    }

    await resend.emails.send({
      from: `${APP_NAME} <noreply@yourdomain.com>`,
      to: user.email,
      subject: "Reset your password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="font-size:20px;font-weight:700;color:#18181b">Reset your password</h2>
          <p style="color:#71717a;margin:16px 0">Hi ${user.name}, click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
            Reset Password
          </a>
          <p style="color:#a1a1aa;font-size:12px;margin-top:24px">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Failed to send reset email." }, { status: 500 });
  }
}
