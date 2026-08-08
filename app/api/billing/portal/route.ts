import { NextResponse } from "next/server";

export const runtime = "edge";

/** Kept as a compatibility response for stale clients; subscriptions ended. */
export async function POST(): Promise<Response> {
  return NextResponse.json(
    { error: "Subscriptions are no longer offered. View Lifetime pricing instead." },
    { status: 410 }
  );
}
