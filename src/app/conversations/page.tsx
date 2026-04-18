"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Bot, RefreshCw } from "lucide-react";
import type { HRContact, HRInteraction, HRMemory } from "@/lib/happyrobot";

interface ContactWithInteractions extends HRContact {
  interactions?: HRInteraction[];
  memories?: HRMemory[];
}

function totalCalls(c: HRContact) {
  return c.interactions_count?.call ?? 0;
}

function lastSeenLabel(c: HRContact) {
  if (!c.last_interaction_date) return "—";
  return new Date(c.last_interaction_date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConversationsPage() {
  const [contacts, setContacts] = useState<HRContact[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<ContactWithInteractions | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((data) => {
        setContacts(data);
        if (data.length > 0 && !selected) setSelected(data[0].id);
      })
      .finally(() => setLoadingContacts(false));
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;
    const [interactions, memories] = await Promise.all([
      fetch(`/api/contacts/${id}/interactions`).then((r) => r.json()),
      fetch(`/api/contacts/${id}/memories`).then((r) => r.json()),
    ]);
    setDetail({ ...contact, interactions, memories });
    setLoadingDetail(false);
  }, [contacts]);

  useEffect(() => {
    if (selected) loadDetail(selected);
  }, [selected, loadDetail]);

  return (
    <div className="flex h-screen bg-[#F4F5F7]">
      {/* Contact list */}
      <div className="w-72 shrink-0 border-r border-[#DFE1E6] flex flex-col bg-white">
        <div className="px-5 h-14 border-b border-[#DFE1E6] flex flex-col justify-center shrink-0">
          <h1 className="text-[20px] font-semibold text-[#172B4D]">Conversations</h1>
          <p className="text-[12px] text-[#6B778C] mt-0.5">
            {loadingContacts ? "Loading…" : `${contacts.length} contacts`}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[#DFE1E6]">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`w-full text-left px-5 py-3.5 transition-colors ${selected === c.id ? "bg-[#DEEBFF]" : "hover:bg-[#F4F5F7]"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-[#172B4D] truncate font-mono">{c.value}</p>
                  <p className="text-[11px] text-[#6B778C] truncate mt-0.5 leading-relaxed">
                    {c.contact_summary?.slice(0, 70) ?? ""}…
                  </p>
                </div>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[11px] px-1.5 py-0.5 rounded-[3px] border border-[#DFE1E6] text-[#6B778C]">
                  {totalCalls(c)} calls
                </span>
                <span className="text-[11px] text-[#6B778C] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {lastSeenLabel(c)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {loadingDetail && (
          <div className="flex items-center justify-center h-full text-[#6B778C] gap-2 text-[13px]">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading…
          </div>
        )}

        {!loadingDetail && detail && (
          <>
            {/* Header */}
            <div className="px-8 h-14 border-b border-[#DFE1E6] bg-white flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[15px] font-semibold text-[#172B4D] font-mono">{detail.value}</h2>
                <p className="text-[11px] text-[#6B778C] mt-0.5">
                  {totalCalls(detail)} calls · last seen {lastSeenLabel(detail)}
                  {detail.extracted_attributes?.email && (
                    <span className="ml-2">{detail.extracted_attributes.email}</span>
                  )}
                </p>
              </div>
              <span className="text-[11px] px-2 py-1 rounded-[3px] border border-[#DFE1E6] text-[#6B778C]">
                Active
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
              {/* AI Summary */}
              {detail.contact_summary && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Contact Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[13px] text-[#172B4D] leading-relaxed">
                      {detail.contact_summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Memories */}
              {detail.memories && detail.memories.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Persistent Memories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {detail.memories.map((m) => (
                        <div key={m.id} className="flex gap-2 text-[13px]">
                          <span className="text-[#6B778C] mt-0.5 shrink-0">·</span>
                          <span className="text-[#172B4D]">{m.content}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Call History */}
              <Card>
                <CardHeader>
                  <CardTitle>Call History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(detail.interactions ?? []).map((interaction, i) => (
                      <div key={interaction.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full bg-[#0052CC] flex items-center justify-center shrink-0">
                            <Bot className="w-3.5 h-3.5 text-white" />
                          </div>
                          {i < (detail.interactions?.length ?? 0) - 1 && (
                            <div className="w-px flex-1 bg-[#DFE1E6] my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[11px] text-[#6B778C]">
                              {new Date(interaction.timestamp).toLocaleString("en-GB", {
                                day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                              })}
                            </span>
                            <span className="text-[11px] px-1.5 py-0.5 rounded-[3px] border border-[#DFE1E6] text-[#6B778C]">
                              {interaction.channel}
                            </span>
                          </div>
                          <div className="bg-[#F4F5F7] border border-[#DFE1E6] rounded-[3px] px-4 py-2.5 text-[13px] text-[#172B4D] leading-relaxed">
                            {interaction.interaction_summary}
                          </div>
                          {interaction.extracted_attributes &&
                            Object.keys(interaction.extracted_attributes).length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {Object.entries(interaction.extracted_attributes).map(([k, v]) => (
                                  <span key={k} className="text-[11px] px-2 py-0.5 rounded-[3px] border border-[#DFE1E6] text-[#6B778C]">
                                    {k}: {v}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                    {(detail.interactions?.length ?? 0) === 0 && (
                      <p className="text-[13px] text-[#6B778C]">No interactions recorded yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {!loadingDetail && !detail && !loadingContacts && (
          <div className="flex items-center justify-center h-full text-[#6B778C]">
            <div className="text-center">
              <User className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-[13px]">Select a contact</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
