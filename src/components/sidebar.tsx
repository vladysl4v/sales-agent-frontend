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
    <aside className="w-[212px] shrink-0 flex flex-col bg-white border-r border-[#f0f0f0] h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-[22px] border-b border-[#f0f0f0]">
        <div className="flex items-center justify-center w-[30px] h-[30px] rounded-[7px] bg-[#0f0f0f] shrink-0">
          <span className="text-white text-[12px] font-semibold leading-none">PT</span>
        </div>
        <div>
          <div className="text-[13px] font-semibold text-[#0f0f0f] tracking-[-0.02em] leading-none">PremiumTire</div>
          <div className="text-[11px] text-[#bbb] mt-0.5">HappyRobot AI</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-5 py-3 space-y-0.5">
        <p className="text-[10px] font-semibold text-[#bbb] uppercase tracking-[0.08em] mb-2 mt-1">Overview</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-[10px] py-[7px] rounded-[7px] text-[13px] transition-colors",
                active
                  ? "bg-[#f5f5f5] text-[#0f0f0f] font-medium"
                  : "text-[#666] font-normal hover:bg-[#f5f5f5] hover:text-[#0f0f0f]"
              )}
            >
              <Icon className="w-[14px] h-[14px] shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#f0f0f0]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#f0f0f0] flex items-center justify-center text-[11px] font-semibold text-[#0f0f0f] shrink-0">
            FT
          </div>
          <div>
            <div className="text-[12px] font-medium text-[#0f0f0f]">Frederik T.</div>
            <div className="text-[11px] text-[#999] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
              Agent active
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
