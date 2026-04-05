"use client";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/atoms/Spinner";
import { useDocumentVisible } from "@/hooks/useDocumentVisible";
import { fetchGeo, realtimeQueryOptions, REFETCH_DASHBOARD_MS } from "@/lib/dashboard-api";

export function GeoTable() {
  const visible = useDocumentVisible();
  const { data = [], isPending, isError } = useQuery({
    queryKey: ["geo"],
    queryFn: fetchGeo,
    ...realtimeQueryOptions(visible, REFETCH_DASHBOARD_MS),
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Geographic Distribution</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Users by country</p>
      </div>
      {isPending ? (
        <div className="flex h-40 items-center justify-center"><Spinner /></div>
      ) : isError ? (
        <div className="flex h-40 items-center justify-center text-sm text-red-500">Could not load geo data.</div>
      ) : (
        <div className="space-y-3">
          {data.map((row) => (
            <div key={row.country}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{row.country}</span>
                <span className="text-zinc-500">{row.users.toLocaleString()} · {row.percentage}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${row.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
