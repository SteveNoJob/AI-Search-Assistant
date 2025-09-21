# OpenSearch Setup Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Set up OpenSearch
You have several options:

### Option A: AWS OpenSearch Service
1. Create an OpenSearch domain in AWS
2. Get the endpoint URL
3. Set up authentication (username/password or IAM)

### Option B: Local OpenSearch (Docker)
```bash
docker run -d \
  --name opensearch \
  -p 9200:9200 -p 9600:9600 \
  -e "discovery.type=single-node" \
  -e "OPENSEARCH_INITIAL_ADMIN_PASSWORD=YourPassword123!" \
  opensearchproject/opensearch:latest
```

### Option C: OpenSearch Cloud
1. Sign up at opensearch.org
2. Create a cluster
3. Get connection details

## 3. Configure Environment Variables
Edit `.env.local` with your OpenSearch details:

```env
OPENSEARCH_ENDPOINT=https://your-domain.us-east-1.es.amazonaws.com
OPENSEARCH_USER=admin
OPENSEARCH_PASS=YourPassword123!
OPENSEARCH_INDEX_VOCAB=vocab
OPENSEARCH_INDEX_PRODUCTS=products
```

## 4. Seed the Database
```bash
npm run seed
```

## 5. Start the Application
```bash
npm run dev
```

## Troubleshooting
- Ensure OpenSearch is running and accessible
- Check network connectivity
- Verify credentials are correct
- Check OpenSearch logs for errors