import { Topbar } from "@/components/organisms/Topbar";
import { KpiCards } from "@/components/organisms/KpiCard";
import { RevenueChart } from "@/components/organisms/RevenueChart";
import { UserGrowthChart } from "@/components/organisms/UserGrowthChart";
import { LiveFeed } from "@/components/organisms/LiveFeed";
import { GeoTable } from "@/components/organisms/GeoTable";
import { ErrorBoundary } from "@/components/atoms/ErrorBoundary";

export default function OverviewPage() {
  return (
    <>
      <Topbar title="Overview" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ErrorBoundary label="Failed to load metrics">
            <KpiCards />
          </ErrorBoundary>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ErrorBoundary label="Failed to load revenue chart">
            <RevenueChart />
          </ErrorBoundary>
          <ErrorBoundary label="Failed to load user growth chart">
            <UserGrowthChart />
          </ErrorBoundary>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ErrorBoundary label="Failed to load activity feed">
            <LiveFeed />
          </ErrorBoundary>
          <ErrorBoundary label="Failed to load geo data">
            <GeoTable />
          </ErrorBoundary>
        </div>
      </main>
    </>
  );
}
