"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Kanban,
  MessageSquare,
  GitBranch,
  FlaskConical,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/trace", label: "Agent Trace", icon: GitBranch },
  { href: "/abtesting", label: "A/B Testing", icon: FlaskConical },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] shrink-0 flex flex-col bg-[#0052CC] h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-[rgba(255,255,255,0.1)] shrink-0">
        <div className="flex items-center justify-center w-[30px] h-[30px] rounded-[3px] bg-white shrink-0">
          <span className="text-[#0052CC] text-[12px] font-semibold leading-none">PT</span>
        </div>
        <div>
          <div className="text-[13px] font-semibold text-white tracking-[-0.02em] leading-none">PremiumTire</div>
          <div className="text-[11px] text-[rgba(255,255,255,0.5)] mt-0.5">HappyRobot AI</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2">
        <p className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] uppercase tracking-[0.04em] px-6 pt-3 pb-1">Overview</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 mx-2 px-4 py-2 rounded-[3px] text-[14px] transition-colors my-[1px]",
                active
                  ? "bg-[rgba(255,255,255,0.15)] text-white font-medium"
                  : "text-[rgba(255,255,255,0.85)] font-normal hover:bg-[rgba(255,255,255,0.08)]"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", active ? "opacity-100" : "opacity-75")} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[rgba(255,255,255,0.15)] flex items-center justify-center text-[11px] font-semibold text-white shrink-0">
            FT
          </div>
          <div>
            <div className="text-[12px] font-medium text-white">Frederik T.</div>
            <div className="text-[11px] text-[rgba(255,255,255,0.5)] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00875A] inline-block" />
              Agent active
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
