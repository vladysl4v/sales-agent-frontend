"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PhoneCall, Users, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";

const metrics = [
  { label: "Calls Today", value: "47", delta: "+12%", icon: PhoneCall, color: "text-blue-400", up: true },
  { label: "Leads Reached", value: "183", delta: "+8%", icon: Users, color: "text-purple-400", up: true },
  { label: "Meetings Booked", value: "11", delta: "+22%", icon: CheckCircle2, color: "text-green-400", up: true },
  { label: "Avg. Call Duration", value: "3m 24s", delta: "-5%", icon: Clock, color: "text-amber-400", up: false },
];

const funnelData = [
  { value: 183, name: "Reached", fill: "#3b82f6" },
  { value: 94, name: "Engaged", fill: "#8b5cf6" },
  { value: 41, name: "Qualified", fill: "#f59e0b" },
  { value: 18, name: "Meeting Set", fill: "#10b981" },
  { value: 11, name: "Closed", fill: "#22d3ee" },
];

const weeklyData = [
  { day: "Mo", calls: 38, meetings: 7 },
  { day: "Di", calls: 52, meetings: 9 },
  { day: "Mi", calls: 44, meetings: 6 },
  { day: "Do", calls: 61, meetings: 13 },
  { day: "Fr", calls: 47, meetings: 11 },
];

const topLeads = [
  { name: "Maier Bau GmbH", contact: "Stefan Maier", score: 94, status: "Meeting Set", industry: "Construction" },
  { name: "EventPro Berlin", contact: "Julia Schneider", score: 88, status: "Qualified", industry: "Events" },
  { name: "Logistik König AG", contact: "Hans König", score: 82, status: "Engaged", industry: "Logistics" },
  { name: "Hoffmann Druck KG", contact: "Petra Hoffmann", score: 79, status: "Qualified", industry: "Print" },
  { name: "WestBau Projekt", contact: "Ralf Becker", score: 75, status: "Engaged", industry: "Construction" },
];

const activityLog = [
  { time: "14:32", text: "Agent called Maier Bau GmbH — meeting booked for 22 Apr", type: "success" },
  { time: "14:18", text: "Human takeover initiated for EventPro Berlin (escalation)", type: "warn" },
  { time: "13:55", text: "Logistik König AG qualified — moving to pipeline", type: "info" },
  { time: "13:41", text: "Voicemail left for TechBau Süd (3rd attempt)", type: "muted" },
  { time: "13:22", text: "A/B test variant B outperforming A by 18% on open rate", type: "success" },
  { time: "12:58", text: "New lead batch imported: 34 construction companies (Hamburg)", type: "info" },
];

const statusColor: Record<string, string> = {
  "Meeting Set": "bg-green-500/15 text-green-400 border-green-500/30",
  Qualified: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Engaged: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

const activityDot: Record<string, string> = {
  success: "bg-green-400",
  warn: "bg-amber-400",
  info: "bg-blue-400",
  muted: "bg-zinc-500",
};

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Today · Fri, 18 Apr 2026</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-2xl font-bold mt-1">{m.value}</p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${m.up ? "text-green-400" : "text-red-400"}`}>
                    <ArrowUpRight className="w-3 h-3" />
                    {m.delta} vs yesterday
                  </p>
                </div>
                <m.icon className={`w-5 h-5 ${m.color} mt-0.5`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>This week · all channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {funnelData.map((stage, i) => (
                <div key={stage.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{stage.name}</span>
                    <span className="font-medium">{stage.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${(stage.value / funnelData[0].value) * 100}%`,
                        backgroundColor: stage.fill,
                      }}
                    />
                  </div>
                  {i < funnelData.length - 1 && (
                    <p className="text-xs text-muted-foreground text-right">
                      {Math.round((funnelData[i + 1].value / stage.value) * 100)}% pass-through
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Calls placed and meetings booked</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barGap={4}>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar dataKey="calls" name="Calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meetings" name="Meetings" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Leads</CardTitle>
            <CardDescription>Ranked by AI lead score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLeads.map((lead) => (
                <div key={lead.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {lead.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{lead.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{lead.contact} · {lead.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-sm font-semibold text-blue-400">{lead.score}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[lead.status] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>Live agent events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {activityLog.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activityDot[item.type]}`} />
                    {i < activityLog.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                    <p className="text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
