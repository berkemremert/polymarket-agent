import type { Trade, PnlDataPoint } from "./types";

export function calculateRealizedPnl(trade: Trade): number {
  if (trade.status !== "RESOLVED" || trade.resolvedPrice === null) return 0;
  const size = Number(trade.size);
  const resolvedPrice = Number(trade.resolvedPrice);
  const usdcSpent = Number(trade.usdcSpent);
  return size * resolvedPrice - usdcSpent;
}

export function calculateUnrealizedPnl(
  trade: Trade,
  currentPrice: number
): number {
  if (trade.status !== "OPEN") return 0;
  const size = Number(trade.size);
  const entryPrice = Number(trade.price);
  return size * (currentPrice - entryPrice);
}

export function buildPnlSeries(trades: Trade[]): PnlDataPoint[] {
  const resolved = trades
    .filter((t) => t.status === "RESOLVED" && t.resolvedAt)
    .sort(
      (a, b) =>
        new Date(a.resolvedAt!).getTime() - new Date(b.resolvedAt!).getTime()
    );

  let cumulative = 0;
  return resolved.map((t) => {
    cumulative += calculateRealizedPnl(t);
    return {
      date: new Date(t.resolvedAt!).toISOString().split("T")[0],
      cumulative: Math.round(cumulative * 100) / 100,
    };
  });
}
