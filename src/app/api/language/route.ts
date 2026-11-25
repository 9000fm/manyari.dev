const LATIN_AMERICA = new Set([
  "AR", "BO", "BR", "CL", "CO", "CR", "CU", "DO", "EC", "SV", "GT", "HN", "MX", "NI", "PA", "PY", "PE", "PR", "UY", "VE", "HT", "GF", "GP", "MQ", "BL", "MF",
]);

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const country = (request.headers.get("x-vercel-ip-country") ?? "").toUpperCase();
  const language = LATIN_AMERICA.has(country) ? "es" : "en";
  return Response.json({ language }, { headers: { "Cache-Control": "no-store", Vary: "X-Vercel-IP-Country" } });
}
