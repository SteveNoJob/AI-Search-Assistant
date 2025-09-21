// scripts/seed-vocab-and-products.js
const { Client } = require("@opensearch-project/opensearch");
require("dotenv").config();

const client = new Client({
  node: process.env.OPENSEARCH_ENDPOINT,
  auth: process.env.OPENSEARCH_USER ? {
    username: process.env.OPENSEARCH_USER,
    password: process.env.OPENSEARCH_PASS
  } : undefined
});

async function main(){
  // 1) Create vocab index with completion suggester
  try {
    await client.indices.delete({ index: process.env.OPENSEARCH_INDEX_VOCAB }, { ignore: [404] });
  } catch(e){/*ignore*/}

  await client.indices.create({
    index: process.env.OPENSEARCH_INDEX_VOCAB,
    body: {
      mappings: {
        properties: {
          word: { type: "text" },
          suggest: { type: "completion" }
        }
      }
    }
  });

  const vocab = ["apple","banana","orange","grape","strawberry","avocado","pineapple","watermelon","blueberry"];
  const bulkVocab = vocab.flatMap(w => [{ index: { _index: process.env.OPENSEARCH_INDEX_VOCAB } }, { word: w, suggest: { input: w } }]);
  await client.bulk({ refresh: true, body: bulkVocab });

  // 2) Create products index
  try {
    await client.indices.delete({ index: process.env.OPENSEARCH_INDEX_PRODUCTS }, { ignore: [404] });
  } catch(e){/*ignore*/}

  await client.indices.create({
    index: process.env.OPENSEARCH_INDEX_PRODUCTS,
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
    { id: "1", name: "Apple", description: "Fresh red apple", image: "/images/apple.jpg", price: 1.2 },
    { id: "2", name: "Banana", description: "Ripe yellow banana", image: "/images/banana.jpg", price: 0.8 },
    { id: "3", name: "Orange", description: "Juicy orange", image: "/images/orange.jpg", price: 1.0 }
  ];
  const bulkProducts = products.flatMap(p => [{ index: { _index: process.env.OPENSEARCH_INDEX_PRODUCTS } }, p]);
  await client.bulk({ refresh: true, body: bulkProducts });

  console.log("Seed finished");
}

main().catch(err => { console.error(err); process.exit(1); });
