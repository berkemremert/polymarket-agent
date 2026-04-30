"use server";
import { getPolymarketClient } from "@/lib/polymarket-client";
import { db } from "@/db";
import { trades, aiLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Side, OrderType } from "@polymarket/clob-client";
import type { Market, AiDecision, PolymarketToken } from "@/lib/types";

export interface ExecuteTradeResult {
  success: boolean;
  orderHash?: string;
  error?: string;
}

export async function executeTrade(
  market: Market,
  decision: AiDecision,
  walletBalance: number,
  logId: string
): Promise<ExecuteTradeResult> {
  if (decision.decision === "SKIP" || decision.confidence_score < 60) {
    return { success: false, error: "Skipped by policy" };
  }

  if (walletBalance < 1) {
    return { success: false, error: "Insufficient balance (< $1 USDC)" };
  }

  const client = await getPolymarketClient();

  // Resolve token: BUY = YES token (index 0), SELL = NO token (index 1)
  const tokenList = market.tokens as PolymarketToken[] | null;
  const outcomeIndex = decision.decision === "BUY" ? 0 : 1;
  const prices = (market.outcomePrices as string[]).map(Number);
  const outcomes = market.outcomes as string[];
  const outcome = outcomes[outcomeIndex];
  const price = prices[outcomeIndex];

  if (!price || price <= 0 || price >= 1) {
    return { success: false, error: `Invalid price: ${price}` };
  }

  // Prefer the token_id from the tokens array; fall back to conditionId
  const tokenId =
    tokenList?.[outcomeIndex]?.token_id ?? market.conditionId;

  const usdcToSpend = (walletBalance * decision.bet_size_percentage) / 100;
  const size = Math.floor((usdcToSpend / price) * 1e4) / 1e4; // 4 decimal precision

  try {
    const response = await client.createAndPostOrder(
      {
        tokenID: tokenId,
        price,
        side: Side.BUY,
        size,
      },
      undefined,
      OrderType.GTC
    );

    const [inserted] = await db
      .insert(trades)
      .values({
        conditionId: market.conditionId,
        tokenId,
        outcome,
        side: "BUY",
        price: String(price),
        size: String(size),
        usdcSpent: String(usdcToSpend),
        status: "OPEN",
        orderHash: response?.orderID ?? response?.order_id ?? null,
        confidenceScore: String(decision.confidence_score),
        aiReasoning: decision.reasoning,
      })
      .returning();

    await db
      .update(aiLogs)
      .set({ tradeId: inserted.id })
      .where(eq(aiLogs.id, logId));

    return { success: true, orderHash: inserted.orderHash ?? undefined };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
