"use client";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";

// Role hierarchy: admin > editor > viewer
const HIERARCHY: Record<Role, number> = { admin: 3, editor: 2, viewer: 1 };

interface CanProps {
  role: Role;          // minimum role required
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Renders children only if the current user's role meets the minimum required role.
 * Usage: <Can role="admin">...</Can>
 */
export function Can({ role, children, fallback = null }: CanProps) {
  const { user } = useAuth();
  if (!user) return <>{fallback}</>;
  return HIERARCHY[user.role] >= HIERARCHY[role] ? <>{children}</> : <>{fallback}</>;
}
