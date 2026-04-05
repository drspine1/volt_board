import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();
    await UserModel.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[delete user]", err);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });

    const { id } = await params;
    // Users can only update themselves unless admin
    if (payload.id !== id && payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = await req.json() as { name?: string; email?: string };
    await connectDB();
    const updated = await UserModel.findByIdAndUpdate(id, body, { new: true, select: "-password" });
    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error("[update user]", err);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}
