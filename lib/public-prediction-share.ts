import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { predictionShares } from "@/lib/db/schema";
import type { PredictionShareInput } from "@/lib/prediction-share";

export interface PublicPredictionShare extends PredictionShareInput {
  token: string;
  createdAt: number;
}

export function isPredictionShareToken(token: string): boolean {
  return /^[a-f0-9]{32}$/.test(token);
}

export async function getPublicPredictionShare(
  token: string
): Promise<PublicPredictionShare | null> {
  if (!isPredictionShareToken(token)) return null;
  const db = getDb();
  if (!db) return null;

  const rows = await db
    .select({
      token: predictionShares.token,
      step: predictionShares.step,
      pointEstimate: predictionShares.pointEstimate,
      ciLower: predictionShares.ciLower,
      ciUpper: predictionShares.ciUpper,
      createdAt: predictionShares.createdAt,
    })
    .from(predictionShares)
    .where(
      and(
        eq(predictionShares.token, token),
        isNull(predictionShares.revokedAt)
      )
    )
    .limit(1);

  return rows[0] ?? null;
}
