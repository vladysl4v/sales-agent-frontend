"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";

interface HourlyPoint { hour: string; calls: number; failed: number }
interface TokenPoint { i: number; tokens: number; status: string }

interface Props {
  hourlyData: HourlyPoint[];
  tokenData: TokenPoint[];
  avgTokens: number;
  totalCalls: number;
  totalRuns: number;
}

const tooltipStyle = {
  contentStyle: { background: "#ffffff", border: "1px solid #f0f0f0", borderRadius: 8, fontSize: 12, color: "#0f0f0f" },
  cursor: { fill: "rgba(0,0,0,0.03)" },
};

export default function DashboardCharts({ hourlyData, tokenData, avgTokens, totalCalls, totalRuns }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Agent Stats</CardTitle>
          <CardDescription>Aggregate from all runs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {[
              { label: "Total Runs", value: totalRuns },
              { label: "Avg Tokens / Call", value: avgTokens.toLocaleString() },
              { label: "Total Customer Calls", value: totalCalls },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-[#999] uppercase tracking-[0.02em]">{s.label}</span>
                  <span className="text-[13px] font-semibold text-[#0f0f0f]">{s.value}</span>
                </div>
                <div className="h-[3px] rounded-full bg-[#f0f0f0]">
                  <div className="h-[3px] rounded-full bg-[#6366f1]" style={{ width: "100%" }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Calls by Hour</CardTitle>
          <CardDescription>Agent runs across the day</CardDescription>
        </CardHeader>
        <CardContent>
          {hourlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyData} barGap={3}>
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#ccc" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#ccc" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="calls" name="Calls" fill="#0f0f0f" radius={[2, 2, 0, 0]} />
                <Bar dataKey="failed" name="Failed" fill="#fca5a5" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[13px] text-[#bbb]">
              No runs yet today
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Token Usage — Last 10 Runs</CardTitle>
          <CardDescription>Input + output tokens per agent run</CardDescription>
        </CardHeader>
        <CardContent>
          {tokenData.length > 0 ? (
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={tokenData}>
                <XAxis dataKey="i" tick={{ fontSize: 9, fill: "#ccc" }} axisLine={false} tickLine={false} label={{ value: "run", position: "insideRight", offset: 10, style: { fill: "#ccc", fontSize: 9 } }} />
                <YAxis tick={{ fontSize: 9, fill: "#ccc" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#ffffff", border: "1px solid #f0f0f0", borderRadius: 8, fontSize: 12, color: "#0f0f0f" }}
                  cursor={{ stroke: "rgba(0,0,0,0.06)" }}
                />
                <Line
                  dataKey="tokens"
                  name="Tokens"
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  dot={{ r: 3, fill: "#ffffff", stroke: "#6366f1", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[140px] flex items-center justify-center text-[13px] text-[#bbb]">
              No run data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
