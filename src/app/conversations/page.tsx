"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, Clock, ChevronRight, User, Bot, Mic, MicOff } from "lucide-react";

interface Message {
  role: "agent" | "lead";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  company: string;
  contact: string;
  industry: string;
  status: "active" | "completed" | "escalated" | "voicemail";
  duration: string;
  time: string;
  outcome: string;
  needsHuman: boolean;
  transcript: Message[];
}

const conversations: Conversation[] = [
  {
    id: "c1",
    company: "EventPro Berlin",
    contact: "Julia Schneider",
    industry: "Events",
    status: "escalated",
    duration: "4m 12s",
    time: "14:18",
    outcome: "Human takeover requested",
    needsHuman: true,
    transcript: [
      { role: "agent", text: "Guten Tag, Frau Schneider! Mein Name ist Max von HappyRobot. Ich rufe an wegen unserer KI-gestützten Veranstaltungsmanagement-Lösung. Haben Sie kurz Zeit?", time: "14:14:02" },
      { role: "lead", text: "Ja, kurz. Worum geht's genau?", time: "14:14:18" },
      { role: "agent", text: "Wir helfen Event-Agenturen wie Ihrer, die Gästekommunikation um bis zu 70% zu automatisieren – von der Einladung bis zum Follow-up. Das spart Ihrem Team wertvolle Stunden.", time: "14:14:35" },
      { role: "lead", text: "Klingt interessant. Aber wir haben gerade ein laufendes Datenschutzaudit – können Sie mir garantieren, dass eure Lösung DSGVO-konform ist? Ich brauche da wirklich Details.", time: "14:15:10" },
      { role: "agent", text: "Sehr gute Frage! Unsere Plattform ist vollständig DSGVO-konform und wir bieten einen Auftragsverarbeitungsvertrag an. Für spezifische technische Details würde ich Sie gerne mit unserem Compliance-Experten verbinden.", time: "14:15:38" },
      { role: "lead", text: "Ja, das wäre sinnvoll. Wann wäre das möglich?", time: "14:16:05" },
    ],
  },
  {
    id: "c2",
    company: "Maier Bau GmbH",
    contact: "Stefan Maier",
    industry: "Construction",
    status: "completed",
    duration: "6m 48s",
    time: "14:32",
    outcome: "Meeting booked: 22 Apr 10:00",
    needsHuman: false,
    transcript: [
      { role: "agent", text: "Guten Tag, Herr Maier! Ich bin Max von HappyRobot. Wir helfen Bauunternehmen, ihre Kundenakquise zu automatisieren. Passt das kurz?", time: "14:26:00" },
      { role: "lead", text: "Ja, ich hab fünf Minuten.", time: "14:26:12" },
      { role: "agent", text: "Wunderbar! Maier Bau hat zuletzt einige Großprojekte abgeschlossen – herzlichen Glückwunsch übrigens. Nutzen Sie bereits ein CRM für Ihre Nachverfolgung?", time: "14:26:28" },
      { role: "lead", text: "Wir nutzen Excel und ein bisschen Salesforce, aber ehrlich gesagt... nicht konsequent.", time: "14:26:55" },
      { role: "agent", text: "Das kenne ich gut. Genau da helfen wir: automatische Nachverfolgung, KI-priorisierte Leads, und alles integriert in Salesforce. Ich könnte Ihnen das in einer kurzen Demo zeigen – wann passt Ihnen kommende Woche?", time: "14:27:30" },
      { role: "lead", text: "Dienstag morgen wäre gut, so um 10 Uhr.", time: "14:28:01" },
      { role: "agent", text: "Perfekt! Dienstag, 22. April um 10 Uhr – ich trage das ein und Sie erhalten eine Kalendereinladung. Noch Fragen bis dahin?", time: "14:28:22" },
      { role: "lead", text: "Nein, das passt. Bis Dienstag!", time: "14:28:40" },
    ],
  },
  {
    id: "c3",
    company: "Logistik König AG",
    contact: "Hans König",
    industry: "Logistics",
    status: "completed",
    duration: "3m 22s",
    time: "13:55",
    outcome: "Qualified — pipeline stage updated",
    needsHuman: false,
    transcript: [
      { role: "agent", text: "Guten Tag, Herr König. Max von HappyRobot hier. Wir arbeiten mit Logistikunternehmen zusammen, um Kundenakquise zu digitalisieren. Haben Sie einen Moment?", time: "13:52:10" },
      { role: "lead", text: "Ja, kurz. Was bieten Sie an?", time: "13:52:30" },
      { role: "agent", text: "KI-gestützte Outreach-Automatisierung – wir identifizieren Ihre besten Leads und kontaktieren diese automatisch, personaliert und zum richtigen Zeitpunkt.", time: "13:52:55" },
      { role: "lead", text: "Interessant. Wir wachsen gerade stark und Akquise ist ein Engpass. Schicken Sie mir mehr Infos?", time: "13:53:40" },
      { role: "agent", text: "Natürlich! Ich schicke Ihnen heute noch unsere Fallstudie mit einem ähnlichen Logistik-Kunden. Und würden Sie nächste Woche für eine kurze Demo verfügbar sein?", time: "13:54:05" },
      { role: "lead", text: "Ja, Donnerstag nachmittag wäre machbar.", time: "13:54:30" },
    ],
  },
  {
    id: "c4",
    company: "TechBau Süd GmbH",
    contact: "Werner Braun",
    industry: "Construction",
    status: "voicemail",
    duration: "0m 45s",
    time: "13:41",
    outcome: "Voicemail left (attempt 3/5)",
    needsHuman: false,
    transcript: [
      { role: "agent", text: "[Voicemail] Guten Tag, Herr Braun, hier ist Max von HappyRobot. Ich versuche Sie heute zum dritten Mal zu erreichen. Wir haben eine interessante Lösung für Bauunternehmen wie Ihre – bitte rufen Sie mich zurück unter 089-12345678. Vielen Dank!", time: "13:41:00" },
    ],
  },
  {
    id: "c5",
    company: "Schäfer Events",
    contact: "Monika Schäfer",
    industry: "Events",
    status: "active",
    duration: "1m 33s",
    time: "14:41",
    outcome: "In progress...",
    needsHuman: false,
    transcript: [
      { role: "agent", text: "Guten Tag, Frau Schäfer! Mein Name ist Max von HappyRobot. Wir helfen Veranstaltungsagenturen, mehr Kunden mit weniger Aufwand zu gewinnen. Haben Sie kurz Zeit?", time: "14:40:00" },
      { role: "lead", text: "Ja, was ist das genau?", time: "14:40:20" },
      { role: "agent", text: "Stellen Sie sich vor, Ihr komplettes Erstgespräch mit potenziellen Kunden wird automatisch geführt – intelligent, persönlich und rund um die Uhr. Was ist aktuell Ihr größter Engpass bei der Neukundengewinnung?", time: "14:40:45" },
    ],
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-green-500/15 text-green-400 border-green-500/30" },
  completed: { label: "Completed", className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" },
  escalated: { label: "Escalated", className: "bg-red-500/15 text-red-400 border-red-500/30" },
  voicemail: { label: "Voicemail", className: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
};

export default function ConversationsPage() {
  const [selected, setSelected] = useState<string>("c1");
  const conv = conversations.find((c) => c.id === selected)!;

  return (
    <div className="flex h-screen">
      {/* List */}
      <div className="w-72 shrink-0 border-r border-border flex flex-col">
        <div className="px-4 py-4 border-b border-border">
          <h1 className="text-xl font-semibold">Conversations</h1>
          <p className="text-sm text-muted-foreground">Today · {conversations.length} calls</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${selected === c.id ? "bg-muted/50" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.company}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.contact}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs text-muted-foreground">{c.time}</span>
                  {c.needsHuman && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                </div>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className={`text-xs px-1.5 py-0.5 rounded border ${statusConfig[c.status].className}`}>
                  {statusConfig[c.status].label}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {c.duration}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {conv.needsHuman && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Human takeover requested — DSGVO compliance question escalated</span>
            </div>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
              Take Over Call
            </Button>
          </div>
        )}

        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-semibold">{conv.company}</h2>
            <p className="text-sm text-muted-foreground">{conv.contact} · {conv.industry} · {conv.time} · {conv.duration}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded border ${statusConfig[conv.status].className}`}>
              {statusConfig[conv.status].label}
            </span>
            <span className="text-xs text-muted-foreground">{conv.outcome}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {conv.transcript.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "agent" ? "" : "flex-row-reverse"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "agent" ? "bg-blue-600" : "bg-zinc-700"}`}>
                {msg.role === "agent" ? <Bot className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className={`max-w-[70%] ${msg.role === "agent" ? "" : "items-end"} flex flex-col gap-1`}>
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "agent"
                    ? "bg-blue-600/20 text-foreground rounded-tl-sm"
                    : "bg-muted text-foreground rounded-tr-sm"
                }`}>
                  {msg.text}
                </div>
                <span className="text-xs text-muted-foreground px-1">{msg.time}</span>
              </div>
            </div>
          ))}
          {conv.status === "active" && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex items-center gap-1.5 bg-blue-600/20 rounded-2xl rounded-tl-sm px-4 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
