import { Mail } from "lucide-react";
import {
  getTwinContacts,
  getTwinAccounts,
  getTwinPurchases,
  getTwinProducts,
  TwinContact,
  TwinAccount,
} from "@/lib/happyrobot";

const AVATAR_COLORS = [
  "#0052CC", "#00875A", "#6554C0", "#FF8B00",
  "#DE350B", "#00B8D9", "#36B37E", "#8777D9",
];

function initials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function fmt(amount: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);
}

function ScoreBar({ pct }: { pct: number }) {
  const color = pct >= 70 ? "#00875A" : pct >= 30 ? "#FF8B00" : "#6B778C";
  return (
    <div className="w-20 h-3 bg-[#DFE1E6] rounded-[2px] overflow-hidden shrink-0">
      <div className="h-full rounded-[2px]" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

interface RankedContact {
  contact: TwinContact;
  account: TwinAccount | null;
  units: number;
  total: number;
}

interface RankedAccount {
  account: TwinAccount;
  units: number;
  total: number;
}

export default async function LeadList() {
  const [contacts, accounts, purchases, products] = await Promise.all([
    getTwinContacts(),
    getTwinAccounts(),
    getTwinPurchases(),
    getTwinProducts(),
  ]);

  const accountMap = new Map(accounts.map((a) => [a.id, a]));
  const productMap = new Map(products.map((p) => [p.id, parseFloat(p.price) || 0]));

  // Aggregate purchases per contact
  const byContact = new Map<string, { units: number; total: number }>();
  for (const p of purchases) {
    if (!p.contact_id) continue;
    const cur = byContact.get(p.contact_id) ?? { units: 0, total: 0 };
    const qty = p.quantity ?? 0;
    cur.units += qty;
    // prefer stored total/unit_price; fall back to product catalogue price
    const lineTotal = p.total
      ? parseFloat(p.total)
      : p.unit_price
      ? parseFloat(p.unit_price) * qty
      : (productMap.get(p.product_id) ?? 0) * qty;
    cur.total += lineTotal;
    byContact.set(p.contact_id, cur);
  }

  const rankedContacts: RankedContact[] = contacts
    .map((c) => ({
      contact: c,
      account: c.account_id ? (accountMap.get(c.account_id) ?? null) : null,
      units: byContact.get(c.id)?.units ?? 0,
      total: byContact.get(c.id)?.total ?? 0,
    }))
    .sort((a, b) => b.total - a.total || b.units - a.units);

  // Aggregate purchases per company via contact's account_id
  const byAccount = new Map<string, { units: number; total: number }>();
  for (const c of contacts) {
    if (!c.account_id) continue;
    const cp = byContact.get(c.id);
    if (!cp) continue;
    const cur = byAccount.get(c.account_id) ?? { units: 0, total: 0 };
    cur.units += cp.units;
    cur.total += cp.total;
    byAccount.set(c.account_id, cur);
  }

  const rankedAccounts: RankedAccount[] = accounts
    .map((a) => ({
      account: a,
      units: byAccount.get(a.id)?.units ?? 0,
      total: byAccount.get(a.id)?.total ?? 0,
    }))
    .sort((a, b) => b.total - a.total || b.units - a.units);

  const maxContact = rankedContacts[0]?.total || 1;
  const maxAccount = rankedAccounts[0]?.total || 1;

  return (
    <div>
      <div className="sticky top-0 z-10 h-14 bg-white border-b border-[#DFE1E6] px-8 flex items-center shrink-0">
        <h1 className="text-[20px] font-semibold text-[#172B4D]">Lead List</h1>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* ── Contacts ── */}
        <section>
          <p className="text-[11px] font-semibold text-[#6B778C] uppercase tracking-widest mb-3">
            Contacts · ranked by purchase value
          </p>
          <div className="bg-white border border-[#DFE1E6] rounded-[3px] shadow-[0_1px_1px_rgba(9,30,66,0.1)] divide-y divide-[#DFE1E6]">
            {rankedContacts.map((rc, idx) => (
              <div key={rc.contact.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F4F5F7] transition-colors">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
                  style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                >
                  {initials(rc.contact.full_name)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#172B4D] truncate">
                    {rc.contact.full_name ?? rc.contact.phone ?? "Unknown"}
                  </p>
                  <p className="text-[12px] text-[#6B778C] truncate">
                    {[rc.contact.job_title, rc.account?.name].filter(Boolean).join(" · ")}
                  </p>
                </div>

                <div className="text-right shrink-0 w-32">
                  <p className="text-[13px] font-semibold text-[#172B4D]">
                    {rc.total > 0 ? fmt(rc.total) : "—"}
                  </p>
                  <p className="text-[11px] text-[#6B778C]">
                    {rc.units > 0 ? `${rc.units} units` : "no purchases"}
                  </p>
                </div>

                <ScoreBar pct={maxContact > 0 ? Math.round((rc.total / maxContact) * 100) : 0} />

                <div className="flex items-center gap-1.5 shrink-0 w-16 justify-end">
                  {rc.contact.email && (
                    <a
                      href={`mailto:${rc.contact.email}`}
                      className="flex items-center gap-1.5 h-7 px-2.5 rounded-[3px] text-[12px] font-medium text-[#6B778C] border border-[#DFE1E6] bg-white hover:border-[#0052CC] hover:text-[#0052CC] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Mail
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Companies ── */}
        <section>
          <p className="text-[11px] font-semibold text-[#6B778C] uppercase tracking-widest mb-3">
            Companies · ranked by total purchase value
          </p>
          <div className="bg-white border border-[#DFE1E6] rounded-[3px] shadow-[0_1px_1px_rgba(9,30,66,0.1)] divide-y divide-[#DFE1E6]">
            {rankedAccounts.map((ra, idx) => (
              <div key={ra.account.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F4F5F7] transition-colors">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
                  style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                >
                  {initials(ra.account.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#172B4D] truncate">{ra.account.name}</p>
                  <p className="text-[12px] text-[#6B778C] truncate">
                    {[ra.account.country, ra.account.website].filter(Boolean).join(" · ")}
                  </p>
                </div>

                <div className="text-right shrink-0 w-32">
                  <p className="text-[13px] font-semibold text-[#172B4D]">
                    {ra.total > 0 ? fmt(ra.total) : "—"}
                  </p>
                  <p className="text-[11px] text-[#6B778C]">
                    {ra.units > 0 ? `${ra.units} units` : "no purchases"}
                  </p>
                </div>

                <ScoreBar pct={maxAccount > 0 ? Math.round((ra.total / maxAccount) * 100) : 0} />

                <div className="w-16 shrink-0" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
