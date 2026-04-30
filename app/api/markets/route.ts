import { NextResponse } from "next/server";
import { getActiveMarkets } from "@/db/queries/markets";

export const dynamic = "force-dynamic";

export async function GET() {
  const activeMarkets = await getActiveMarkets(50);
  return NextResponse.json(activeMarkets);
}
