"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import type { HRRun } from "@/lib/happyrobot";

function formatDuration(start: string, end: string | null): string {
  if (!end) return "—";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function TracePage() {
  const [runs, setRuns] = useState<HRRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/runs")
      .then((r) => r.json())
      .then((data: HRRun[]) => {
        setRuns(data);
        if (data.length > 0) setSelected(data[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const run = runs.find((r) => r.id === selected);

  const completed = runs.filter((r) => r.status === "completed").length;
  const failed = runs.filter((r) => r.status === "failed").length;
  const avgTokens =
    runs.length > 0
      ? Math.round(runs.reduce((s, r) => s + r.input_tokens + r.output_tokens, 0) / runs.length)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-[#6B778C] gap-2 text-[13px]">
        <RefreshCw className="w-4 h-4 animate-spin" /> Loading runs…
      </div>
    );
  }

  return (
    <div>
      {/* Topbar */}
      <div className="sticky top-0 z-10 h-14 bg-white border-b border-[#DFE1E6] px-8 flex items-center shrink-0">
        <div>
          <h1 className="text-[20px] font-semibold text-[#172B4D]">Agent Run Log</h1>
          <p className="text-[12px] text-[#6B778C] mt-0.5">
            Phone agent execution history · {runs.length} total runs
          </p>
        </div>
      </div>

      <div className="px-8 py-6 space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4 px-[18px] flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-[#6B778C] uppercase tracking-[0.04em]">Completed</p>
                <p className="text-[28px] font-bold text-[#172B4D] leading-none mt-1">{completed}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 px-[18px] flex items-center gap-3">
              <XCircle className="w-4 h-4 text-[#DE350B] shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-[#6B778C] uppercase tracking-[0.04em]">Agent Errors</p>
                <p className="text-[28px] font-bold text-[#172B4D] leading-none mt-1">{failed}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 px-[18px] flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#0052CC] shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-[#6B778C] uppercase tracking-[0.04em]">Avg Tokens / Run</p>
                <p className="text-[28px] font-bold text-[#172B4D] leading-none mt-1">{avgTokens.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Run list */}
          <div className="col-span-1 space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {runs.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`w-full text-left px-3 py-2.5 rounded-[3px] border text-[13px] transition-colors ${
                  selected === r.id
                    ? "bg-[#DEEBFF] border-[#0052CC] text-[#172B4D]"
                    : "bg-white border-[#DFE1E6] hover:bg-[#F4F5F7] text-[#6B778C]"
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  {r.status === "completed" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A] shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-[#DE350B] shrink-0" />
                  )}
                  <span className="font-mono text-[12px] truncate">{r.id.slice(0, 8)}…</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#6B778C]">
                  <span>{formatTime(r.timestamp)}</span>
                  <span>{(r.input_tokens + r.output_tokens).toLocaleString()} tok</span>
                </div>
              </button>
            ))}
          </div>

          {/* Run detail */}
          <div className="col-span-2">
            {run ? (
              <Card>
                <CardHeader className="border-b border-[#DFE1E6]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono text-[12px] text-[#6B778C]">{run.id}</CardTitle>
                    <span
                      className={`text-[11px] px-2 py-1 rounded-[3px] border ${
                        run.status === "completed"
                          ? "text-[#00875A] border-[#ABF5D1]"
                          : "text-[#DE350B] border-[#FFBDAD]"
                      }`}
                    >
                      {run.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-5">
                  <div className="grid grid-cols-2 gap-4 text-[13px]">
                    <div>
                      <p className="text-[11px] text-[#6B778C] mb-1">Started</p>
                      <p className="font-medium text-[#172B4D]">{new Date(run.timestamp).toLocaleString("en-GB")}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#6B778C] mb-1">Completed</p>
                      <p className="font-medium text-[#172B4D]">
                        {run.completed_at ? new Date(run.completed_at).toLocaleString("en-GB") : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#6B778C] mb-1">Duration</p>
                      <p className="font-medium text-[#172B4D] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#6B778C]" />
                        {formatDuration(run.timestamp, run.completed_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#6B778C] mb-1">Environment</p>
                      <p className="font-medium text-[#172B4D] capitalize">{run.execution_environment ?? "production"}</p>
                    </div>
                  </div>

                  <div className="border-t border-[#DFE1E6] pt-4">
                    <p className="text-[11px] font-semibold text-[#6B778C] uppercase tracking-[0.04em] mb-3">Token Usage</p>
                    <div className="space-y-3">
                      {[
                        { label: "Input tokens", value: run.input_tokens, color: "#0052CC" },
                        { label: "Output tokens", value: run.output_tokens, color: "#A5C5FF" },
                      ].map((t) => {
                        const total = run.input_tokens + run.output_tokens || 1;
                        return (
                          <div key={t.label} className="space-y-1.5">
                            <div className="flex justify-between text-[12px]">
                              <span className="text-[#6B778C]">{t.label}</span>
                              <span className="font-medium text-[#172B4D]">{t.value.toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 rounded-[3px] bg-[#DFE1E6]">
                              <div
                                className="h-1.5 rounded-[3px] transition-all"
                                style={{ width: `${(t.value / total) * 100}%`, backgroundColor: t.color }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <p className="text-[11px] text-[#6B778C] pt-1">
                        Total: {(run.input_tokens + run.output_tokens).toLocaleString()} tokens
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#DFE1E6] pt-4">
                    <p className="text-[11px] font-semibold text-[#6B778C] uppercase tracking-[0.04em] mb-2">IDs</p>
                    <div className="space-y-1 font-mono text-[11px] text-[#6B778C]">
                      <p>run: {run.id}</p>
                      <p>use_case: {run.use_case_id}</p>
                      <p>version: {run.version_id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-64 text-[13px] text-[#6B778C]">
                Select a run to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
