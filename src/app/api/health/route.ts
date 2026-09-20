export function GET() {
  return Response.json(
    {
      status: "ok",
      service: "phasebench",
      evidence: "synthetic",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
