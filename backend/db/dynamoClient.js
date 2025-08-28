/**
 * db/dynamoClient.js
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
  },
});

const dynamodb = DynamoDBDocumentClient.from(client);

export default dynamodb;
