import { Topbar } from "@/components/organisms/Topbar";
import { UsersTable } from "@/components/organisms/UsersTable";

export default function UsersPage() {
  return (
    <>
      <Topbar title="Users" />
      <main className="flex-1 overflow-y-auto p-6">
        <UsersTable />
      </main>
    </>
  );
}
