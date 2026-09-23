import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminLoginForm } from "@/components/admin-login-form";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="flex-1 flex items-center justify-center px-5 py-16 bg-[#0F172A]">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center gap-2.5 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-2xl">
            旅
          </div>
          <div className="text-white font-black text-xl">旅しおり 管理者サイト</div>
        </div>

        <div className="bg-white rounded-[18px] p-8 px-7.5">
          <div className="font-black text-lg mb-1">管理者ログイン</div>
          <p className="text-sm text-muted-foreground mb-5.5 leading-relaxed">
            本システムは運営者専用です。ユーザーサイト・プランナーサイトのアカウントではログインできません。アカウントの発行はシステム管理者にご連絡ください。
          </p>
          <AdminLoginForm />
        </div>

        <div className="text-center text-sm text-[#64748B] mt-5">
          &copy; {new Date().getFullYear()} 旅しおり 管理者サイト
        </div>
      </div>
    </div>
  );
}
