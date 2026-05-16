# Paladin Infrastructure

AWS deployment notes live here. Not needed for Phase 1 local development.

## Future deployment steps

1. Push backend Docker image to Amazon ECR.
2. Deploy backend to ECS Fargate with an ALB.
3. Create a real DynamoDB table (`PaladinReceipts`) in us-east-1.
4. Create an S3 bucket for receipt images.
5. Enable Amazon Textract AnalyzeExpense API access via IAM role.
6. Build frontend (`npm run build`) and upload `dist/` to S3 + CloudFront.
7. Point `VITE_GRAPHQL_URL` at the ALB DNS name.

## Required IAM permissions (ECS task role)

- dynamodb:PutItem, GetItem, Query, UpdateItem, DeleteItem on PaladinReceipts
- s3:PutObject, GetObject, DeleteObject on paladin-receipts-dev/*
- textract:AnalyzeExpense
