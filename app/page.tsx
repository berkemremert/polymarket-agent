import { getWalletBalance } from "@/actions/get-balance";
import { getTradeHistory, getOpenTrades, getTotalPnl } from "@/db/queries/trades";
import { getRecentLogs } from "@/db/queries/ai-logs";
import { buildPnlSeries } from "@/lib/pnl";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { PnlChart } from "@/components/dashboard/PnlChart";
import { ActiveBetsTable } from "@/components/dashboard/ActiveBetsTable";
import { AiLogsPanel } from "@/components/dashboard/AiLogsPanel";
import { RunAgentButton } from "@/components/dashboard/RunAgentButton";
import type { Trade, AiLog } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let balance = 0;
  let totalPnl = 0;
  let allTrades: Trade[] = [];
  let openTrades: Trade[] = [];
  let recentLogs: AiLog[] = [];

  const dbAvailable = Boolean(process.env.POSTGRES_URL);

  if (dbAvailable) {
    try {
      [allTrades, openTrades, recentLogs, totalPnl] = await Promise.all([
        getTradeHistory(),
        getOpenTrades(),
        getRecentLogs(),
        getTotalPnl(),
      ]);
    } catch {
      // DB query failed — render with empty state
    }
  }

  try {
    balance = await getWalletBalance();
  } catch {
    // Wallet not connected or env vars missing
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

        {!dbAvailable && (
          <div className="bg-amber-950 border border-amber-800 rounded-xl p-4 text-sm text-amber-300">
            <strong>Setup required:</strong> Add your{" "}
            <code className="bg-amber-900 px-1 rounded">POSTGRES_URL</code>,{" "}
            <code className="bg-amber-900 px-1 rounded">CHATGPT_API_KEY</code>, and{" "}
            <code className="bg-amber-900 px-1 rounded">POLYGON_PRIVATE_KEY</code>{" "}
            to <code className="bg-amber-900 px-1 rounded">.env.local</code>, then run{" "}
            <code className="bg-amber-900 px-1 rounded">npm run db:generate && npm run db:migrate</code>.
          </div>
        )}

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
