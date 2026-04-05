"use client";
import { LayoutDashboard, Users, BarChart2, Settings, X, Zap } from "lucide-react";
import { NavItem } from "@/components/molecules/NavItem";
import { useUIStore } from "@/store/ui.store";
import { useAuth } from "@/lib/auth";
import { APP_NAME } from "@/lib/branding";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

interface NavEntry {
  href: string;
  label: string;
  icon: LucideIcon;
  minRole: Role;
}

const HIERARCHY: Record<Role, number> = { admin: 3, editor: 2, viewer: 1 };

const nav: NavEntry[] = [
  { href: "/dashboard",           label: "Overview",  icon: LayoutDashboard, minRole: "viewer" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2,        minRole: "viewer" },
  { href: "/dashboard/users",     label: "Users",     icon: Users,            minRole: "admin"  },
  { href: "/dashboard/settings",  label: "Settings",  icon: Settings,         minRole: "editor" },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { user } = useAuth();

  const visibleNav = nav.filter(
    (item) => user && HIERARCHY[user.role] >= HIERARCHY[item.minRole]
  );

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950",
        "lg:static lg:z-auto",
        sidebarOpen ? "w-60 translate-x-0" : "-translate-x-full lg:w-16 lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
          <div className={cn("flex items-center gap-2", !sidebarOpen && "lg:justify-center lg:w-full")}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
              <Zap size={16} className="text-white" />
            </div>
            {sidebarOpen && <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{APP_NAME}</span>}
          </div>
          <button onClick={() => setSidebarOpen(false)} className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Nav — filtered by role */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {visibleNav.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} collapsed={!sidebarOpen} />
          ))}
        </nav>

        {/* Role badge */}
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          {sidebarOpen && user && (
            <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950/40">
              <p className="text-xs font-semibold capitalize text-indigo-700 dark:text-indigo-400">{user.role} Plan</p>
              <p className="mt-0.5 text-xs text-indigo-600/70 dark:text-indigo-500">{user.email}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
