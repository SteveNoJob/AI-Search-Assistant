// scripts/seed-vocab-and-products.ts
import { Client } from "@opensearch-project/opensearch";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import * as dotenv from "dotenv";
dotenv.config({ path: '.env.local' });

const useAWS = process.env.USE_CLOUD_AUTH === 'true';

let clientConfig: any = { node: process.env.OPENSEARCH_ENDPOINT! };

if (useAWS) {
  clientConfig = {
    ...clientConfig,
    ...AwsSigv4Signer({
      region: process.env.CLOUD_REGION || 'us-east-1',
      service: 'es',
      getCredentials: () => {
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
    })
  };
} else if (process.env.OPENSEARCH_USER && process.env.OPENSEARCH_PASS) {
  clientConfig.auth = {
    username: process.env.OPENSEARCH_USER,
    password: process.env.OPENSEARCH_PASS
  };
}

const client = new Client(clientConfig);

async function main(): Promise<void> {
  // 1) Create vocab index with completion suggester
  try {
    await client.indices.delete({ index: process.env.OPENSEARCH_INDEX_VOCAB! }, { ignore: [404] });
  } catch(e){/*ignore*/}

  await client.indices.create({
    index: process.env.OPENSEARCH_INDEX_VOCAB!,
    body: {
      mappings: {
        properties: {
          word: { type: "text" },
          suggest: { type: "completion" }
        }
      }
    }
  });

  const vocab = ["apple","banana","orange","grape","strawberry","laptop","phone","tablet","shirt","book","furniture","game","car","cosmetics"];
  const bulkVocab = vocab.flatMap(w => [{ index: { _index: process.env.OPENSEARCH_INDEX_VOCAB! } }, { word: w, suggest: { input: w } }]);
  await client.bulk({ refresh: true, body: bulkVocab });

  // 2) Create products index
  try {
    await client.indices.delete({ index: process.env.OPENSEARCH_INDEX_PRODUCTS! }, { ignore: [404] });
  } catch(e){/*ignore*/}

  await client.indices.create({
    index: process.env.OPENSEARCH_INDEX_PRODUCTS!,
    body: {
      mappings: {
        properties: {
          id: { type: "keyword" },
          name: { type: "text", fields: { keyword: { type: "keyword" } } },
          description: { type: "text" },
          image: { type: "keyword" },
          price: { type: "double" }
        }
      }
    }
  });

  // sample product docs
  const products = [
    { id: "1", name: "Apple", description: "Fresh red apple, crisp and sweet", image: "", price: 1.2 },
    { id: "2", name: "Banana", description: "Ripe yellow banana, perfect for smoothies", image: "", price: 0.8 },
    { id: "3", name: "Orange", description: "Juicy orange, packed with vitamin C", image: "", price: 1.0 },
    { id: "4", name: "MacBook Pro", description: "Powerful laptop for professionals", image: "", price: 1999.99 },
    { id: "5", name: "iPhone 15", description: "Latest smartphone with advanced features", image: "", price: 999.99 },
    { id: "6", name: "iPad Air", description: "Lightweight tablet for work and play", image: "", price: 599.99 },
    { id: "7", name: "Cotton T-Shirt", description: "Comfortable cotton t-shirt in various colors", image: "", price: 19.99 },
    { id: "8", name: "Programming Book", description: "Learn to code with this comprehensive guide", image: "", price: 39.99 },
    { id: "9", name: "Office Chair", description: "Ergonomic office chair for long work sessions", image: "", price: 299.99 },
    { id: "10", name: "Gaming Console", description: "Next-gen gaming console with 4K graphics", image: "", price: 499.99 },
    { id: "11", name: "Electric Car", description: "Eco-friendly electric vehicle", image: "", price: 45000.00 },
    { id: "12", name: "Face Cream", description: "Anti-aging face cream with natural ingredients", image: "", price: 29.99 }
  ];
  const bulkProducts = products.flatMap(p => [{ index: { _index: process.env.OPENSEARCH_INDEX_PRODUCTS! } }, p]);
  await client.bulk({ refresh: true, body: bulkProducts });

  console.log("Seed finished");
}

main().catch(err => { console.error(err); process.exit(1); });

export {};
