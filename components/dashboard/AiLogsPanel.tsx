"use client";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { AiLog } from "@/lib/types";

interface Props {
  logs: AiLog[];
}

export function AiLogsPanel({ logs }: Props) {
  return (
    <Card>
      <h2 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">
        AI Decision Log
      </h2>
      {logs.length === 0 ? (
        <p className="text-zinc-500 text-sm">No agent runs yet</p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-zinc-800 rounded-lg p-3 text-sm space-y-1"
            >
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    log.decision === "BUY"
                      ? "success"
                      : log.decision === "SELL"
                        ? "danger"
                        : "default"
                  }
                >
                  {log.decision ?? "SKIP"}
                </Badge>
                {log.confidenceScore && (
                  <span className="text-zinc-500 text-xs">
                    {log.confidenceScore}% confidence
                  </span>
                )}
                <span className="text-zinc-600 text-xs ml-auto">
                  {log.createdAt
                    ? new Date(log.createdAt).toLocaleTimeString()
                    : ""}
                </span>
              </div>
              {log.reasoning && (
                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                  {log.reasoning}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
