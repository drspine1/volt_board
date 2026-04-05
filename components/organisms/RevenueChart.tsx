"use client";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from "recharts";
import { useUIStore } from "@/store/ui.store";
import { Spinner } from "@/components/atoms/Spinner";
import { useDocumentVisible } from "@/hooks/useDocumentVisible";
import { fetchRevenue, realtimeQueryOptions, REFETCH_DASHBOARD_MS } from "@/lib/dashboard-api";

export function RevenueChart() {
  const { dateRange } = useUIStore();
  const visible = useDocumentVisible();
  const { data = [], isPending, isError } = useQuery({
    queryKey: ["revenue", dateRange],
    queryFn: () => fetchRevenue(dateRange),
    ...realtimeQueryOptions(visible, REFETCH_DASHBOARD_MS),
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Revenue Overview</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">MRR and ARPU over time</p>
      </div>
      {isPending ? (
        <div className="flex h-64 items-center justify-center"><Spinner /></div>
      ) : isError ? (
        <div className="flex h-64 items-center justify-center text-sm text-red-500">Could not load revenue.</div>
      ) : data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-zinc-400">No revenue data yet.</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
              formatter={(value, name) =>
                name === "MRR" ? [`$${Number(value).toLocaleString()}`, "MRR"] : [`$${value}`, "ARPU"]
              }
            />
            <Legend iconType="circle" iconSize={8} />
            <Bar yAxisId="left" dataKey="mrr" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.85} name="MRR" />
            <Line yAxisId="right" type="monotone" dataKey="arpu" stroke="#f59e0b" strokeWidth={2}
              dot={{ r: 3, fill: "#f59e0b" }} name="ARPU" />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
