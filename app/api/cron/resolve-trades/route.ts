import { NextRequest, NextResponse } from "next/server";
import { getPolymarketClient } from "@/lib/polymarket-client";
import { db } from "@/db";
import { trades } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await getPolymarketClient();
  const openTrades = await db
    .select()
    .from(trades)
    .where(eq(trades.status, "OPEN"));

  let resolved = 0;
  for (const trade of openTrades) {
    if (!trade.orderHash) continue;
    try {
      const order = await (client as any).getTrade(trade.orderHash);
      if (!order) continue;

      const status = order.status ?? order.outcome;
      if (status === "RESOLVED" || status === "MINED") {
        const resolvedPrice = Number(order.price ?? order.outcome_price ?? 0);
        const size = Number(trade.size);
        const usdcSpent = Number(trade.usdcSpent);
        const proceeds = size * resolvedPrice;
        const pnl = proceeds - usdcSpent;

        await db
          .update(trades)
          .set({
            status: "RESOLVED",
            resolvedAt: new Date(),
            resolvedPrice: String(resolvedPrice),
            pnl: String(pnl),
          })
          .where(eq(trades.id, trade.id));

        resolved++;
      }
    } catch {
      // Skip individual failures
    }
  }

  return NextResponse.json({ resolved, checked: openTrades.length });
}
