import type { RevenueDataPoint, UserDataPoint, ActivityEvent, User, KpiMetric } from "./types";

export const revenueData: RevenueDataPoint[] = [
  { month: "Jul", mrr: 18400, arpu: 42 },
  { month: "Aug", mrr: 21200, arpu: 45 },
  { month: "Sep", mrr: 24800, arpu: 47 },
  { month: "Oct", mrr: 27100, arpu: 49 },
  { month: "Nov", mrr: 31500, arpu: 52 },
  { month: "Dec", mrr: 34200, arpu: 54 },
  { month: "Jan", mrr: 37800, arpu: 56 },
  { month: "Feb", mrr: 41200, arpu: 58 },
  { month: "Mar", mrr: 44900, arpu: 61 },
  { month: "Apr", mrr: 48300, arpu: 63 },
  { month: "May", mrr: 52100, arpu: 65 },
  { month: "Jun", mrr: 56400, arpu: 68 },
];

export const userData: UserDataPoint[] = [
  { month: "Jul", signups: 320, active: 1100 },
  { month: "Aug", signups: 410, active: 1280 },
  { month: "Sep", signups: 390, active: 1420 },
  { month: "Oct", signups: 520, active: 1590 },
  { month: "Nov", signups: 480, active: 1740 },
  { month: "Dec", signups: 610, active: 1920 },
  { month: "Jan", signups: 540, active: 2080 },
  { month: "Feb", signups: 670, active: 2310 },
  { month: "Mar", signups: 720, active: 2560 },
  { month: "Apr", signups: 810, active: 2790 },
  { month: "May", signups: 760, active: 3010 },
  { month: "Jun", signups: 890, active: 3280 },
];

export const activityFeed: ActivityEvent[] = [
  { id: "1", type: "signup", user: "Alice M.", message: "New user signed up on Pro plan", timestamp: "2 min ago" },
  { id: "2", type: "upgrade", user: "Bob K.", message: "Upgraded from Starter to Business", timestamp: "8 min ago" },
  { id: "3", type: "cancel", user: "Carol T.", message: "Cancelled subscription (churn)", timestamp: "15 min ago" },
  { id: "4", type: "login", user: "David R.", message: "Admin login from new device", timestamp: "22 min ago" },
  { id: "5", type: "export", user: "Eva S.", message: "Exported user report (CSV)", timestamp: "34 min ago" },
  { id: "6", type: "signup", user: "Frank L.", message: "New user signed up on Starter plan", timestamp: "41 min ago" },
  { id: "7", type: "upgrade", user: "Grace H.", message: "Upgraded from Pro to Enterprise", timestamp: "1 hr ago" },
  { id: "8", type: "login", user: "Henry P.", message: "Editor login", timestamp: "1 hr ago" },
];

export const usersTable: User[] = [
  { id: "u1", name: "Alice Martin", email: "alice@example.com", role: "admin", status: "active", createdAt: "2024-01-12", lastActive: "2 min ago" },
  { id: "u2", name: "Bob Kim", email: "bob@example.com", role: "editor", status: "active", createdAt: "2024-02-20", lastActive: "8 min ago" },
  { id: "u3", name: "Carol Torres", email: "carol@example.com", role: "viewer", status: "inactive", createdAt: "2024-03-05", lastActive: "3 days ago" },
  { id: "u4", name: "David Reyes", email: "david@example.com", role: "admin", status: "active", createdAt: "2024-01-30", lastActive: "22 min ago" },
  { id: "u5", name: "Eva Schulz", email: "eva@example.com", role: "editor", status: "active", createdAt: "2024-04-14", lastActive: "34 min ago" },
  { id: "u6", name: "Frank Lee", email: "frank@example.com", role: "viewer", status: "active", createdAt: "2024-05-01", lastActive: "41 min ago" },
  { id: "u7", name: "Grace Hall", email: "grace@example.com", role: "editor", status: "active", createdAt: "2024-02-28", lastActive: "1 hr ago" },
  { id: "u8", name: "Henry Park", email: "henry@example.com", role: "viewer", status: "inactive", createdAt: "2024-06-10", lastActive: "2 days ago" },
];

export const kpiMetrics: KpiMetric[] = [
  { label: "Monthly Recurring Revenue", value: "$56,400", change: 8.3, trend: "up" },
  { label: "Avg Revenue Per User", value: "$68", change: 4.6, trend: "up" },
  { label: "Total Active Users", value: "3,280", change: 9.0, trend: "up" },
  { label: "Churn Rate", value: "2.4%", change: -0.3, trend: "down" },
];

export const geoData = [
  { country: "United States", users: 1420, percentage: 43.3 },
  { country: "United Kingdom", users: 480, percentage: 14.6 },
  { country: "Germany", users: 310, percentage: 9.5 },
  { country: "Canada", users: 290, percentage: 8.8 },
  { country: "France", users: 210, percentage: 6.4 },
  { country: "Australia", users: 180, percentage: 5.5 },
  { country: "Other", users: 390, percentage: 11.9 },
];
