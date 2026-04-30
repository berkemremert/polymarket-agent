import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { markets, trades, aiLogs } from "@/db/schema";

export type Market = InferSelectModel<typeof markets>;
export type NewMarket = InferInsertModel<typeof markets>;
export type Trade = InferSelectModel<typeof trades>;
export type NewTrade = InferInsertModel<typeof trades>;
export type AiLog = InferSelectModel<typeof aiLogs>;
export type NewAiLog = InferInsertModel<typeof aiLogs>;

export interface AiDecision {
  decision: "BUY" | "SELL" | "SKIP";
  confidence_score: number;
  reasoning: string;
  bet_size_percentage: number;
}

export interface PolymarketToken {
  token_id: string;
  outcome: string;
}

export interface PolymarketMarket {
  condition_id: string;
  question: string;
  outcomes: string[];
  outcome_prices: string[];
  tokens: PolymarketToken[];
  volume_num: string;
  liquidity: string;
  end_date_iso: string;
  active: boolean;
  closed: boolean;
}

export interface PnlDataPoint {
  date: string;
  cumulative: number;
}

export interface AgentCycleResult {
  cycleId: string;
  marketsAnalyzed: number;
  tradesAttempted: number;
  tradesSucceeded: number;
  errors: string[];
}
