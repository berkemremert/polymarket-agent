import { Card } from "@/components/ui/Card";

interface Props {
  balance: number;
  totalPnl: number;
  openPositions: number;
}

export function WalletCard({ balance, totalPnl, openPositions }: Props) {
  const pnlColor =
    totalPnl > 0
      ? "text-emerald-400"
      : totalPnl < 0
        ? "text-red-400"
        : "text-zinc-400";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
          Wallet Balance
        </p>
        <p className="text-3xl font-bold text-white">
          ${balance.toFixed(2)}
          <span className="text-sm font-normal text-zinc-500 ml-1">USDC</span>
        </p>
      </Card>

      <Card>
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
          Total PnL
        </p>
        <p className={`text-3xl font-bold ${pnlColor}`}>
          {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
          <span className="text-sm font-normal text-zinc-500 ml-1">USDC</span>
        </p>
      </Card>

      <Card>
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
          Open Positions
        </p>
        <p className="text-3xl font-bold text-white">{openPositions}</p>
      </Card>
    </div>
  );
}
