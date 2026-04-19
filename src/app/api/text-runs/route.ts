import { getTextAgentRuns } from "@/lib/happyrobot";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const runs = await getTextAgentRuns();
    return NextResponse.json(runs);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
