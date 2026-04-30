import { db } from "@/db";
import { markets } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { Market } from "@/lib/types";

export async function getActiveMarkets(limit = 50): Promise<Market[]> {
  return db
    .select()
    .from(markets)
    .where(and(eq(markets.active, true), eq(markets.closed, false)))
    .limit(limit) as Promise<Market[]>;
}
