import { getContacts } from "@/lib/happyrobot";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contacts = await getContacts();
    return NextResponse.json(contacts);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
