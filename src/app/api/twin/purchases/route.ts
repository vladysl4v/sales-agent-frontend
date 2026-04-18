import { NextResponse } from "next/server";
import { getTwinPurchases } from "@/lib/happyrobot";

export async function GET() {
  const data = await getTwinPurchases();
  return NextResponse.json(data);
}
