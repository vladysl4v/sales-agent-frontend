import { getRunTranscript } from "@/lib/happyrobot";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const messages = await getRunTranscript(id);
    return NextResponse.json(messages);
  } catch (e) {
    console.error("[transcript]", String(e));
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
