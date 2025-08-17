/**
 * scripts/createDbTable.js
 */

import dynamodb from '../db/dynamoClient.js';
import { ListTablesCommand, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { dbConfig } from '../../config.js';

const params = {
  TableName: dbConfig.TableName,
  KeySchema: [
    { AttributeName: 'pk', KeyType: 'HASH' },
    { AttributeName: 'sk', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'pk', AttributeType: 'S' },
    { AttributeName: 'sk', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

const createIfNotExist = async () => {
  try {
    const { TableNames } = await dynamodb.send(new ListTablesCommand({}));
    if (TableNames.includes(dbConfig.TableName)) {
      console.log(`Table "${dbConfig.TableName}" already exists — skipping creation.`);
      return;
    }
    const data = await dynamodb.send(new CreateTableCommand(params));
    console.log("Table Created", data);
  } catch (err) {
    console.error("Error creating table", err);
  }
};

createIfNotExist();
