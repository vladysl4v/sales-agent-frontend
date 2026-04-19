export async function GET() {
  return Response.json({ error: "deprecated" }, { status: 410 });
}
