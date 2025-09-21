// returns product search results (fuzzy multi_match)

// app/api/search/route.ts
import { NextResponse } from "next/server";
import { client } from "@/lib/opensearch";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

    const index = process.env.OPENSEARCH_INDEX_PRODUCTS!;
    const body = {
      query: {
        multi_match: {
          query,
          fields: ["name^3", "description"],
          fuzziness: "AUTO"
        }
      },
      size: 12
    };

    const resp = await client.search({ index, body });
    const hits = resp.body.hits?.hits || [];
    const results = Array.isArray(hits) ? hits.map((h: any) => h._source).filter(Boolean) : [];
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: "Search failed", results: [] }, { status: 500 });
  }
}
