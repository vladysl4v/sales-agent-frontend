import { Mail, Phone } from "lucide-react";
import {
  getTwinContacts,
  getTwinAccounts,
  getTwinThreads,
  getContacts,
  TwinContact,
  TwinAccount,
} from "@/lib/happyrobot";

const AVATAR_COLORS = [
  "#0052CC", "#00875A", "#6554C0", "#FF8B00",
  "#DE350B", "#00B8D9", "#36B37E", "#8777D9",
];

const KNOWN_LINKEDIN: Record<string, string> = {
  "Liam Carter": "https://phantombuster.com/8494293471866236/phantoms/212276908402482/console",
  "Alex Murchinger": "https://www.linkedin.com/in/alex-murchinger/",
  "Sophie Müller": "https://www.linkedin.com/in/sophie-mueller-de/",
  "Thomas Becker": "https://www.linkedin.com/in/thomas-becker-sales/",
  "Janine Wolf": "https://www.linkedin.com/in/janine-wolf-89b3aa/",
  "Marco Ricci": "https://www.linkedin.com/in/marco-ricci-italy/",
  "Priya Nair": "https://www.linkedin.com/in/priya-nair-b2b/",
  "Felix Hartmann": "https://www.linkedin.com/in/felix-hartmann-muc/",
  "Clara Jensen": "https://www.linkedin.com/in/clara-jensen-dk/",
  "David Osei": "https://www.linkedin.com/in/david-osei-gh/",
};

function linkedinUrl(name: string | null, fromAttr: string | null): string {
  if (fromAttr) return fromAttr;
  if (!name) return "https://www.linkedin.com/search/results/people/";
  if (KNOWN_LINKEDIN[name]) return KNOWN_LINKEDIN[name];
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return `https://www.linkedin.com/in/${slug}/`;
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function normalizePhone(p: string) {
  return p.replace(/[\s\-().+]/g, "");
}

function ScoreBar({ pct, color }: { pct: number; color?: string }) {
  const c = color ?? (pct >= 70 ? "#00875A" : pct >= 30 ? "#FF8B00" : "#6B778C");
  return (
    <div className="w-20 h-3 bg-[#DFE1E6] rounded-[2px] overflow-hidden shrink-0">
      <div className="h-full rounded-[2px]" style={{ width: `${pct}%`, backgroundColor: c }} />
    </div>
  );
}

function rankBar(idx: number, total: number): { pct: number; color: string } {
  const ratio = total > 1 ? idx / (total - 1) : 0;
  const pct = Math.round(100 - ratio * 88); // 100 → 12
  const color = ratio < 0.34 ? "#00875A" : ratio < 0.67 ? "#FF8B00" : "#DE350B";
  return { pct, color };
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface RankedContact {
  contact: TwinContact;
  account: TwinAccount | null;
  calls: number;
  linkedin: string;
}

interface RankedAccount {
  account: TwinAccount;
  inboundCalls: number;
  callerCount: number;
}

export default async function LeadList() {
  const [contacts, accounts, threads, hrContacts] = await Promise.all([
    getTwinContacts(),
    getTwinAccounts(),
    getTwinThreads(),
    getContacts(),
  ]);

  const accountMap = new Map(accounts.map((a) => [a.id, a]));

  // Match HR contacts to Twin contacts by phone
  const twinByPhone = new Map(
    contacts.filter((c) => c.phone).map((c) => [normalizePhone(c.phone!), c])
  );

  const callsByContact = new Map<string, number>();
  const linkedinByContact = new Map<string, string>();

  for (const hr of hrContacts) {
    const twin = twinByPhone.get(normalizePhone(hr.value));
    if (!twin) continue;

    const calls = hr.interactions_count?.call ?? 0;
    callsByContact.set(twin.id, (callsByContact.get(twin.id) ?? 0) + calls);

    // Pick up LinkedIn from any of the common attribute key names
    const attrs = hr.extracted_attributes ?? {};
    const li =
      attrs.linkedin ??
      attrs.linkedin_url ??
      attrs.linkedin_profile ??
      attrs.LinkedIn ??
      null;
    if (li) linkedinByContact.set(twin.id, li);
  }

  // Contacts with open threads (still to contact)
  const openContactIds = new Set(
    threads
      .filter((t) => t.status === "new" || t.status === "in_progress")
      .flatMap((t) => (t.primary_contact_id ? [t.primary_contact_id] : []))
  );

  const alexMurchinger: RankedContact = {
    contact: {
      id: "__alex_murchinger__",
      account_id: null,
      full_name: "Alex Murchinger",
      job_title: "Business Development",
      phone: null,
      email: "alexmmuc25@gmail.com",
      created_at: "",
    },
    account: null,
    calls: 0,
    linkedin: "https://www.linkedin.com/in/alex-murchinger/",
  };

  // Outbound: all contacts with a name, excluding Karreem Battles
  const dbContacts: RankedContact[] = contacts
    .filter((c) => !!c.full_name && c.full_name !== "Karreem Battles")
    .map((c) => ({
      contact: c,
      account: c.account_id ? (accountMap.get(c.account_id) ?? null) : null,
      calls: callsByContact.get(c.id) ?? 0,
      linkedin: linkedinUrl(c.full_name, linkedinByContact.get(c.id) ?? null),
    }))
    .sort((a, b) => {
      const aOpen = openContactIds.has(a.contact.id) ? 1 : 0;
      const bOpen = openContactIds.has(b.contact.id) ? 1 : 0;
      return bOpen - aOpen || b.calls - a.calls;
    });

  // Pin Liam Carter first, Alex Murchinger second, rest follows
  const liamIdx = dbContacts.findIndex((r) => r.contact.full_name === "Liam Carter");
  const liam = liamIdx >= 0 ? dbContacts.splice(liamIdx, 1) : [];
  const rankedContacts: RankedContact[] = [...liam, alexMurchinger, ...dbContacts];

  // Inbound: aggregate call volume per company
  const callsByAccount = new Map<string, { total: number; callers: Set<string> }>();
  for (const c of contacts) {
    if (!c.account_id) continue;
    const calls = callsByContact.get(c.id) ?? 0;
    if (calls === 0) continue;
    const cur = callsByAccount.get(c.account_id) ?? { total: 0, callers: new Set() };
    cur.total += calls;
    cur.callers.add(c.id);
    callsByAccount.set(c.account_id, cur);
  }

  const rankedAccounts: RankedAccount[] = accounts
    .map((a) => {
      const agg = callsByAccount.get(a.id);
      return {
        account: a,
        inboundCalls: agg?.total ?? 0,
        callerCount: agg?.callers.size ?? 0,
      };
    })
    .sort((a, b) => b.inboundCalls - a.inboundCalls || b.callerCount - a.callerCount);

  const maxCalls = Math.max(...rankedContacts.map((r) => r.calls), 1);
  const maxInbound = Math.max(...rankedAccounts.map((r) => r.inboundCalls), 1);

  return (
    <div>
      <div className="sticky top-0 z-10 h-14 bg-white border-b border-[#DFE1E6] px-8 flex items-center shrink-0">
        <h1 className="text-[20px] font-semibold text-[#172B4D]">Lead List</h1>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* ── Outbound Contacts ── */}
        <section>
          <p className="text-[11px] font-semibold text-[#6B778C] uppercase tracking-widest mb-3">
            Outbound · {rankedContacts.length} contacts
          </p>
          <div className="bg-white border border-[#DFE1E6] rounded-[3px] shadow-[0_1px_1px_rgba(9,30,66,0.1)] divide-y divide-[#DFE1E6]">
            {rankedContacts.map((rc, idx) => (
              <div key={rc.contact.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F4F5F7] transition-colors">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
                  style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                >
                  {initials(rc.contact.full_name!)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#172B4D] truncate">
                    {rc.contact.full_name}
                  </p>
                  <p className="text-[12px] text-[#6B778C] truncate">
                    {[rc.contact.job_title, rc.account?.name].filter(Boolean).join(" · ")}
                  </p>
                </div>

                <div className="text-right shrink-0 w-28">
                  {rc.calls > 0 && (
                    <>
                      <p className="text-[13px] font-semibold text-[#172B4D]">{rc.calls} calls</p>
                      <p className="text-[11px] text-[#6B778C]">interactions</p>
                    </>
                  )}
                </div>

                <ScoreBar {...rankBar(idx, rankedContacts.length)} />

                <div className="flex items-center gap-3 shrink-0 ml-4 justify-end">
                  <a
                    href={rc.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 h-7 px-2.5 rounded-[3px] text-[12px] font-medium text-[#6B778C] border border-[#DFE1E6] bg-white hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors whitespace-nowrap"
                  >
                    <LinkedInIcon />
                    LinkedIn Activity
                  </a>
                  {(rc.contact.email || rc.contact.full_name === "Alex Murchinger") && (
                    <a
                      href={
                        rc.contact.full_name === "Alex Murchinger"
                          ? "https://hook.eu1.make.com/ibm7x8rxbj7yqh6c6oi43t8hlxi7dga3?email=alexmmuc25@gmail.com"
                          : `mailto:${rc.contact.email}`
                      }
                      target={rc.contact.full_name === "Alex Murchinger" ? "_blank" : undefined}
                      rel={rc.contact.full_name === "Alex Murchinger" ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-1.5 h-7 px-2.5 rounded-[3px] text-[12px] font-medium text-[#6B778C] border border-[#DFE1E6] bg-white hover:border-[#0052CC] hover:text-[#0052CC] transition-colors whitespace-nowrap"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Mail Activity
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Inbound Potential · Companies ── */}
        <section>
          <p className="text-[11px] font-semibold text-[#6B778C] uppercase tracking-widest mb-3">
            Inbound Potential · Companies ranked by call volume
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

                <div className="text-right shrink-0 w-28">
                  <p className="text-[13px] font-semibold text-[#172B4D]">
                    {ra.inboundCalls > 0 ? `${ra.inboundCalls} calls` : "—"}
                  </p>
                  <p className="text-[11px] text-[#6B778C]">
                    {ra.callerCount > 0
                      ? `${ra.callerCount} ${ra.callerCount === 1 ? "caller" : "callers"}`
                      : "no inbound"}
                  </p>
                </div>

                <ScoreBar pct={maxInbound > 0 ? Math.round((ra.inboundCalls / maxInbound) * 100) : 0} />

                <div className="flex items-center gap-1.5 shrink-0 w-16 justify-end">
                  <Phone className="w-3.5 h-3.5 text-[#6B778C]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
