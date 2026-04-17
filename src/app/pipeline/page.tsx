"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MoreHorizontal, Building2, CalendarCheck } from "lucide-react";

type Stage = "New" | "Engaged" | "Qualified" | "Meeting Set" | "Closed";

interface Lead {
  id: string;
  name: string;
  contact: string;
  company: string;
  industry: string;
  score: number;
  lastActivity: string;
  value: string;
  stage: Stage;
}

const initialLeads: Lead[] = [
  { id: "1", name: "Stefan Maier", company: "Maier Bau GmbH", contact: "+49 89 4512 3300", industry: "Construction", score: 94, lastActivity: "Called 14:32", value: "€24,000", stage: "Meeting Set" },
  { id: "2", name: "Julia Schneider", company: "EventPro Berlin", contact: "+49 30 8801 4422", industry: "Events", score: 88, lastActivity: "Email opened 13:11", value: "€18,500", stage: "Qualified" },
  { id: "3", name: "Hans König", company: "Logistik König AG", contact: "+49 40 7723 9900", industry: "Logistics", score: 82, lastActivity: "Called 13:55", value: "€31,000", stage: "Engaged" },
  { id: "4", name: "Petra Hoffmann", company: "Hoffmann Druck KG", contact: "+49 211 3341 0055", industry: "Print", score: 79, lastActivity: "VM left 12:44", value: "€9,800", stage: "Qualified" },
  { id: "5", name: "Ralf Becker", company: "WestBau Projekt", contact: "+49 201 6612 8800", industry: "Construction", score: 75, lastActivity: "Email sent 11:30", value: "€15,200", stage: "Engaged" },
  { id: "6", name: "Anja Fischer", company: "Fischer Events GmbH", contact: "+49 69 9988 7766", industry: "Events", score: 71, lastActivity: "Called 10:18", value: "€12,000", stage: "New" },
  { id: "7", name: "Thomas Braun", company: "NordLogistik GmbH", contact: "+49 40 5544 3322", industry: "Logistics", score: 68, lastActivity: "Imported 09:00", value: "€22,000", stage: "New" },
  { id: "8", name: "Sabine Müller", company: "Müller Bau AG", contact: "+49 711 2233 4455", industry: "Construction", score: 91, lastActivity: "Meeting confirmed", value: "€38,000", stage: "Closed" },
  { id: "9", name: "Klaus Richter", company: "RheinLogistik KG", contact: "+49 221 8899 1122", industry: "Logistics", score: 85, lastActivity: "Demo scheduled", value: "€19,500", stage: "Meeting Set" },
  { id: "10", name: "Monika Schäfer", company: "Schäfer Events", contact: "+49 89 3344 5566", industry: "Events", score: 63, lastActivity: "Email opened 08:55", value: "€7,200", stage: "New" },
];

const stages: Stage[] = ["New", "Engaged", "Qualified", "Meeting Set", "Closed"];

const stageStyle: Record<Stage, { header: string; badge: string }> = {
  New: { header: "bg-zinc-800", badge: "bg-zinc-700 text-zinc-300" },
  Engaged: { header: "bg-blue-900/40", badge: "bg-blue-800/60 text-blue-300" },
  Qualified: { header: "bg-amber-900/30", badge: "bg-amber-800/50 text-amber-300" },
  "Meeting Set": { header: "bg-green-900/30", badge: "bg-green-800/50 text-green-300" },
  Closed: { header: "bg-cyan-900/30", badge: "bg-cyan-800/50 text-cyan-300" },
};

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [dragging, setDragging] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDragging(id);
  const handleDrop = (stage: Stage) => {
    if (!dragging) return;
    setLeads((prev) => prev.map((l) => (l.id === dragging ? { ...l, stage } : l)));
    setDragging(null);
  };

  const byStage = (stage: Stage) => leads.filter((l) => l.stage === stage);

  const totalValue = (stage: Stage) =>
    byStage(stage)
      .reduce((sum, l) => sum + parseFloat(l.value.replace(/[€,.]/g, "").replace(",", ".")), 0)
      .toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Sales Pipeline</h1>
        <p className="text-sm text-muted-foreground">Drag cards to move leads between stages</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-10rem)]">
        {stages.map((stage) => {
          const cards = byStage(stage);
          return (
            <div
              key={stage}
              className="flex flex-col min-w-[240px] w-60 shrink-0"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage)}
            >
              <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg ${stageStyle[stage].header}`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stage}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${stageStyle[stage].badge}`}>{cards.length}</span>
                </div>
                <span className="text-xs text-muted-foreground">{totalValue(stage)}</span>
              </div>

              <div className="flex-1 space-y-2 bg-white/[0.03] rounded-b-lg p-2 border border-t-0 border-border min-h-[200px]">
                {cards.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    className="bg-card rounded-lg p-3 ring-1 ring-foreground/10 cursor-grab active:cursor-grabbing hover:ring-foreground/20 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <p className="text-sm font-medium leading-tight">{lead.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          {lead.company}
                        </p>
                      </div>
                      <div className="text-xs font-semibold text-blue-400 shrink-0">{lead.score}</div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{lead.lastActivity}</span>
                      <span className="font-medium text-foreground">{lead.value}</span>
                    </div>

                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon-xs" className="h-5 w-5">
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon-xs" className="h-5 w-5">
                        <Mail className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon-xs" className="h-5 w-5 ml-auto">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
