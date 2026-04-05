"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui.store";
import { useEffect } from "react";
import type { DateRange } from "@/lib/types";
import { cn } from "@/lib/utils";

const options: { label: string; value: DateRange }[] = [
  { label: "7 days",      value: "7d"  },
  { label: "30 days",     value: "30d" },
  { label: "Year to date", value: "ytd" },
];

export function DateRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dateRange, setDateRange } = useUIStore();

  // Sync URL → store on mount
  useEffect(() => {
    const param = searchParams.get("range") as DateRange | null;
    if (param && ["7d", "30d", "ytd"].includes(param)) setDateRange(param);
  }, []);

  function handleChange(value: DateRange) {
    setDateRange(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", value);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => handleChange(o.value)}
          className={cn(
            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
            dateRange === o.value
              ? "bg-indigo-600 text-white"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
