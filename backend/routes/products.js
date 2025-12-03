/**
 * routes/products.js
 */

import express from "express";
import { dbConfig } from "../config.js";
import {
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "../db/dynamoClient.js";
import { nanoid } from "nanoid";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  console.log('GET /api/products/');
  try {
    const result = await dynamoClient.send(
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

// GET single product
router.get("/:productId", async (req, res) => {
  console.log('GET /api/products/:productId');
  try {
    const { productId } = req.params;
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: dbConfig.TableName,
        Key: {
          pk: `PRODUCT#${productId}`,
          sk: "META",
        },
      })
    );
    if (!result.Item) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.Item);
  } catch (err) {
    console.error("Failed to fetch product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// CREATE product
router.post("/", async (req, res) => {
  console.log('POST /api/products/');
  try {
    const id = nanoid(10);
    const newProduct = {
      pk: `PRODUCT#${id}`,
      sk: "META",
      id,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      isFeatured: req.body.isFeatured || false,
      imageUrl: req.body.imageUrl || null, 
      createdAt: new Date().toISOString(),
    };

    await dynamoClient.send(
      new PutCommand({
        TableName: dbConfig.TableName,
        Item: newProduct,
      })
    );

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Failed to create product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// UPDATE product
router.put("/:productId", async (req, res) => {
  console.log('PUT /api/products/:productId');
  try {
    const { productId } = req.params;
    const { name, description, price, isFeatured, imageUrl } = req.body;

    const result = await dynamoClient.send(
      new UpdateCommand({
        TableName: dbConfig.TableName,
        Key: {
          pk: `PRODUCT#${productId}`,
          sk: "META",
        },
        UpdateExpression: `
          SET #n = :name,
              description = :description,
              price = :price,
              isFeatured = :isFeatured,
              imageUrl = :imageUrl
        `,
        ExpressionAttributeNames: { "#n": "name" },
        ExpressionAttributeValues: {
          ":name": name,
          ":description": description,
          ":price": price,
          ":isFeatured": isFeatured ?? false,
          ":imageUrl": imageUrl || null,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    res.json(result.Attributes);
  } catch (err) {
    console.error("Failed to update product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE product  ✅
router.delete("/:productId", async (req, res) => {
  console.log('DELETE /api/products/:productId');
  try {
    const { productId } = req.params;

    // Check if exists
    const getResult = await dynamoClient.send(
      new GetCommand({
        TableName: dbConfig.TableName,
        Key: { pk: `PRODUCT#${productId}`, sk: "META" },
      })
    );
    if (!getResult.Item) {
      return res.status(404).json({ error: "Product not found" });
    }

    await dynamoClient.send(
      new DeleteCommand({
        TableName: dbConfig.TableName,
        Key: { pk: `PRODUCT#${productId}`, sk: "META" },
      })
    );

    res.json({ message: "Product deleted successfully", deletedId: productId });
  } catch (err) {
    console.error("Failed to delete product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
