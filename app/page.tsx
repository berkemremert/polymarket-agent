import { getWalletBalance } from "@/actions/get-balance";
import { getTradeHistory, getOpenTrades, getTotalPnl } from "@/db/queries/trades";
import { getRecentLogs } from "@/db/queries/ai-logs";
import { buildPnlSeries } from "@/lib/pnl";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { PnlChart } from "@/components/dashboard/PnlChart";
import { ActiveBetsTable } from "@/components/dashboard/ActiveBetsTable";
import { AiLogsPanel } from "@/components/dashboard/AiLogsPanel";
import { RunAgentButton } from "@/components/dashboard/RunAgentButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let balance = 0;
  let totalPnl = 0;

  const [allTrades, openTrades, recentLogs] = await Promise.all([
    getTradeHistory(),
    getOpenTrades(),
    getRecentLogs(),
  ]);

  try {
    [balance, totalPnl] = await Promise.all([
      getWalletBalance(),
      getTotalPnl(),
    ]);
  } catch {
    // Wallet not connected or env vars missing — dashboard still renders
  }

  const pnlSeries = buildPnlSeries(allTrades);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Polymarket Agent
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              AI-powered prediction market trading
            </p>
          </div>
          <RunAgentButton />
        </div>

        <WalletCard
          balance={balance}
          totalPnl={totalPnl}
          openPositions={openTrades.length}
        />

        <PnlChart data={pnlSeries} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActiveBetsTable trades={openTrades} />
          <AiLogsPanel logs={recentLogs} />
        </div>
      </div>
    </main>
  );
}
