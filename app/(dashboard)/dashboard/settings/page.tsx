"use client";
import { useState } from "react";
import { Topbar } from "@/components/organisms/Topbar";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { useAuth } from "@/lib/auth";
import { CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch(`/api/users/${user?.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      return setError(data.error ?? "Failed to save.");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <>
      <Topbar title="Settings" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-6">

          {/* Profile */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Profile</p>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Role</label>
                <input
                  type="text"
                  value={user?.role ?? ""}
                  disabled
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm capitalize text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-500"
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                {saved && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle size={13} /> Saved
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Appearance */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Appearance</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">Theme</p>
                <p className="text-xs text-zinc-500">Toggle between light and dark mode</p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-xl border border-red-200 bg-white p-6 dark:border-red-900/40 dark:bg-zinc-900">
            <p className="mb-1 text-sm font-semibold text-red-600 dark:text-red-400">Danger Zone</p>
            <p className="mb-4 text-xs text-zinc-500">These actions are irreversible.</p>
            <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
