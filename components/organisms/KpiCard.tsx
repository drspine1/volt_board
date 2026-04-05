"use client";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";
import { Spinner } from "@/components/atoms/Spinner";
import type { KpiMetric } from "@/lib/types";
import { useDocumentVisible } from "@/hooks/useDocumentVisible";
import { fetchMetrics, realtimeQueryOptions, REFETCH_DASHBOARD_MS } from "@/lib/dashboard-api";

function Card({ metric }: { metric: KpiMetric }) {
  const { label, value, change, trend } = metric;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
      <div className={cn(
        "mt-2 flex items-center gap-1 text-xs font-medium",
        trend === "up" && change > 0 ? "text-emerald-600 dark:text-emerald-400" :
        trend === "down" && change < 0 ? "text-red-500 dark:text-red-400" :
        "text-zinc-500"
      )}>
        {trend === "up" ? <TrendingUp size={13} /> : trend === "down" ? <TrendingDown size={13} /> : <Minus size={13} />}
        <span>{change !== 0 ? formatPercent(change) : "—"} vs last period</span>
      </div>
    </div>
  );
}

export function KpiCards() {
  const visible = useDocumentVisible();
  const { data: metrics = [], isPending, isError } = useQuery({
    queryKey: ["metrics"],
    queryFn: fetchMetrics,
    ...realtimeQueryOptions(visible, REFETCH_DASHBOARD_MS),
  });

  if (isPending) {
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex h-28 items-center justify-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <Spinner />
          </div>
        ))}
      </>
    );
  }

  if (isError) {
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex h-28 items-center justify-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <p className="px-2 text-center text-xs text-red-500">Could not load metrics.</p>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {metrics.map((m) => <Card key={m.label} metric={m} />)}
    </>
  );
}
