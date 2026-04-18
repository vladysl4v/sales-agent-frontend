import { NextResponse } from "next/server";
import { getTwinAccounts } from "@/lib/happyrobot";

export async function GET() {
  const data = await getTwinAccounts();
  return NextResponse.json(data);
}
