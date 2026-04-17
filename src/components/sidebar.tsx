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
  Bot,
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
    <aside className="w-56 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-sidebar-foreground leading-none">SDR-AI</div>
          <div className="text-xs text-muted-foreground mt-0.5">HappyRobot</div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">F</div>
          <div>
            <div className="text-xs font-medium text-sidebar-foreground">Frederik T.</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
              Agent active
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
