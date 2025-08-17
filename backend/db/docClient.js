/**
 * db/docClient.js
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, DeleteCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
    credentials: {
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export const putItem = async (params) => {
  return await docClient.send(new PutCommand(params));
};

export const getItem = async (params) => {
  return await docClient.send(new GetCommand(params));
};

export const queryItems = async (params) => {
  return await docClient.send(new QueryCommand(params));
};

export const deleteItem = async (params) => {
  return await docClient.send(new DeleteCommand(params));
};

export const batchWriteItems = async (params) => {
  return await docClient.send(new BatchWriteCommand(params));
};

export default docClient;
