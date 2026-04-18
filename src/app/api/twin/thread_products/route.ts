import { NextResponse } from "next/server";
import { getTwinThreadProducts } from "@/lib/happyrobot";

export async function GET() {
  const data = await getTwinThreadProducts();
  return NextResponse.json(data);
}
