"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, UserPlus, TrendingUp, LogIn, Download, XCircle } from "lucide-react";
import type { ActivityEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/atoms/Spinner";
import { useDocumentVisible } from "@/hooks/useDocumentVisible";
import { fetchActivity, realtimeQueryOptions, REFETCH_ACTIVITY_MS } from "@/lib/dashboard-api";

/** How many rows to show before "See more". */
const COLLAPSED_COUNT = 3;

const iconMap = {
  signup:  { icon: UserPlus,   color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" },
  upgrade: { icon: TrendingUp, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"   },
  cancel:  { icon: XCircle,    color: "text-red-500 bg-red-50 dark:bg-red-950/40"             },
  login:   { icon: LogIn,      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40"          },
  export:  { icon: Download,   color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40"       },
};

function EventRow({ event }: { event: ActivityEvent }) {
  const { icon: Icon, color } = iconMap[event.type];
  return (
    <div className="flex items-start gap-3 py-3">
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", color)}>
        <Icon size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{event.user}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{event.message}</p>
      </div>
      <span className="shrink-0 text-xs text-zinc-400">{event.timestamp}</span>
    </div>
  );
}

export function LiveFeed() {
  const [expanded, setExpanded] = useState(false);
  const visible = useDocumentVisible();
  const { data: events = [], isPending, isError } = useQuery({
    queryKey: ["activity"],
    queryFn: fetchActivity,
    ...realtimeQueryOptions(visible, REFETCH_ACTIVITY_MS),
  });

  const canToggle = events.length > COLLAPSED_COUNT;
  const displayed = expanded || !canToggle ? events : events.slice(0, COLLAPSED_COUNT);
  const hiddenCount = events.length - COLLAPSED_COUNT;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Live Activity</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Recent system events</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </div>
      {isPending ? (
        <div className="flex h-40 items-center justify-center"><Spinner /></div>
      ) : isError ? (
        <p className="py-8 text-center text-sm text-red-500">Could not load activity.</p>
      ) : events.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-400">No activity yet.</p>
      ) : (
        <>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {displayed.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </div>
          {canToggle && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 py-2 text-xs font-medium text-indigo-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-indigo-400 dark:hover:bg-zinc-800"
            >
              {expanded ? (
                <>
                  Show less
                  <ChevronUp size={14} strokeWidth={2.25} />
                </>
              ) : (
                <>
                  See more
                  <span className="font-normal text-zinc-500 dark:text-zinc-400">({hiddenCount})</span>
                  <ChevronDown size={14} strokeWidth={2.25} />
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}
