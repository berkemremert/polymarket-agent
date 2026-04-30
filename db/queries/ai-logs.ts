import { db } from "@/db";
import { aiLogs } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { AiLog } from "@/lib/types";

export async function getRecentLogs(limit = 20): Promise<AiLog[]> {
  return db
    .select()
    .from(aiLogs)
    .orderBy(desc(aiLogs.createdAt))
    .limit(limit) as Promise<AiLog[]>;
}
