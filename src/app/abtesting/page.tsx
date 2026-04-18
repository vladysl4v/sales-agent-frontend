"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Pause, Play, Trophy, FlaskConical } from "lucide-react";

const weeklyTrend = [
  { day: "Mo", a: 18, b: 19 },
  { day: "Di", a: 22, b: 27 },
  { day: "Mi", a: 19, b: 25 },
  { day: "Do", a: 21, b: 31 },
  { day: "Fr", a: 20, b: 34 },
];

const funnelComparison = [
  { stage: "Reached", a: 183, b: 179 },
  { stage: "Engaged", a: 47, b: 73 },
  { stage: "Qualified", a: 21, b: 38 },
  { stage: "Meeting Set", a: 9, b: 16 },
];

const tests = [
  {
    id: "test1",
    name: "Opening Script — Pain vs. Congratulations",
    status: "running",
    started: "14 Apr 2026",
    calls: 362,
    winner: "B",
    variants: {
      a: {
        name: "Variant A — Pain opener",
        opener: "Guten Tag, ich rufe an wegen einer Lösung, die Ihnen bei der Neukundengewinnung helfen kann.",
        calls: 183,
        engageRate: 25.7,
        qualifyRate: 11.5,
        meetingRate: 4.9,
        avgDuration: "3m 12s",
        sentiment: 72,
      },
      b: {
        name: "Variant B — Congratulations opener",
        opener: "Herzlichen Glückwunsch zu Ihrem kürzlichen Projekt! Ich wollte mich kurz vorstellen…",
        calls: 179,
        engageRate: 40.8,
        qualifyRate: 21.2,
        meetingRate: 8.9,
        avgDuration: "4m 38s",
        sentiment: 86,
      },
    },
  },
  {
    id: "test2",
    name: "Email Follow-up Timing — Same Day vs. Next Day",
    status: "paused",
    started: "10 Apr 2026",
    calls: 220,
    winner: null,
    variants: {
      a: {
        name: "Variant A — Same day (2h)",
        opener: "Follow-up email sent 2 hours after first contact",
        calls: 112,
        engageRate: 31.2,
        qualifyRate: 15.1,
        meetingRate: 6.2,
        avgDuration: "—",
        sentiment: 74,
      },
      b: {
        name: "Variant B — Next morning (18h)",
        opener: "Follow-up email sent next morning at 9:00",
        calls: 108,
        engageRate: 29.6,
        qualifyRate: 14.8,
        meetingRate: 5.9,
        avgDuration: "—",
        sentiment: 76,
      },
    },
  },
];

const tooltipStyle = {
  contentStyle: { background: "#ffffff", border: "1px solid #f0f0f0", borderRadius: 8, fontSize: 12, color: "#0f0f0f" },
  cursor: { fill: "rgba(0,0,0,0.03)" },
};

function StatPill({ label, a, b, unit = "%", higherIsBetter = true }: { label: string; a: number; b: number; unit?: string; higherIsBetter?: boolean }) {
  const aWins = higherIsBetter ? a > b : a < b;
  const diff = Math.abs(b - a).toFixed(1);
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-[#999] uppercase tracking-[0.02em]">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-[13px] font-semibold ${!aWins ? "text-[#bbb]" : "text-[#0f0f0f]"}`}>{a}{unit}</span>
        <span className="text-[11px] text-[#bbb]">vs</span>
        <span className={`text-[13px] font-semibold ${aWins ? "text-[#bbb]" : "text-[#0f0f0f]"}`}>{b}{unit}</span>
        <span className={`text-[11px] font-medium ${!aWins ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
          {!aWins ? `+${diff}${unit}` : `-${diff}${unit}`} B
        </span>
      </div>
    </div>
  );
}

export default function ABTestingPage() {
  const activeTest = tests[0];
  const { a, b } = activeTest.variants;

  return (
    <div className="px-7 py-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[16px] font-semibold tracking-[-0.03em] text-[#0f0f0f]">A/B Testing</h1>
          <p className="text-[11px] text-[#bbb] mt-0.5">Compare agent script variants and messaging strategies</p>
        </div>
        <Button size="sm" variant="outline">
          <FlaskConical className="w-3.5 h-3.5 mr-1" />
          New Test
        </Button>
      </div>

      {/* Test list */}
      <div className="flex flex-col gap-2">
        {tests.map((test) => (
          <div
            key={test.id}
            className={`flex items-center gap-4 p-4 rounded-[10px] border transition-colors ${
              test.id === activeTest.id ? "border-[#e0e0e0] bg-white" : "border-[#f0f0f0] bg-white"
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-[#0f0f0f]">{test.name}</span>
                {test.winner && (
                  <span className="flex items-center gap-1 text-[11px] text-[#16a34a]">
                    <Trophy className="w-3 h-3" /> Variant {test.winner} leading
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#bbb] mt-0.5">Started {test.started} · {test.calls} calls</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] px-2 py-1 rounded border ${
                test.status === "running"
                  ? "text-[#16a34a] border-[#bbf7d0]"
                  : "text-[#999] border-[#f0f0f0]"
              }`}>
                {test.status === "running" ? "Running" : "Paused"}
              </span>
              <Button size="icon-sm" variant="ghost">
                {test.status === "running" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Active test detail */}
      <div className="space-y-4">
        <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-[#0f0f0f]">{activeTest.name}</h2>

        {/* Variant cards */}
        <div className="grid grid-cols-2 gap-3">
          {([["a", a], ["b", b]] as const).map(([key, variant]) => (
            <Card key={key} className={key === "b" ? "border-[#bbf7d0]" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{variant.name}</CardTitle>
                  {key === "b" && (
                    <span className="flex items-center gap-1 text-[11px] text-[#16a34a]">
                      <Trophy className="w-3 h-3" /> Leading
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-[#fafafa] rounded-[8px] px-3 py-2 text-[12px] text-[#999] italic leading-relaxed border border-[#f0f0f0]">
                  "{variant.opener}"
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <p className="text-[11px] text-[#bbb] uppercase tracking-[0.02em] mb-1">Calls</p>
                    <p className="text-[20px] font-semibold tracking-[-0.04em] text-[#0f0f0f]">{variant.calls}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#bbb] uppercase tracking-[0.02em] mb-1">Engage Rate</p>
                    <p className={`text-[20px] font-semibold tracking-[-0.04em] ${key === "b" && b.engageRate > a.engageRate ? "text-[#16a34a]" : "text-[#0f0f0f]"}`}>
                      {variant.engageRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#bbb] uppercase tracking-[0.02em] mb-1">Qualify Rate</p>
                    <p className={`text-[20px] font-semibold tracking-[-0.04em] ${key === "b" && b.qualifyRate > a.qualifyRate ? "text-[#16a34a]" : "text-[#0f0f0f]"}`}>
                      {variant.qualifyRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#bbb] uppercase tracking-[0.02em] mb-1">Meeting Rate</p>
                    <p className={`text-[20px] font-semibold tracking-[-0.04em] ${key === "b" && b.meetingRate > a.meetingRate ? "text-[#16a34a]" : "text-[#0f0f0f]"}`}>
                      {variant.meetingRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#bbb] uppercase tracking-[0.02em] mb-1">Avg. Duration</p>
                    <p className="text-[13px] font-medium text-[#0f0f0f]">{variant.avgDuration}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#bbb] uppercase tracking-[0.02em] mb-1">Sentiment</p>
                    <p className={`text-[13px] font-medium ${variant.sentiment >= 80 ? "text-[#16a34a]" : "text-[#999]"}`}>
                      {variant.sentiment}/100
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Rate Trend</CardTitle>
              <CardDescription>Daily engage % by variant</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={weeklyTrend}>
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#ccc" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#ccc" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip {...tooltipStyle} cursor={{ stroke: "rgba(0,0,0,0.06)" }} />
                  <Line dataKey="a" name="Variant A" stroke="#bbb" strokeWidth={1.5} dot={false} />
                  <Line dataKey="b" name="Variant B" stroke="#22c55e" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funnel Comparison</CardTitle>
              <CardDescription>Leads per stage by variant</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={funnelComparison} barGap={3}>
                  <XAxis dataKey="stage" tick={{ fontSize: 9, fill: "#ccc" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#ccc" }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="a" name="Variant A" fill="#e0e0e0" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="b" name="Variant B" fill="#22c55e" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary stats */}
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics Delta</CardTitle>
            <CardDescription>Variant B vs Variant A performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <StatPill label="Engage Rate" a={a.engageRate} b={b.engageRate} />
              <StatPill label="Qualify Rate" a={a.qualifyRate} b={b.qualifyRate} />
              <StatPill label="Meeting Rate" a={a.meetingRate} b={b.meetingRate} />
              <StatPill label="Sentiment Score" a={a.sentiment} b={b.sentiment} unit="" />
            </div>
            <div className="mt-4 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[8px]">
              <p className="text-[13px] text-[#16a34a] font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Recommendation: Promote Variant B — congratulations opener shows +59% engage rate lift with p &lt; 0.05 significance
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
