import { db } from "@/db";
import { trades } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import type { Trade } from "@/lib/types";

export async function getTradeHistory(limit = 50): Promise<Trade[]> {
  return db
    .select()
    .from(trades)
    .orderBy(desc(trades.createdAt))
    .limit(limit) as Promise<Trade[]>;
}

export async function getOpenTrades(): Promise<Trade[]> {
  return db
    .select()
    .from(trades)
    .where(eq(trades.status, "OPEN")) as Promise<Trade[]>;
}

export async function getTotalPnl(): Promise<number> {
  const resolved = await db
    .select()
    .from(trades)
    .where(eq(trades.status, "RESOLVED"));
  return resolved.reduce((acc, t) => acc + Number(t.pnl ?? 0), 0);
}
