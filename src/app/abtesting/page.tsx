"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { TrendingUp, Pause, Play, RotateCcw, Trophy, FlaskConical } from "lucide-react";

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

function StatPill({ label, a, b, unit = "%", higherIsBetter = true }: { label: string; a: number; b: number; unit?: string; higherIsBetter?: boolean }) {
  const aWins = higherIsBetter ? a > b : a < b;
  const diff = Math.abs(b - a).toFixed(1);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-semibold ${!aWins ? "text-muted-foreground" : "text-foreground"}`}>{a}{unit}</span>
        <span className="text-xs text-muted-foreground">vs</span>
        <span className={`text-sm font-semibold ${aWins ? "text-muted-foreground" : "text-green-400"}`}>{b}{unit}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${!aWins ? "bg-green-500/15 text-green-400" : "bg-red-500/10 text-red-400"}`}>
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
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">A/B Testing</h1>
          <p className="text-sm text-muted-foreground">Compare agent script variants and messaging strategies</p>
        </div>
        <Button size="sm" variant="outline">
          <FlaskConical className="w-4 h-4 mr-1" />
          New Test
        </Button>
      </div>

      {/* Test list */}
      <div className="flex flex-col gap-2">
        {tests.map((test) => (
          <div key={test.id} className={`flex items-center gap-4 p-4 rounded-xl border ${test.id === activeTest.id ? "border-blue-500/50 bg-blue-500/5" : "border-border bg-card"}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{test.name}</span>
                {test.winner && (
                  <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                    <Trophy className="w-3 h-3" /> Variant {test.winner} leading
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Started {test.started} · {test.calls} calls</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded border ${test.status === "running" ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"}`}>
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
        <h2 className="text-base font-semibold">{activeTest.name}</h2>

        {/* Variant cards */}
        <div className="grid grid-cols-2 gap-4">
          {([["a", a], ["b", b]] as const).map(([key, variant]) => (
            <Card key={key} className={key === "b" ? "ring-2 ring-green-500/40" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{variant.name}</CardTitle>
                  {key === "b" && (
                    <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                      <Trophy className="w-3 h-3" /> Leading
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs text-muted-foreground italic leading-relaxed">
                  "{variant.opener}"
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Calls</p>
                    <p className="text-lg font-bold">{variant.calls}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Engage Rate</p>
                    <p className={`text-lg font-bold ${key === "b" && b.engageRate > a.engageRate ? "text-green-400" : ""}`}>{variant.engageRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Qualify Rate</p>
                    <p className={`text-lg font-bold ${key === "b" && b.qualifyRate > a.qualifyRate ? "text-green-400" : ""}`}>{variant.qualifyRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Meeting Rate</p>
                    <p className={`text-lg font-bold ${key === "b" && b.meetingRate > a.meetingRate ? "text-green-400" : ""}`}>{variant.meetingRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg. Duration</p>
                    <p className="text-sm font-medium">{variant.avgDuration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sentiment Score</p>
                    <p className={`text-sm font-medium ${variant.sentiment >= 80 ? "text-green-400" : "text-amber-400"}`}>{variant.sentiment}/100</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Rate Trend</CardTitle>
              <CardDescription>Daily engage % by variant</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                    cursor={{ stroke: "rgba(255,255,255,0.08)" }}
                  />
                  <Line dataKey="a" name="Variant A" stroke="#71717a" strokeWidth={2} dot={false} />
                  <Line dataKey="b" name="Variant B" stroke="#10b981" strokeWidth={2} dot={false} />
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
                <BarChart data={funnelComparison} barGap={4}>
                  <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar dataKey="a" name="Variant A" fill="#71717a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="b" name="Variant B" fill="#10b981" radius={[4, 4, 0, 0]} />
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
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-400 font-medium flex items-center gap-2">
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
