import { redirect } from "next/navigation";
import { getActiveAdmin } from "@/lib/admin-guard";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getActiveAdmin();
  if (!admin) redirect("/login");

  return (
    <div className="flex flex-1 min-h-screen">
      <AdminSidebar name={admin.name} role={admin.role} />
      <main className="flex-1 p-8 px-10">{children}</main>
    </div>
  );
}
