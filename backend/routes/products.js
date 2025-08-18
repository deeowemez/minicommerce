/**
 * routes/products.js
 */

import express from "express";
import { dbConfig } from "../config.js";
import { queryItems } from "../db/docClient.js";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "../db/docClient.js";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: dbConfig.TableName,
        FilterExpression: "begins_with(pk, :pkPrefix) AND sk = :meta",
        ExpressionAttributeValues: {
          ":pkPrefix": "PRODUCT#",
          ":meta": "META",
        },
      })
    );

    res.json(result.Items || []);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get('/:productId', (req, res) => {
  const product = games.find(g => g.id === req.params.productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

export default router;
