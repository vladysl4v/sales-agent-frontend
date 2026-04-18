"use client";

import { useEffect, useState } from "react";
import { Building2, User, RefreshCw, Phone } from "lucide-react";
import type { HRContact, TwinContact, TwinAccount } from "@/lib/happyrobot";

type Stage = "New" | "Engaged" | "Interested" | "Quote Requested" | "Purchased";

interface ContactCard {
  id: string;
  phone: string;
  summary: string;
  calls: number;
  email?: string;
  lastSeen: string;
  stage: Stage;
  fullName?: string;
  jobTitle?: string;
  accountName?: string;
}

function inferStage(c: HRContact): Stage {
  const s = (c.contact_summary ?? "").toLowerCase();
  const calls = c.interactions_count?.call ?? 0;
  if (s.includes("purchas") || s.includes("last purchase") || s.includes("order")) return "Purchased";
  if (s.includes("quote") || s.includes("email") || s.includes("emailed")) return "Quote Requested";
  if (s.includes("interested") || s.includes("ready-to-buy") || s.includes("request")) return "Interested";
  if (calls >= 2) return "Engaged";
  return "New";
}

function normalizePhone(p: string) {
  return p.replace(/[\s\-().+]/g, "");
}

const stages: Stage[] = ["New", "Engaged", "Interested", "Quote Requested", "Purchased"];

const stageBar: Record<Stage, string> = {
  New: "bg-[#0f0f0f]",
  Engaged: "bg-[#0f0f0f]",
  Interested: "bg-[#6366f1]",
  "Quote Requested": "bg-[#6366f1]",
  Purchased: "bg-[#22c55e]",
};

export default function PipelinePage() {
  const [cards, setCards] = useState<ContactCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/contacts").then((r) => r.json()) as Promise<HRContact[]>,
      fetch("/api/twin/contacts").then((r) => r.json()) as Promise<TwinContact[]>,
      fetch("/api/twin/accounts").then((r) => r.json()) as Promise<TwinAccount[]>,
    ]).then(([contacts, twinContacts, twinAccounts]) => {
      const accountMap = Object.fromEntries(twinAccounts.map((a) => [a.id, a.name]));
      const twinByPhone = Object.fromEntries(
        twinContacts
          .filter((c) => c.phone)
          .map((c) => [normalizePhone(c.phone!), c])
      );

      setCards(
        contacts.map((c) => {
          const twin = twinByPhone[normalizePhone(c.value)];
          return {
            id: c.id,
            phone: c.value,
            summary: c.contact_summary?.slice(0, 120) ?? "",
            calls: c.interactions_count?.call ?? 0,
            email: c.extracted_attributes?.email ?? twin?.email ?? undefined,
            lastSeen: c.last_interaction_date
              ? new Date(c.last_interaction_date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
              : "—",
            stage: inferStage(c),
            fullName: twin?.full_name ?? undefined,
            jobTitle: twin?.job_title ?? undefined,
            accountName: twin?.account_id ? accountMap[twin.account_id] : undefined,
          };
        })
      );
      setLoading(false);
    });
  }, []);

  const handleDrop = (stage: Stage) => {
    if (!dragging) return;
    setCards((prev) => prev.map((c) => (c.id === dragging ? { ...c, stage } : c)));
    setDragging(null);
  };

  const byStage = (stage: Stage) => cards.filter((c) => c.stage === stage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-[#bbb] gap-2 text-[13px]">
        <RefreshCw className="w-4 h-4 animate-spin" /> Loading contacts…
      </div>
    );
  }

  return (
    <div className="px-7 py-6">
      <div className="mb-5">
        <h1 className="text-[16px] font-semibold tracking-[-0.03em] text-[#0f0f0f]">Customer Pipeline</h1>
        <p className="text-[11px] text-[#bbb] mt-0.5">
          {cards.length} contacts · stages inferred from AI summaries · drag to override
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 min-h-[calc(100vh-10rem)]">
        {stages.map((stage) => {
          const stageCards = byStage(stage);
          return (
            <div
              key={stage}
              className="flex flex-col min-w-[240px] w-60 shrink-0"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage)}
            >
              {/* Column header */}
              <div className="mb-2">
                <div className={`h-[4px] rounded-[2px] w-full mb-2 ${stageBar[stage]}`} />
                <div className="flex items-center justify-between px-1">
                  <span className="text-[12px] font-semibold text-[#0f0f0f]">{stage}</span>
                  <span className="text-[11px] text-[#bbb]">{stageCards.length}</span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-2 min-h-[200px]">
                {stageCards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => setDragging(card.id)}
                    className="bg-white rounded-[8px] p-3 border border-[#f0f0f0] cursor-grab active:cursor-grabbing hover:border-[#e0e0e0] transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        {card.fullName ? (
                          <>
                            <p className="text-[13px] font-medium text-[#0f0f0f] leading-tight truncate">{card.fullName}</p>
                            <p className="text-[11px] text-[#bbb] font-mono truncate">{card.phone}</p>
                          </>
                        ) : (
                          <p className="text-[13px] font-medium text-[#0f0f0f] font-mono leading-tight truncate">{card.phone}</p>
                        )}
                        {card.email && (
                          <p className="text-[11px] text-[#999] truncate">{card.email}</p>
                        )}
                      </div>
                      <div className="text-[11px] font-semibold text-[#555] shrink-0">{card.calls}×</div>
                    </div>

                    {card.accountName && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#999]">
                        <Building2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{card.accountName}</span>
                      </div>
                    )}

                    {card.jobTitle && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#999]">
                        <User className="w-3 h-3 shrink-0" />
                        <span className="truncate">{card.jobTitle}</span>
                      </div>
                    )}

                    {!card.fullName && !card.accountName && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#bbb]">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span className="truncate">{card.phone}</span>
                      </div>
                    )}

                    <p className="text-[11px] text-[#999] leading-relaxed line-clamp-3">
                      {card.summary}
                    </p>

                    <p className="text-[11px] text-[#bbb]">Last: {card.lastSeen}</p>
                  </div>
                ))}

                {stageCards.length === 0 && (
                  <div className="border border-dashed border-[#f0f0f0] rounded-[8px] h-24 flex items-center justify-center">
                    <p className="text-[11px] text-[#ccc]">Empty</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
