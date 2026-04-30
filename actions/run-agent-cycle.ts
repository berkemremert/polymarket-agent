"use server";
import { randomUUID } from "crypto";
import { fetchMarkets } from "./fetch-markets";
import { analyzeMarkets } from "./analyze-markets";
import { executeTrade } from "./execute-trade";
import { getWalletBalance } from "./get-balance";
import { getActiveMarkets } from "@/db/queries/markets";
import type { AgentCycleResult } from "@/lib/types";

export async function runAgentCycle(): Promise<AgentCycleResult> {
  const cycleId = randomUUID();
  const errors: string[] = [];

  await fetchMarkets();

  const walletBalance = await getWalletBalance();
  const activeMarkets = await getActiveMarkets(20);

  const analyses = await analyzeMarkets(activeMarkets, walletBalance, cycleId);

  let tradesAttempted = 0;
  let tradesSucceeded = 0;

  for (const { market, decision, logId } of analyses) {
    if (decision.decision === "SKIP") continue;
    tradesAttempted++;

    const result = await executeTrade(market, decision, walletBalance, logId);
    if (result.success) tradesSucceeded++;
    else errors.push(result.error ?? "Unknown error");
  }

  return {
    cycleId,
    marketsAnalyzed: activeMarkets.length,
    tradesAttempted,
    tradesSucceeded,
    errors,
  };
}
