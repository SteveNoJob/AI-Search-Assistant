// lib/opensearch.ts
import { Client } from "@opensearch-project/opensearch";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";

const node = process.env.OPENSEARCH_ENDPOINT!;
const username = process.env.OPENSEARCH_USER;
const password = process.env.OPENSEARCH_PASS;
const useAWS = process.env.USE_AWS_AUTH === 'true';

export const client = new Client({
  node,
  ...(useAWS ? {
    ...AwsSigv4Signer({
      region: process.env.AWS_REGION || 'us-east-1',
      service: 'es',
      getCredentials: () => {
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
    })
  } : {
    auth: username ? { username, password } : undefined
  })
});

export async function suggestVocab(prefix: string, size = 6) {
  const index = process.env.OPENSEARCH_INDEX_VOCAB!;
  const body = {
    suggest: {
      vocab_suggest: {
        prefix,
        completion: {
          field: "suggest",
          fuzzy: { fuzziness: 1 },
          size
        }
      }
    }
  };

  const resp = await client.search({ index, body });
  const opts = resp.body.suggest?.vocab_suggest?.[0]?.options || [];
  return opts.map((o: any) => o.text);
}

export async function fuzzySearchProducts(query: string, size = 12) {
  const index = process.env.OPENSEARCH_INDEX_PRODUCTS!;
  const body = {
    query: {
      multi_match: {
        query,
        fields: ["name^3", "description"],
        fuzziness: "AUTO"
      }
    },
    size
  };
  const resp = await client.search({ index, body });
  return resp.body.hits?.hits?.map((h: any) => h._source) || [];
}
