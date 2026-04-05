import type { Role } from "@/lib/types";
import type { ISubscription } from "@/models/Subscription";

/** Demo mapping: each new signup gets a subscription so dashboard revenue KPIs are populated. */
export function planForRole(role: Role): Pick<ISubscription, "plan" | "mrr"> {
  switch (role) {
    case "admin":
      return { plan: "business", mrr: 299 };
    case "editor":
      return { plan: "pro", mrr: 99 };
    default:
      return { plan: "starter", mrr: 29 };
  }
}
