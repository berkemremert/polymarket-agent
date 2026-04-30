CREATE TABLE "ai_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"market_condition_id" text,
	"prompt" text NOT NULL,
	"raw_response" text NOT NULL,
	"decision" text,
	"confidence_score" numeric(5, 2),
	"bet_size_percentage" numeric(5, 2),
	"reasoning" text,
	"trade_id" uuid,
	"tokens_used" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "markets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"condition_id" text NOT NULL,
	"question" text NOT NULL,
	"outcomes" jsonb NOT NULL,
	"outcome_prices" jsonb NOT NULL,
	"tokens" jsonb,
	"volume_num" numeric(18, 6),
	"liquidity" numeric(18, 6),
	"end_date" timestamp,
	"active" boolean DEFAULT true,
	"closed" boolean DEFAULT false,
	"fetched_at" timestamp DEFAULT now(),
	CONSTRAINT "markets_condition_id_unique" UNIQUE("condition_id")
);
--> statement-breakpoint
CREATE TABLE "trades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"market_id" uuid,
	"condition_id" text NOT NULL,
	"token_id" text NOT NULL,
	"outcome" text NOT NULL,
	"side" text NOT NULL,
	"price" numeric(10, 6) NOT NULL,
	"size" numeric(18, 6) NOT NULL,
	"usdc_spent" numeric(18, 6) NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"order_hash" text,
	"resolved_at" timestamp,
	"resolved_price" numeric(10, 6),
	"pnl" numeric(18, 6),
	"confidence_score" numeric(5, 2),
	"ai_reasoning" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ai_logs" ADD CONSTRAINT "ai_logs_trade_id_trades_id_fk" FOREIGN KEY ("trade_id") REFERENCES "public"."trades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_market_id_markets_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE no action ON UPDATE no action;