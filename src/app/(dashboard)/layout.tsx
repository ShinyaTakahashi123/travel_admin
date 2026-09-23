import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex flex-1 min-h-screen">
      <AdminSidebar name={session.user.name ?? ""} role={session.user.role} />
      <main className="flex-1 p-8 px-10">{children}</main>
    </div>
  );
}
