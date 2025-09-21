// app/api/search/route.ts
import { NextResponse } from "next/server";
import { client } from "@/lib/opensearch";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    console.log('Search query received:', query);
    
    if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

    const index = process.env.OPENSEARCH_INDEX_PRODUCTS!;
    console.log('Using index:', index);
    
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
    
    console.log('Search body:', JSON.stringify(body, null, 2));

    const resp = await client.search({ index, body });
    console.log('OpenSearch response:', JSON.stringify(resp.body, null, 2));
    
    const hits = resp.body.hits?.hits || [];
    const results = Array.isArray(hits) ? hits.map((h: any) => h._source).filter(Boolean) : [];
    
    console.log('Processed results:', results);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error details:', error);
    return NextResponse.json({ 
      error: "Search failed", 
      details: error instanceof Error ? error.message : 'Unknown error',
      results: [] 
    }, { status: 500 });
  }
}
