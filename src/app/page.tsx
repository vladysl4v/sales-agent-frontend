import {
  getContacts,
  getContactInteractions,
  getPhoneAgentRuns,
  getTwinPurchases,
  getTwinThreads,
  getTwinThreadProducts,
} from "@/lib/happyrobot";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, Users, Euro, TrendingUp } from "lucide-react";
import DashboardCharts from "./DashboardCharts";

export const revalidate = 30;

export default async function DashboardPage() {
  const [contacts, runs, purchases, threads, threadProducts] = await Promise.all([
    getContacts(),
    getPhoneAgentRuns(),
    getTwinPurchases(),
    getTwinThreads(),
    getTwinThreadProducts(),
  ]);

  const allInteractions = (
    await Promise.all(contacts.map((c) => getContactInteractions(c.id)))
  )
    .flat()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  const today = new Date().toISOString().slice(0, 10);
  const runsToday = runs.filter((r) => r.timestamp.startsWith(today));
  const completedToday = runsToday.filter((r) => r.status === "completed").length;
  const failedTotal = runs.filter((r) => r.status === "failed").length;
  const totalCalls = contacts.reduce((sum, c) => sum + (c.interactions_count?.call ?? 0), 0);

  const avgTokens =
    runs.length > 0
      ? Math.round(runs.reduce((s, r) => s + r.input_tokens + r.output_tokens, 0) / runs.length)
      : 0;

  const totalRevenue = purchases.reduce((sum, p) => {
    const n = parseFloat(p.total);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);
  const confirmedDeals = threads.filter((t) => t.status === "confirmed_purchase").length;
  const inProgressDeals = threads.filter((t) => t.status === "in_progress").length;

  const productCounts: Record<string, number> = {};
  for (const tp of threadProducts) {
    productCounts[tp.product_id] = (productCounts[tp.product_id] ?? 0) + 1;
  }
  const topProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, count]) => ({ id, count }));

  const metrics = [
    {
      label: "Revenue Confirmed",
      value: totalRevenue > 0 ? `€${totalRevenue.toLocaleString("de-DE", { minimumFractionDigits: 0 })}` : "—",
      sub: `${confirmedDeals} deals closed`,
      icon: Euro,
      positive: true,
    },
    {
      label: "Active Deals",
      value: String(inProgressDeals),
      sub: `${threads.length} threads total`,
      icon: TrendingUp,
      positive: true,
    },
    {
      label: "Calls Today",
      value: String(runsToday.length),
      sub: `${completedToday} completed`,
      icon: Phone,
      positive: completedToday > 0,
    },
    {
      label: "Active Contacts",
      value: String(contacts.length),
      sub: `${failedTotal} agent errors`,
      icon: Users,
      positive: true,
    },
  ];

  const hourlyBuckets: Record<string, { calls: number; failed: number }> = {};
  for (const r of runs) {
    const h = new Date(r.timestamp).getHours();
    const key = `${h.toString().padStart(2, "0")}:00`;
    if (!hourlyBuckets[key]) hourlyBuckets[key] = { calls: 0, failed: 0 };
    hourlyBuckets[key].calls++;
    if (r.status === "failed") hourlyBuckets[key].failed++;
  }
  const hourlyData = Object.entries(hourlyBuckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, v]) => ({ hour, ...v }));

  const tokenData = runs
    .slice(0, 10)
    .reverse()
    .map((r, i) => ({ i: i + 1, tokens: r.input_tokens + r.output_tokens, status: r.status }));

  return (
    <div className="px-7 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-semibold tracking-[-0.03em] text-[#0f0f0f]">Dashboard</h1>
          <p className="text-[11px] text-[#bbb] mt-0.5">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[11px] font-medium text-[#15803d]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
          Live
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4 pb-4 px-[18px]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-[#999] uppercase tracking-[0.02em] mb-2">{m.label}</p>
                  <p className="text-[26px] font-semibold tracking-[-0.04em] text-[#0f0f0f] leading-none">{m.value}</p>
                  <p className={`text-[11px] font-medium mt-1.5 ${m.positive ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                    {m.sub}
                  </p>
                </div>
                <m.icon className="w-4 h-4 text-[#bbb] mt-0.5 shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts
        hourlyData={hourlyData}
        tokenData={tokenData}
        avgTokens={avgTokens}
        totalCalls={totalCalls}
        totalRuns={runs.length}
      />

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Top pitched tires */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pitched Tires</CardTitle>
            <CardDescription>Products most frequently in active threads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map(({ id, count }, i) => {
                const purchased = purchases.find((p) => p.product_id === id);
                const revenue = purchased ? parseFloat(purchased.total) : null;
                return (
                  <div key={id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[11px] text-[#bbb] w-4 shrink-0 tabular-nums">{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-[13px] text-[#0f0f0f] font-medium font-mono truncate">{id}</p>
                        {revenue !== null && !isNaN(revenue) && (
                          <p className="text-[11px] text-[#16a34a]">€{revenue.toLocaleString("de-DE")} confirmed</p>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-[#999] shrink-0">{count} thread{count !== 1 ? "s" : ""}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity log */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>Recent AI agent interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {allInteractions.map((item, i) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-[#0f0f0f]" />
                    {i < allInteractions.length - 1 && (
                      <div className="w-px flex-1 bg-[#f7f7f7] my-1" />
                    )}
                  </div>
                  <div className="pb-3">
                    <p className="text-[11px] text-[#bbb] mb-0.5">
                      {new Date(item.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                      {" · "}
                      {item.channel}
                    </p>
                    <p className="text-[13px] text-[#555] line-clamp-2">{item.interaction_summary}</p>
                  </div>
                </div>
              ))}
              {allInteractions.length === 0 && (
                <p className="text-[13px] text-[#bbb]">No recent interactions.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
