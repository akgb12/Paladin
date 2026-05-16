# Paladin — Receipt Vault

<p align="center">
  <img src="preview.svg" alt="Paladin — Receipt Vault preview" width="900"/>
</p>

A cloud-native receipt vault. Upload receipt photos, extract structured data, and organize receipts by merchant and date.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Apollo Client, React Router, Tailwind CSS, Recharts |
| Backend | Java 21, Spring Boot 3, Spring for GraphQL |
| Database | DynamoDB Local (dev) / AWS DynamoDB (prod) |
| Storage | Local filesystem (dev) / AWS S3 (prod) |
| Extraction | Mock Textract JSON (dev) / AWS Textract AnalyzeExpense (prod) |
| Container | Docker, Docker Compose |

## Architecture

```
Browser (React)
     |
     | GraphQL over HTTP
     v
Spring Boot (port 8080)
  ├── ReceiptGraphQLController
  ├── ReceiptService
  │     ├── ReceiptExtractionService  (mock or real Textract)
  │     ├── StorageService            (local filesystem or S3)
  │     └── ReceiptDynamoDbRepository
  └── DynamoDbConfig

DynamoDB Local (port 8000)  ←  local dev only
./local-data/receipts/      ←  local image storage
```

## Local Setup

### Prerequisites

- Java 21
- Maven 3.9+
- Node.js 20+
- Docker + Docker Compose

### 1. Start DynamoDB Local

```bash
docker compose up -d
```

Verify it is running:

```bash
curl http://localhost:8000
```

### 2. Start the backend

```bash
cd backend
SPRING_PROFILES_ACTIVE=local mvn spring-boot:run
```

The backend starts on `http://localhost:8080`.
GraphiQL playground is at `http://localhost:8080/graphiql`.
The `PaladinReceipts` DynamoDB table is created automatically on first start.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

## Environment Variables

### Backend

| Variable | Default | Description |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `local` | Use `local` or `aws` |
| `PALADIN_DYNAMODB_TABLE` | `PaladinReceipts` | DynamoDB table name |
| `PALADIN_LOCAL_STORAGE_DIR` | `./local-data/receipts` | Local image storage folder |
| `PALADIN_S3_BUCKET` | `paladin-receipts-dev` | S3 bucket (aws profile only) |
| `AWS_REGION` | `us-east-1` | AWS region |

### Frontend

| Variable | Default | Description |
|---|---|---|
| `VITE_GRAPHQL_URL` | `http://localhost:8080/graphql` | Backend GraphQL endpoint |

## What to Test

1. Open `http://localhost:5173` and verify the Dashboard loads with zero receipts.
2. Go to Upload, pick any image, click Upload and Extract.
3. Verify the extraction result shows merchant, total, and line items.
4. Go to Library and confirm the receipt appears grouped by merchant.
5. Click a receipt row to open Receipt Detail with full fields and line items.
6. Click Edit on the detail page, change a field, and Save. Verify the status becomes Corrected.
7. Use the search filters in Library to filter by merchant or date range.
8. Upload 4-5 receipts and verify the Dashboard shows updated totals and monthly chart.

## GraphQL Operation Examples

### Upload a receipt

```graphql
mutation {
  uploadReceipt(input: {
    fileName: "receipt.jpg"
    contentType: "image/jpeg"
    base64Image: "<base64 string>"
  }) {
    id
    merchantNormalized
    total
    status
  }
}
```

### Get all receipt groups

```graphql
query {
  receiptGroups {
    merchantNormalized
    count
    totalSpend
    receipts {
      id
      receiptDate
      total
      status
    }
  }
}
```

### Search receipts

```graphql
query {
  searchReceipts(input: {
    merchant: "Walmart"
    startDate: "2026-01-01"
    endDate: "2026-12-31"
  }) {
    id
    merchantNormalized
    receiptDate
    total
  }
}
```

### Dashboard summary

```graphql
query {
  dashboardSummary {
    receiptCount
    merchantCount
    totalSpend
    monthlySpend { month total }
    merchantSpend { merchantNormalized total }
  }
}
```

### Update a receipt

```graphql
mutation {
  updateReceipt(input: {
    id: "rec_abc123"
    merchantNormalized: "Whole Foods"
    total: 52.10
  }) {
    id
    merchantNormalized
    total
    status
    manuallyCorrected
  }
}
```

## DynamoDB Access Patterns

| Pattern | Key |
|---|---|
| All receipts for demo user | PK = `USER#demo`, SK begins_with `RECEIPT#` |
| Receipt by ID | Scan all, filter by `receiptId` attribute |
| Receipts by merchant | GSI1 PK = `MERCHANT#<merchantNormalized>` |
| Sorted by receipt date | GSI1 SK = `DATE#<receiptDate>#<receiptId>` |

## AWS Deployment Plan

See `infra/README.md` for full deployment steps. Summary:

1. Switch `SPRING_PROFILES_ACTIVE=aws`.
2. Create DynamoDB table and S3 bucket.
3. Assign an IAM role with DynamoDB + S3 + Textract permissions.
4. Build and push the Docker image to ECR.
5. Deploy to ECS Fargate with an ALB.
6. Build the frontend and upload to S3 + CloudFront.

## Future Improvements

- Real AWS Textract AnalyzeExpense integration.
- Presigned S3 upload URLs to avoid large base64 payloads.
- Authentication (Cognito or Auth.js).
- Receipt image preview in the detail page (served from local storage or S3 CDN URL).
- Pagination for large receipt collections.
- CSV/PDF export.
- Duplicate receipt detection.
