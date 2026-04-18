import { NextResponse } from "next/server";
import { getTwinThreads } from "@/lib/happyrobot";

export async function GET() {
  const data = await getTwinThreads();
  return NextResponse.json(data);
}
