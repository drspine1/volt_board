"use client";
import { Zap, CheckCircle } from "lucide-react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Reset failed.");
    setDone(true);
  }

  if (!token) return (
    <p className="text-center text-sm text-red-500">Invalid reset link. <Link href="/forgot-password" className="underline">Request a new one.</Link></p>
  );

  return done ? (
    <div className="flex flex-col items-center gap-3 py-4 text-center">
      <CheckCircle size={40} className="text-emerald-500" />
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Password updated</p>
      <Link href="/login" className="mt-2 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
        Sign in with your new password
      </Link>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">New Password</label>
        <input type="password" placeholder="Min. 6 characters" value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Confirm Password</label>
        <input type="password" placeholder="Repeat password" value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setError(""); }}
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60">
        {loading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
            <Zap size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Set new password</h1>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Suspense fallback={<div className="h-40" />}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
