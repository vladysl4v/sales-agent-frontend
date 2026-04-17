"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Brain, MessageSquare, Search, GitBranch, CheckCircle2, AlertTriangle, Zap } from "lucide-react";

interface TraceStep {
  id: string;
  type: "think" | "speak" | "retrieve" | "decide" | "tool" | "escalate";
  label: string;
  detail: string;
  duration: string;
  confidence?: number;
  children?: TraceStep[];
  outcome?: "success" | "warn" | "info";
}

const traces: { id: string; label: string; company: string; time: string; steps: TraceStep[] }[] = [
  {
    id: "t1",
    label: "Maier Bau GmbH — Meeting booked",
    company: "Stefan Maier",
    time: "14:26",
    steps: [
      {
        id: "s1",
        type: "retrieve",
        label: "CRM Lookup",
        detail: "Fetched lead profile for 'Maier Bau GmbH' — 3 previous touches, Salesforce user, annual revenue ~€4.2M, construction sector.",
        duration: "82ms",
        outcome: "success",
      },
      {
        id: "s2",
        type: "think",
        label: "Persona Classification",
        detail: "Classified as: Decision Maker (CEO). Industry: Construction. Pain points: lead tracking, CRM adoption. Tone: direct, results-oriented.",
        duration: "140ms",
        confidence: 92,
        outcome: "success",
        children: [
          {
            id: "s2a",
            type: "retrieve",
            label: "Similar lead embeddings",
            detail: "Retrieved 8 similar construction CEO profiles. Avg. conversion: 34%. Best opener: congratulate recent project win.",
            duration: "65ms",
            outcome: "info",
          },
        ],
      },
      {
        id: "s3",
        type: "speak",
        label: "Opening — project congratulation",
        detail: '"Maier Bau hat zuletzt einige Großprojekte abgeschlossen – herzlichen Glückwunsch!"',
        duration: "—",
        outcome: "success",
      },
      {
        id: "s4",
        type: "decide",
        label: "Response intent classification",
        detail: 'Lead said: "Wir nutzen Excel und ein bisschen Salesforce, nicht konsequent." → Intent: "CRM pain acknowledged". Sentiment: neutral-positive.',
        duration: "110ms",
        confidence: 88,
        outcome: "success",
      },
      {
        id: "s5",
        type: "think",
        label: "Script path selection",
        detail: 'Selected path: SALESFORCE_INTEGRATION_PITCH. Skipped: generic_value_prop (low relevance). Triggered: demo_close.',
        duration: "95ms",
        confidence: 85,
        outcome: "success",
      },
      {
        id: "s6",
        type: "tool",
        label: "Calendar availability check",
        detail: "Queried calendar API for next week slots. Found: Tue 22 Apr 10:00, 14:00; Thu 24 Apr 09:00.",
        duration: "210ms",
        outcome: "success",
      },
      {
        id: "s7",
        type: "speak",
        label: "Meeting close",
        detail: '"Dienstag, 22. April um 10 Uhr – ich trage das ein und Sie erhalten eine Kalendereinladung."',
        duration: "—",
        outcome: "success",
      },
      {
        id: "s8",
        type: "tool",
        label: "CRM update + calendar invite",
        detail: "Updated Salesforce: stage → Meeting Set, next_action: Demo 22 Apr 10:00. Sent Google Calendar invite to stefan.maier@maierbau.de.",
        duration: "315ms",
        outcome: "success",
      },
    ],
  },
  {
    id: "t2",
    label: "EventPro Berlin — Escalation",
    company: "Julia Schneider",
    time: "14:14",
    steps: [
      {
        id: "s1",
        type: "retrieve",
        label: "CRM Lookup",
        detail: "Lead profile: EventPro Berlin, 80 employees, enterprise segment. Last contact: 3 weeks ago. Industry: Events.",
        duration: "91ms",
        outcome: "success",
      },
      {
        id: "s2",
        type: "think",
        label: "Persona Classification",
        detail: "Classified as: Head of Operations. Tone: analytical, process-driven. Likely objections: compliance, integration.",
        duration: "130ms",
        confidence: 78,
        outcome: "success",
      },
      {
        id: "s3",
        type: "speak",
        label: "Opening pitch",
        detail: '"Wir helfen Event-Agenturen, die Gästekommunikation um bis zu 70% zu automatisieren."',
        duration: "—",
        outcome: "success",
      },
      {
        id: "s4",
        type: "decide",
        label: "Objection classification",
        detail: 'Lead raised: "laufendes Datenschutzaudit — DSGVO-konform?" → Objection type: COMPLIANCE_DETAIL. Confidence agent can handle: 41% (below threshold 60%).',
        duration: "145ms",
        confidence: 41,
        outcome: "warn",
      },
      {
        id: "s5",
        type: "escalate",
        label: "Escalation triggered",
        detail: "Compliance objection confidence below threshold. Escalation rule: COMPLIANCE_EXPERT_HANDOFF. Human SDR notified via Slack.",
        duration: "88ms",
        outcome: "warn",
      },
    ],
  },
];

const typeIcon: Record<TraceStep["type"], React.ReactNode> = {
  think: <Brain className="w-3.5 h-3.5" />,
  speak: <MessageSquare className="w-3.5 h-3.5" />,
  retrieve: <Search className="w-3.5 h-3.5" />,
  decide: <GitBranch className="w-3.5 h-3.5" />,
  tool: <Zap className="w-3.5 h-3.5" />,
  escalate: <AlertTriangle className="w-3.5 h-3.5" />,
};

const typeColor: Record<TraceStep["type"], string> = {
  think: "text-purple-400 bg-purple-400/10",
  speak: "text-blue-400 bg-blue-400/10",
  retrieve: "text-cyan-400 bg-cyan-400/10",
  decide: "text-amber-400 bg-amber-400/10",
  tool: "text-green-400 bg-green-400/10",
  escalate: "text-red-400 bg-red-400/10",
};

const outcomeIcon: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />,
  warn: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
  info: <Zap className="w-3.5 h-3.5 text-blue-400" />,
};

function StepRow({ step, depth = 0 }: { step: TraceStep; depth?: number }) {
  const [open, setOpen] = useState(false);
  const hasChildren = step.children && step.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-white/[0.03] cursor-pointer group ${depth > 0 ? "ml-6" : ""}`}
        onClick={() => hasChildren && setOpen((v) => !v)}
      >
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          {hasChildren ? (
            open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <div className="w-3.5" />
          )}
          <div className={`flex items-center justify-center w-6 h-6 rounded ${typeColor[step.type]}`}>
            {typeIcon[step.type]}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{step.label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${typeColor[step.type]}`}>{step.type}</span>
            {step.confidence !== undefined && (
              <span className={`text-xs ${step.confidence >= 60 ? "text-green-400" : "text-amber-400"}`}>
                {step.confidence}% confidence
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.detail}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {step.outcome && outcomeIcon[step.outcome]}
          <span className="text-xs text-muted-foreground font-mono">{step.duration}</span>
        </div>
      </div>

      {open && hasChildren && (
        <div className="border-l border-border ml-9">
          {step.children!.map((child) => (
            <StepRow key={child.id} step={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TracePage() {
  const [selectedTrace, setSelectedTrace] = useState("t1");
  const trace = traces.find((t) => t.id === selectedTrace)!;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Agent Decision Trace</h1>
        <p className="text-sm text-muted-foreground">Step-by-step reasoning for each call</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {traces.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTrace(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              selectedTrace === t.id
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{trace.label}</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{trace.company} · {trace.time}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400"></span> Think</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Speak</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Retrieve</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Decide</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Tool</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Escalate</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-0.5">
            {trace.steps.map((step, i) => (
              <div key={step.id} className="relative">
                {i < trace.steps.length - 1 && (
                  <div className="absolute left-[2.375rem] top-9 bottom-0 w-px bg-border z-0" />
                )}
                <StepRow step={step} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
