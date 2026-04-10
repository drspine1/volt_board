"use client";
import { Menu, Bell } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { UserMenu } from "@/components/molecules/UserMenu";
import { DateRangeFilter } from "@/components/molecules/DateRangeFilter";

export function Topbar({ title }: { title: string }) {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600" />
          </button>
          <UserMenu />
        </div>
      </div>

      <div className="px-4 pb-4">
        <DateRangeFilter />
      </div>
    </header>
  );
}
