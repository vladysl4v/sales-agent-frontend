"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Bot, RefreshCw, MessageSquare, Phone, CheckCircle2, XCircle } from "lucide-react";
import type { HRContact, HRInteraction, HRMemory, HRRun, ParsedMessage } from "@/lib/happyrobot";

type Selection = { type: "contact"; id: string } | { type: "run"; id: string } | null;

interface ContactDetail extends HRContact {
  interactions?: HRInteraction[];
  memories?: HRMemory[];
}

function totalCalls(c: HRContact) {
  return c.interactions_count?.call ?? 0;
}

function ChatDetail({ run }: { run: HRRun }) {
  const [messages, setMessages] = useState<ParsedMessage[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMessages(null);
    setLoading(true);
    fetch(`/api/runs/${run.id}/transcript`)
      .then((r) => r.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [run.id]);

  return (
    <>
      <div className="px-8 h-14 border-b border-[#DFE1E6] bg-white flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-[15px] font-semibold text-[#172B4D] font-mono">{run.id.slice(0, 8)}…</h2>
          <p className="text-[11px] text-[#6B778C] mt-0.5">
            Text session · {new Date(run.timestamp).toLocaleString("en-GB", {
              day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <span className={`text-[11px] px-2 py-1 rounded-[3px] border ${
          run.status === "completed" ? "text-[#00875A] border-[#ABF5D1]"
          : run.status === "failed" ? "text-[#DE350B] border-[#FFBDAD]"
          : "text-[#6B778C] border-[#DFE1E6]"
        }`}>{run.status}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {loading && (
          <div className="flex items-center gap-2 text-[13px] text-[#6B778C]">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading messages…
          </div>
        )}
        {!loading && messages?.length === 0 && (
          <p className="text-[13px] text-[#6B778C]">No messages found for this session.</p>
        )}
        {!loading && messages && messages.length > 0 && (
          <div className="space-y-3">
            {messages.map((msg, i) =>
              msg.role === "event" ? (
                <div key={i} className="flex justify-center">
                  <span className="text-[11px] text-[#6B778C] px-2 py-0.5 rounded-[3px] border border-[#DFE1E6] bg-[#F4F5F7]">
                    {msg.content}
                  </span>
                </div>
              ) : (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-[#0052CC] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[70%] rounded-[3px] px-3 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#DEEBFF] text-[#172B4D]"
                      : "bg-white border border-[#DFE1E6] text-[#172B4D]"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}

function ContactDetail({ detail }: { detail: ContactDetail }) {
  return (
    <>
      <div className="px-8 h-14 border-b border-[#DFE1E6] bg-white flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-[15px] font-semibold text-[#172B4D] font-mono">{detail.value}</h2>
          <p className="text-[11px] text-[#6B778C] mt-0.5">
            {totalCalls(detail)} calls
            {detail.last_interaction_date && (
              <> · last seen {new Date(detail.last_interaction_date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</>
            )}
            {detail.extracted_attributes?.email && <span className="ml-2">{detail.extracted_attributes.email}</span>}
          </p>
        </div>
        <span className="text-[11px] px-2 py-1 rounded-[3px] border border-[#DFE1E6] text-[#6B778C]">Active</span>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {detail.contact_summary && (
          <Card>
            <CardHeader><CardTitle>AI Contact Summary</CardTitle></CardHeader>
            <CardContent>
              <p className="text-[13px] text-[#172B4D] leading-relaxed">{detail.contact_summary}</p>
            </CardContent>
          </Card>
        )}

        {detail.memories && detail.memories.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Persistent Memories</CardTitle></CardHeader>
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

        <Card>
          <CardHeader><CardTitle>Call History</CardTitle></CardHeader>
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
  );
}

export default function ConversationsPage() {
  const [contacts, setContacts] = useState<HRContact[]>([]);
  const [textRuns, setTextRuns] = useState<HRRun[]>([]);
  const [selection, setSelection] = useState<Selection>(null);
  const [contactDetail, setContactDetail] = useState<ContactDetail | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((data: HRContact[]) => {
        setContacts(data);
        if (data.length > 0) setSelection((s) => s ?? { type: "contact", id: data[0].id });
      })
      .finally(() => setLoadingContacts(false));

    fetch("/api/text-runs")
      .then((r) => r.json())
      .then((data: HRRun[]) => {
        const runs = Array.isArray(data) ? data : [];
        setTextRuns(runs);
        if (runs.length > 0) setSelection((s) => s ?? { type: "run", id: runs[0].id });
      });
  }, []);

  const loadContactDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    const contact = contacts.find((c) => c.id === id);
    if (!contact) { setLoadingDetail(false); return; }
    const [interactions, memories] = await Promise.all([
      fetch(`/api/contacts/${id}/interactions`).then((r) => r.json()),
      fetch(`/api/contacts/${id}/memories`).then((r) => r.json()),
    ]);
    setContactDetail({ ...contact, interactions, memories });
    setLoadingDetail(false);
  }, [contacts]);

  useEffect(() => {
    if (selection?.type === "contact") {
      loadContactDetail(selection.id);
    } else {
      setContactDetail(null);
    }
  }, [selection, loadContactDetail]);

  const totalItems = contacts.length + textRuns.length;

  return (
    <div className="flex h-screen bg-[#F4F5F7]">
      {/* Sidebar */}
      <div className="w-72 shrink-0 border-r border-[#DFE1E6] flex flex-col bg-white">
        <div className="px-5 h-14 border-b border-[#DFE1E6] flex flex-col justify-center shrink-0">
          <h1 className="text-[20px] font-semibold text-[#172B4D]">Conversations</h1>
          <p className="text-[12px] text-[#6B778C] mt-0.5">
            {loadingContacts ? "Loading…" : `${totalItems} conversations`}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Call contacts */}
          {contacts.length > 0 && (
            <>
              <div className="px-5 py-2 flex items-center gap-1.5 border-b border-[#DFE1E6] bg-[#F4F5F7]">
                <Phone className="w-3 h-3 text-[#6B778C]" />
                <span className="text-[10px] font-semibold text-[#6B778C] uppercase tracking-[0.06em]">Phone calls</span>
              </div>
              <div className="divide-y divide-[#DFE1E6]">
                {contacts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelection({ type: "contact", id: c.id })}
                    className={`w-full text-left px-5 py-3.5 transition-colors ${
                      selection?.type === "contact" && selection.id === c.id ? "bg-[#DEEBFF]" : "hover:bg-[#F4F5F7]"
                    }`}
                  >
                    <p className="text-[13px] font-medium text-[#172B4D] truncate font-mono">{c.value}</p>
                    <p className="text-[11px] text-[#6B778C] truncate mt-0.5 leading-relaxed">
                      {c.contact_summary?.slice(0, 60) ?? ""}…
                    </p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] px-1.5 py-0.5 rounded-[3px] border border-[#DFE1E6] text-[#6B778C]">
                        {totalCalls(c)} calls
                      </span>
                      {c.last_interaction_date && (
                        <span className="text-[11px] text-[#6B778C] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(c.last_interaction_date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Text runs */}
          {textRuns.length > 0 && (
            <>
              <div className="px-5 py-2 flex items-center gap-1.5 border-b border-[#DFE1E6] bg-[#F4F5F7]">
                <MessageSquare className="w-3 h-3 text-[#6B778C]" />
                <span className="text-[10px] font-semibold text-[#6B778C] uppercase tracking-[0.06em]">Text agent</span>
              </div>
              <div className="divide-y divide-[#DFE1E6]">
                {textRuns.map((run) => (
                  <button
                    key={run.id}
                    onClick={() => setSelection({ type: "run", id: run.id })}
                    className={`w-full text-left px-5 py-3.5 transition-colors ${
                      selection?.type === "run" && selection.id === run.id ? "bg-[#DEEBFF]" : "hover:bg-[#F4F5F7]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[13px] font-medium text-[#172B4D]">{run.id.slice(0, 8)}…</span>
                      {run.status === "completed" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A] shrink-0" />
                      ) : run.status === "failed" ? (
                        <XCircle className="w-3.5 h-3.5 text-[#DE350B] shrink-0" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 text-[#6B778C] shrink-0 animate-spin" />
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] text-[#6B778C]">
                        {(run.input_tokens + run.output_tokens).toLocaleString()} tokens
                      </span>
                      <span className="text-[11px] text-[#6B778C] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(run.timestamp).toLocaleString("en-GB", {
                          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selection?.type === "contact" && loadingDetail && (
          <div className="flex items-center justify-center h-full text-[#6B778C] gap-2 text-[13px]">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading…
          </div>
        )}

        {selection?.type === "contact" && !loadingDetail && contactDetail && (
          <ContactDetail detail={contactDetail} />
        )}

        {selection?.type === "run" && (() => {
          const run = textRuns.find((r) => r.id === selection.id);
          return run ? <ChatDetail run={run} /> : null;
        })()}

        {!selection && !loadingContacts && (
          <div className="flex items-center justify-center h-full text-[#6B778C]">
            <div className="text-center">
              <User className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-[13px]">Select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
