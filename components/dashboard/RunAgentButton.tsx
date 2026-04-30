"use client";
import { useTransition, useState } from "react";
import { runAgentCycle } from "@/actions/run-agent-cycle";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";

export function RunAgentButton() {
  const [isPending, startTransition] = useTransition();
  const [lastResult, setLastResult] = useState<string | null>(null);
  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const result = await runAgentCycle();
        setLastResult(
          `Cycle complete — ${result.tradesSucceeded}/${result.tradesAttempted} trades executed`
        );
        router.refresh();
      } catch (err) {
        setLastResult(`Error: ${String(err)}`);
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        disabled={isPending}
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
      >
        {isPending && <Spinner size={4} />}
        {isPending ? "Running agent…" : "Run Agent Now"}
      </button>
      {lastResult && (
        <p className="text-xs text-zinc-500">{lastResult}</p>
      )}
    </div>
  );
}
