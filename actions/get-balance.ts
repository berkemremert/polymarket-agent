"use server";
import { getPolymarketClient } from "@/lib/polymarket-client";

export async function getWalletBalance(): Promise<number> {
  const client = await getPolymarketClient();
  const result = await client.getBalanceAllowance({ asset_type: "COLLATERAL" } as any);
  // USDC has 6 decimals on Polygon
  return Number(result.balance) / 1e6;
}
