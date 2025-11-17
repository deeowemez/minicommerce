/**
 * db/dynamoClient.js
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, DeleteCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
  },
});

export const dynamoClient = DynamoDBDocumentClient.from(client);

export const putItem = async (params) => {
  return await dynamoClient.send(new PutCommand(params));
};

export const getItem = async (params) => {
  return await dynamoClient.send(new GetCommand(params));
};

export const queryItems = async (params) => {
  return await dynamoClient.send(new QueryCommand(params));
};

export const deleteItem = async (params) => {
  return await dynamoClient.send(new DeleteCommand(params));
};

export const batchWriteItems = async (params) => {
  return await dynamoClient.send(new BatchWriteCommand(params));
};
