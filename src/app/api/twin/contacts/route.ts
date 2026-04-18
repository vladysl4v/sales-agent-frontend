import { NextResponse } from "next/server";
import { getTwinContacts } from "@/lib/happyrobot";

export async function GET() {
  const data = await getTwinContacts();
  return NextResponse.json(data);
}
