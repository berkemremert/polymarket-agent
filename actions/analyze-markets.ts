"use server";
import { openai } from "@/lib/openai-client";
import { db } from "@/db";
import { aiLogs } from "@/db/schema";
import type { Market, AiDecision } from "@/lib/types";
import { randomUUID } from "crypto";

export interface MarketAnalysis {
  market: Market;
  decision: AiDecision;
  logId: string;
}

export async function analyzeMarkets(
  marketsToAnalyze: Market[],
  walletBalance: number,
  cycleId: string
): Promise<MarketAnalysis[]> {
  const results: MarketAnalysis[] = [];

  for (const market of marketsToAnalyze) {
    const prompt = buildPrompt(market, walletBalance);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'You are a quantitative prediction market trader. Analyze the given market and respond ONLY with a JSON object containing: decision ("BUY", "SELL", or "SKIP"), confidence_score (0-100 integer), reasoning (string), bet_size_percentage (0-10 float, max percent of wallet to risk per trade). BUY means you expect the YES token to appreciate. SELL means you expect the NO token to appreciate. Only BUY or SELL when confidence_score >= 60.',
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const rawResponse = completion.choices[0].message.content ?? "{}";
    let decision: AiDecision;

    try {
      const parsed = JSON.parse(rawResponse);
      decision = {
        decision: parsed.decision ?? "SKIP",
        confidence_score: Math.min(100, Math.max(0, Number(parsed.confidence_score ?? 0))),
        reasoning: parsed.reasoning ?? "",
        bet_size_percentage: Math.min(10, Math.max(0, Number(parsed.bet_size_percentage ?? 0))),
      };
    } catch {
      decision = {
        decision: "SKIP",
        confidence_score: 0,
        reasoning: "JSON parse error",
        bet_size_percentage: 0,
      };
    }

    const logId = randomUUID();
    await db.insert(aiLogs).values({
      id: logId,
      cycleId,
      marketConditionId: market.conditionId,
      prompt,
      rawResponse,
      decision: decision.decision,
      confidenceScore: String(decision.confidence_score),
      betSizePercentage: String(decision.bet_size_percentage),
      reasoning: decision.reasoning,
      tokensUsed: completion.usage?.total_tokens ?? 0,
    });

    results.push({ market, decision, logId });
  }

  return results;
}

function buildPrompt(market: Market, walletBalance: number): string {
  const prices = (market.outcomePrices as string[]).map(Number);
  const outcomes = market.outcomes as string[];
  const priceLines = outcomes
    .map((o, i) => `  ${o}: ${(prices[i] * 100).toFixed(1)}%`)
    .join("\n");

  return `Market: ${market.question}
End date: ${market.endDate?.toISOString() ?? "Unknown"}
Current prices:
${priceLines}
Volume: $${Number(market.volumeNum ?? 0).toFixed(0)}
Liquidity: $${Number(market.liquidity ?? 0).toFixed(0)}
Your wallet balance: $${walletBalance.toFixed(2)} USDC

Analyze this prediction market. Reply in JSON only.`.trim();
}
