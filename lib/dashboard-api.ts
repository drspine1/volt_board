import type { ActivityEvent, KpiMetric, RevenueDataPoint, User, UserDataPoint } from "@/lib/types";

export const REFETCH_ACTIVITY_MS = 8_000;
export const REFETCH_DASHBOARD_MS = 30_000;

export function realtimeQueryOptions(visible: boolean, intervalMs: number) {
  return {
    refetchInterval: visible ? intervalMs : false,
    refetchOnWindowFocus: true,
    staleTime: 0,
  } as const;
}

export async function fetchActivity(): Promise<ActivityEvent[]> {
  const r = await fetch("/api/activity");
  const data: unknown = await r.json();
  if (!r.ok || !Array.isArray(data)) throw new Error("Failed to load activity");
  return data as ActivityEvent[];
}

export async function fetchMetrics(): Promise<KpiMetric[]> {
  const r = await fetch("/api/metrics");
  const data: unknown = await r.json();
  if (!r.ok || !Array.isArray(data)) throw new Error("Failed to load metrics");
  return data as KpiMetric[];
}

export async function fetchRevenue(range: string): Promise<RevenueDataPoint[]> {
  const r = await fetch(`/api/revenue?range=${range}`);
  const data: unknown = await r.json();
  if (!r.ok || !Array.isArray(data)) throw new Error("Failed to load revenue");
  return data as RevenueDataPoint[];
}

export async function fetchUserGrowth(range: string): Promise<UserDataPoint[]> {
  const r = await fetch(`/api/users?range=${range}`);
  const data: unknown = await r.json();
  if (!r.ok || !Array.isArray(data)) throw new Error("Failed to load users");
  return data as UserDataPoint[];
}

export async function fetchUsersTable(): Promise<User[]> {
  const r = await fetch("/api/users?type=table");
  const data: unknown = await r.json();
  if (!r.ok || !Array.isArray(data)) throw new Error("Failed to load users table");
  return data as User[];
}

export interface GeoRow {
  country: string;
  users: number;
  percentage: number;
}

export async function fetchGeo(): Promise<GeoRow[]> {
  const r = await fetch("/api/geo");
  const data: unknown = await r.json();
  if (!r.ok || !Array.isArray(data)) throw new Error("Failed to load geo");
  return data as GeoRow[];
}
