"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  {
    href: "/",
    label: "ダッシュボード",
    icon: (
      <>
        <rect x="3" y="12" width="4" height="8" />
        <rect x="10" y="7" width="4" height="13" />
        <rect x="17" y="3" width="4" height="17" />
      </>
    ),
  },
  {
    href: "/accounts",
    label: "アカウント管理",
    icon: (
      <>
        <path d="M12 3l7 3.5v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-5L12 3z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    href: "/users",
    label: "ユーザー一覧",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M2 20c0-3.3 3-6 7-6s7 2.7 7 6" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M15 14c2.8.3 5 2.6 5 6" />
      </>
    ),
  },
  {
    href: "/planners",
    label: "プランナー一覧",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="12" r="2" />
        <path d="M13 10h5M13 14h3" />
      </>
    ),
  },
  {
    href: "/itineraries",
    label: "しおり管理",
    icon: <path d="M4 4h11a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2z" />,
  },
  {
    href: "/reports",
    label: "通報管理",
    icon: (
      <>
        <path d="M12 2a1 1 0 0 1 1 1v1.06A7 7 0 0 1 19 11v3.5l1.5 2.5h-17L5 14.5V11a7 7 0 0 1 6-6.94V3a1 1 0 0 1 1-1z" />
        <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
      </>
    ),
  },
  {
    href: "/master",
    label: "マスタ管理",
    icon: (
      <>
        <path d="M20.6 12.4L12 21 3 12l8.6-8.6H20a1 1 0 0 1 1 1v8z" />
        <circle cx="16" cy="8" r="1.2" />
      </>
    ),
  },
];

const ROLE_LABEL: Record<string, string> = {
  super: "スーパー管理者",
  staff: "一般管理者",
};

export function AdminSidebar({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-[230px] flex-shrink-0 bg-[#1E293B] py-5.5 flex flex-col justify-between h-full">
      <div className="flex items-center gap-2.5 px-6 pb-6.5">
        <div className="w-[30px] h-[30px] rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">
          旅
        </div>
        <span className="text-white font-bold text-sm">旅しおり 管理者サイト</span>
      </div>
      <nav className="flex flex-col flex-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-2.5 text-[13px] font-medium ${
                active
                  ? "text-white bg-primary/[.18] border-r-[3px] border-primary"
                  : "text-muted-foreground"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-6 pt-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[11px] font-black">
            {name.charAt(0)}
          </div>
          <div>
            <div className="text-white text-xs font-bold">{name}</div>
            <div className="text-[#64748B] text-[10px]">{ROLE_LABEL[role] ?? role}</div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2.5 text-muted-foreground text-xs font-bold pb-1"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          ログアウト
        </button>
      </div>
    </aside>
  );
}
