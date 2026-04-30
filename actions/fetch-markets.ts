"use server";
import { getPolymarketClient } from "@/lib/polymarket-client";
import { db } from "@/db";
import { markets } from "@/db/schema";
import { sql } from "drizzle-orm";
import type { PolymarketMarket } from "@/lib/types";

export interface FetchMarketsResult {
  fetched: number;
  upserted: number;
}

export async function fetchMarkets(): Promise<FetchMarketsResult> {
  const client = await getPolymarketClient();
  const response = await client.getMarkets("MA==");
  const rawMarkets: PolymarketMarket[] = (response as any).data ?? [];

  const filtered = rawMarkets.filter(
    (m) => m.active && !m.closed && Number(m.liquidity) > 500
  );

  if (filtered.length === 0) return { fetched: rawMarkets.length, upserted: 0 };

  await db
    .insert(markets)
    .values(
      filtered.map((m) => ({
        conditionId: m.condition_id,
        question: m.question,
        outcomes: m.outcomes,
        outcomePrices: m.outcome_prices,
        tokens: m.tokens ?? null,
        volumeNum: m.volume_num,
        liquidity: m.liquidity,
        endDate: m.end_date_iso ? new Date(m.end_date_iso) : null,
        active: true,
        closed: false,
        fetchedAt: new Date(),
      }))
    )
    .onConflictDoUpdate({
      target: markets.conditionId,
      set: {
        outcomePrices: sql`excluded.outcome_prices`,
        tokens: sql`excluded.tokens`,
        volumeNum: sql`excluded.volume_num`,
        liquidity: sql`excluded.liquidity`,
        fetchedAt: sql`excluded.fetched_at`,
      },
    });

  return { fetched: rawMarkets.length, upserted: filtered.length };
}
