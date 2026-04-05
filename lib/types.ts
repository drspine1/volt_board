export type Role = "admin" | "editor" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  status: "active" | "inactive";
  createdAt: string;
  lastActive: string;
}

export interface KpiMetric {
  label: string;
  value: string;
  change: number; // percentage
  trend: "up" | "down" | "neutral";
}

export interface RevenueDataPoint {
  month: string;
  mrr: number;
  arpu: number;
}

export interface UserDataPoint {
  month: string;
  signups: number;
  active: number;
}

export interface ActivityEvent {
  id: string;
  type: "signup" | "upgrade" | "cancel" | "login" | "export";
  user: string;
  message: string;
  timestamp: string;
}

export type DateRange = "7d" | "30d" | "ytd";
