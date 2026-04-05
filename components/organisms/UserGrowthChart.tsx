"use client";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from "recharts";
import { useUIStore } from "@/store/ui.store";
import { Spinner } from "@/components/atoms/Spinner";
import { useDocumentVisible } from "@/hooks/useDocumentVisible";
import { fetchUserGrowth, realtimeQueryOptions, REFETCH_DASHBOARD_MS } from "@/lib/dashboard-api";

export function UserGrowthChart() {
  const { dateRange } = useUIStore();
  const visible = useDocumentVisible();
  const { data = [], isPending, isError } = useQuery({
    queryKey: ["users", "growth", dateRange],
    queryFn: () => fetchUserGrowth(dateRange),
    ...realtimeQueryOptions(visible, REFETCH_DASHBOARD_MS),
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">User Growth</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">New signups vs active users</p>
      </div>
      {isPending ? (
        <div className="flex h-64 items-center justify-center"><Spinner /></div>
      ) : isError ? (
        <div className="flex h-64 items-center justify-center text-sm text-red-500">Could not load user growth.</div>
      ) : data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-zinc-400">No user data yet.</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }} />
            <Legend iconType="circle" iconSize={8} />
            <Area type="monotone" dataKey="active" stroke="#6366f1" strokeWidth={2} fill="url(#activeGrad)" name="Active Users" />
            <Area type="monotone" dataKey="signups" stroke="#10b981" strokeWidth={2} fill="url(#signupGrad)" name="New Signups" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
