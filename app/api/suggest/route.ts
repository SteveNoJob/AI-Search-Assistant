// returns suggestions (vocab completion/fuzzy)
// app/api/suggest/route.ts
import { NextResponse } from "next/server";
import { client } from "@/lib/opensearch"; // or import helper functions

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    console.log('Suggest query received:', query);
    
    if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

    const index = process.env.OPENSEARCH_INDEX_VOCAB!;
    console.log('Using vocab index:', index);
    
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
    
    console.log('Suggest body:', JSON.stringify(body, null, 2));

    const resp = await client.search({ index, body });
    console.log('Suggest response:', JSON.stringify(resp.body, null, 2));
    
    const opts = resp.body.suggest?.vocab_suggest?.[0]?.options || [];
    const suggestions = Array.isArray(opts) ? opts.map((o: any) => o.text) : [];
    
    console.log('Processed suggestions:', suggestions);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Suggest error details:', error);
    return NextResponse.json({ 
      error: "Suggest failed", 
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestions: [] 
    }, { status: 500 });
  }
}
