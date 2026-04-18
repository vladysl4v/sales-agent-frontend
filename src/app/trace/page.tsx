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
      <div className="flex items-center justify-center h-screen text-[#bbb] gap-2 text-[13px]">
        <RefreshCw className="w-4 h-4 animate-spin" /> Loading runs…
      </div>
    );
  }

  return (
    <div className="px-7 py-6 space-y-5">
      <div>
        <h1 className="text-[16px] font-semibold tracking-[-0.03em] text-[#0f0f0f]">Agent Run Log</h1>
        <p className="text-[11px] text-[#bbb] mt-0.5">
          Phone agent execution history · {runs.length} total runs
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 px-[18px] flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
            <div>
              <p className="text-[11px] font-medium text-[#999] uppercase tracking-[0.02em]">Completed</p>
              <p className="text-[26px] font-semibold tracking-[-0.04em] text-[#0f0f0f] leading-none mt-1">{completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 px-[18px] flex items-center gap-3">
            <XCircle className="w-4 h-4 text-[#ef4444] shrink-0" />
            <div>
              <p className="text-[11px] font-medium text-[#999] uppercase tracking-[0.02em]">Agent Errors</p>
              <p className="text-[26px] font-semibold tracking-[-0.04em] text-[#0f0f0f] leading-none mt-1">{failed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 px-[18px] flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#6366f1] shrink-0" />
            <div>
              <p className="text-[11px] font-medium text-[#999] uppercase tracking-[0.02em]">Avg Tokens / Run</p>
              <p className="text-[26px] font-semibold tracking-[-0.04em] text-[#0f0f0f] leading-none mt-1">{avgTokens.toLocaleString()}</p>
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
              className={`w-full text-left px-3 py-2.5 rounded-[8px] border text-[13px] transition-colors ${
                selected === r.id
                  ? "bg-[#f5f5f5] border-[#e0e0e0] text-[#0f0f0f]"
                  : "bg-white border-[#f0f0f0] hover:bg-[#fafafa] text-[#555]"
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                {r.status === "completed" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />
                )}
                <span className="font-mono text-[12px] truncate">{r.id.slice(0, 8)}…</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#bbb]">
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
              <CardHeader className="border-b border-[#f0f0f0]">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono text-[12px] text-[#999]">{run.id}</CardTitle>
                  <span
                    className={`text-[11px] px-2 py-1 rounded border ${
                      run.status === "completed"
                        ? "text-[#16a34a] border-[#bbf7d0]"
                        : "text-[#dc2626] border-[#fecaca]"
                    }`}
                  >
                    {run.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <p className="text-[11px] text-[#bbb] mb-1">Started</p>
                    <p className="font-medium text-[#0f0f0f]">{new Date(run.timestamp).toLocaleString("en-GB")}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#bbb] mb-1">Completed</p>
                    <p className="font-medium text-[#0f0f0f]">
                      {run.completed_at ? new Date(run.completed_at).toLocaleString("en-GB") : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#bbb] mb-1">Duration</p>
                    <p className="font-medium text-[#0f0f0f] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#bbb]" />
                      {formatDuration(run.timestamp, run.completed_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#bbb] mb-1">Environment</p>
                    <p className="font-medium text-[#0f0f0f] capitalize">{run.execution_environment ?? "production"}</p>
                  </div>
                </div>

                <div className="border-t border-[#f0f0f0] pt-4">
                  <p className="text-[11px] text-[#bbb] uppercase tracking-[0.02em] mb-3">Token Usage</p>
                  <div className="space-y-3">
                    {[
                      { label: "Input tokens", value: run.input_tokens, color: "#6366f1" },
                      { label: "Output tokens", value: run.output_tokens, color: "#a5b4fc" },
                    ].map((t) => {
                      const total = run.input_tokens + run.output_tokens || 1;
                      return (
                        <div key={t.label} className="space-y-1.5">
                          <div className="flex justify-between text-[12px]">
                            <span className="text-[#999]">{t.label}</span>
                            <span className="font-medium text-[#0f0f0f]">{t.value.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#f0f0f0]">
                            <div
                              className="h-1.5 rounded-full transition-all"
                              style={{ width: `${(t.value / total) * 100}%`, backgroundColor: t.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <p className="text-[11px] text-[#bbb] pt-1">
                      Total: {(run.input_tokens + run.output_tokens).toLocaleString()} tokens
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#f0f0f0] pt-4">
                  <p className="text-[11px] text-[#bbb] uppercase tracking-[0.02em] mb-2">IDs</p>
                  <div className="space-y-1 font-mono text-[11px] text-[#bbb]">
                    <p>run: {run.id}</p>
                    <p>use_case: {run.use_case_id}</p>
                    <p>version: {run.version_id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 text-[13px] text-[#bbb]">
              Select a run to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
