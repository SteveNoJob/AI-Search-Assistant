// returns suggestions (vocab completion/fuzzy)
// app/api/suggest/route.ts
import { NextResponse } from "next/server";
import { client } from "@/lib/opensearch"; // or import helper functions

export async function POST(req: Request) {
  const { query } = await req.json();
  if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  const index = process.env.OPENSEARCH_INDEX_VOCAB!;
  const body = {
    suggest: {
      vocab_suggest: {
        prefix: query,
        completion: {
          field: "suggest",
          fuzzy: { fuzziness: 1 },
          size: 6
        }
      }
    }
  };

  const resp = await client.search({ index, body });
  const opts = resp.body.suggest?.vocab_suggest?.[0]?.options || [];
  const suggestions = opts.map((o: any) => o.text);
  return NextResponse.json({ suggestions });
}
