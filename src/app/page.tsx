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
    <div>
      {/* Topbar */}
      <div className="sticky top-0 z-10 h-14 bg-white border-b border-[#DFE1E6] px-8 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-semibold text-[#172B4D]">Dashboard</h1>
          <p className="text-[12px] text-[#6B778C] mt-0.5">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#00875A]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00875A] inline-block" />
          Live
        </div>
      </div>

      <div className="px-8 py-6 space-y-4">
        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((m) => (
            <Card key={m.label}>
              <CardContent className="pt-4 pb-4 px-[18px]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-[#6B778C] uppercase tracking-[0.04em] mb-2">{m.label}</p>
                    <p className="text-[28px] font-bold text-[#172B4D] leading-none">{m.value}</p>
                    <p className={`text-[12px] font-medium mt-1.5 ${m.positive ? "text-[#00875A]" : "text-[#DE350B]"}`}>
                      {m.sub}
                    </p>
                  </div>
                  <m.icon className="w-4 h-4 text-[#6B778C] mt-0.5 shrink-0" />
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
        <div className="grid grid-cols-2 gap-4">
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
                        <span className="text-[11px] text-[#6B778C] w-4 shrink-0 tabular-nums">{i + 1}</span>
                        <div className="min-w-0">
                          <p className="text-[13px] text-[#172B4D] font-medium font-mono truncate">{id}</p>
                          {revenue !== null && !isNaN(revenue) && (
                            <p className="text-[11px] text-[#00875A]">€{revenue.toLocaleString("de-DE")} confirmed</p>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-[#6B778C] shrink-0">{count} thread{count !== 1 ? "s" : ""}</span>
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
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-[#0052CC]" />
                      {i < allInteractions.length - 1 && (
                        <div className="w-px flex-1 bg-[#DFE1E6] my-1" />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className="text-[11px] text-[#6B778C] mb-0.5">
                        {new Date(item.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        {" · "}
                        {item.channel}
                      </p>
                      <p className="text-[13px] text-[#172B4D] line-clamp-2">{item.interaction_summary}</p>
                    </div>
                  </div>
                ))}
                {allInteractions.length === 0 && (
                  <p className="text-[13px] text-[#6B778C]">No recent interactions.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
