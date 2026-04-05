"use client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/atoms/Badge";
import { Can } from "@/components/atoms/Can";
import { Spinner } from "@/components/atoms/Spinner";
import { Search, Download, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Role, User } from "@/lib/types";
import { useDocumentVisible } from "@/hooks/useDocumentVisible";
import { fetchUsersTable, realtimeQueryOptions, REFETCH_DASHBOARD_MS } from "@/lib/dashboard-api";

const roleBadge: Record<Role, "info" | "warning" | "neutral"> = {
  admin: "info", editor: "warning", viewer: "neutral",
};

const PAGE_SIZE = 8;

export function UsersTable() {
  const queryClient = useQueryClient();
  const visible = useDocumentVisible();
  const { data: users = [], isPending: loading, isError } = useQuery({
    queryKey: ["users", "table"],
    queryFn: fetchUsersTable,
    ...realtimeQueryOptions(visible, REFETCH_DASHBOARD_MS),
  });
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  async function handleDelete(id: string) {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    queryClient.setQueryData<User[]>(["users", "table"], (prev) =>
      (prev ?? []).filter((u) => u.id !== id)
    );
    void queryClient.invalidateQueries({ queryKey: ["users"] });
    void queryClient.invalidateQueries({ queryKey: ["metrics"] });
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 on search
  useEffect(() => { setPage(1); }, [query]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          All Users <span className="ml-1 text-xs font-normal text-zinc-400">({filtered.length})</span>
        </p>
        <div className="flex items-center gap-2">
          <Can role="editor">
            <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800">
              <Download size={13} /> Export CSV
            </button>
          </Can>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="h-8 rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center"><Spinner /></div>
      ) : isError ? (
        <div className="flex h-48 items-center justify-center text-sm text-red-500">Could not load users.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  {["Name", "Email", "Role", "Status", "Joined", "Last Active"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{h}</th>
                  ))}
                  <Can role="admin">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Actions</th>
                  </Can>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {paginated.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400">
                          {u.name[0]}
                        </div>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{u.email}</td>
                    <td className="px-4 py-3"><Badge label={u.role} variant={roleBadge[u.role]} /></td>
                    <td className="px-4 py-3"><Badge label={u.status} variant={u.status === "active" ? "success" : "neutral"} /></td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{u.createdAt}</td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{u.lastActive}</td>
                    <Can role="admin">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </Can>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginated.length === 0 && (
              <p className="py-8 text-center text-sm text-zinc-400">No users found.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-800"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-800"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
