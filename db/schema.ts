import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  uuid,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const markets = pgTable("markets", {
  id: uuid("id").primaryKey().defaultRandom(),
  conditionId: text("condition_id").unique().notNull(),
  question: text("question").notNull(),
  outcomes: jsonb("outcomes").notNull(),
  outcomePrices: jsonb("outcome_prices").notNull(),
  tokens: jsonb("tokens"), // [{ token_id, outcome }]
  volumeNum: numeric("volume_num", { precision: 18, scale: 6 }),
  liquidity: numeric("liquidity", { precision: 18, scale: 6 }),
  endDate: timestamp("end_date"),
  active: boolean("active").default(true),
  closed: boolean("closed").default(false),
  fetchedAt: timestamp("fetched_at").defaultNow(),
});

export const trades = pgTable("trades", {
  id: uuid("id").primaryKey().defaultRandom(),
  marketId: uuid("market_id").references(() => markets.id),
  conditionId: text("condition_id").notNull(),
  tokenId: text("token_id").notNull(),
  outcome: text("outcome").notNull(),
  side: text("side").notNull(), // "BUY" | "SELL"
  price: numeric("price", { precision: 10, scale: 6 }).notNull(),
  size: numeric("size", { precision: 18, scale: 6 }).notNull(),
  usdcSpent: numeric("usdc_spent", { precision: 18, scale: 6 }).notNull(),
  status: text("status").notNull().default("OPEN"), // OPEN | FILLED | CANCELLED | RESOLVED
  orderHash: text("order_hash"),
  resolvedAt: timestamp("resolved_at"),
  resolvedPrice: numeric("resolved_price", { precision: 10, scale: 6 }),
  pnl: numeric("pnl", { precision: 18, scale: 6 }),
  confidenceScore: numeric("confidence_score", { precision: 5, scale: 2 }),
  aiReasoning: text("ai_reasoning"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiLogs = pgTable("ai_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  cycleId: uuid("cycle_id").notNull(),
  marketConditionId: text("market_condition_id"),
  prompt: text("prompt").notNull(),
  rawResponse: text("raw_response").notNull(),
  decision: text("decision"),
  confidenceScore: numeric("confidence_score", { precision: 5, scale: 2 }),
  betSizePercentage: numeric("bet_size_percentage", { precision: 5, scale: 2 }),
  reasoning: text("reasoning"),
  tradeId: uuid("trade_id").references(() => trades.id),
  tokensUsed: integer("tokens_used"),
  createdAt: timestamp("created_at").defaultNow(),
});
