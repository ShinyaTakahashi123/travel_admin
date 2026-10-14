import { redirect } from "next/navigation";
import { getActiveAdmin } from "@/lib/admin-guard";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getActiveAdmin();
  if (!admin) redirect("/login");

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-screen">
      <AdminSidebar name={admin.name} role={admin.role} />
      <main className="flex-1 min-w-0 p-4 px-4 md:p-8 md:px-10">{children}</main>
    </div>
  );
}
