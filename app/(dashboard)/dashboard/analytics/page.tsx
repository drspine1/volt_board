import { Topbar } from "@/components/organisms/Topbar";
import { RevenueChart } from "@/components/organisms/RevenueChart";
import { UserGrowthChart } from "@/components/organisms/UserGrowthChart";
import { GeoTable } from "@/components/organisms/GeoTable";
import { KpiCards } from "@/components/organisms/KpiCard";

export default function AnalyticsPage() {
  return (
    <>
      <Topbar title="Analytics" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCards />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6">
          <RevenueChart />
          <UserGrowthChart />
        </div>
        <div className="mt-6">
          <GeoTable />
        </div>
      </main>
    </>
  );
}
