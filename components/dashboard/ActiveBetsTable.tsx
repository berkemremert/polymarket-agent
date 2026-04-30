"use client";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Trade } from "@/lib/types";

interface Props {
  trades: Trade[];
}

export function ActiveBetsTable({ trades }: Props) {
  return (
    <Card>
      <h2 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">
        Active Bets
      </h2>
      {trades.length === 0 ? (
        <p className="text-zinc-500 text-sm">No open positions</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 border-b border-zinc-800">
                <th className="pb-2 font-medium">Market</th>
                <th className="pb-2 font-medium">Side</th>
                <th className="pb-2 font-medium text-right">Entry</th>
                <th className="pb-2 font-medium text-right">Wagered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {trades.map((trade) => (
                <tr key={trade.id} className="py-2">
                  <td className="py-2 pr-2 max-w-[180px] truncate text-zinc-200">
                    {trade.outcome}
                  </td>
                  <td className="py-2">
                    <Badge variant={trade.side === "BUY" ? "success" : "danger"}>
                      {trade.outcome} {trade.side}
                    </Badge>
                  </td>
                  <td className="py-2 text-right text-zinc-300">
                    {(Number(trade.price) * 100).toFixed(1)}¢
                  </td>
                  <td className="py-2 text-right text-zinc-300">
                    ${Number(trade.usdcSpent).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
