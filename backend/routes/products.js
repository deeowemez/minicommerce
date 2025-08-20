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
import docClient from "../db/docClient.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  console.log('GET /api/products/');
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

// GET single product
router.get("/:productId", async (req, res) => {
  console.log('GET /api/products/:productId');
  try {
    const { productId } = req.params;
    const result = await docClient.send(
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
    const id = uuidv4();
    const newProduct = {
      pk: `PRODUCT#${id}`,
      sk: "META",
      id,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      isFeatured: req.body.isFeatured || false,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(
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
    const { name, description, price, isFeatured } = req.body;

    const result = await docClient.send(
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
              isFeatured = :isFeatured
        `,
        ExpressionAttributeNames: { "#n": "name" },
        ExpressionAttributeValues: {
          ":name": name,
          ":description": description,
          ":price": price,
          ":isFeatured": isFeatured ?? false,
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
    const getResult = await docClient.send(
      new GetCommand({
        TableName: dbConfig.TableName,
        Key: { pk: `PRODUCT#${productId}`, sk: "META" },
      })
    );
    if (!getResult.Item) {
      return res.status(404).json({ error: "Product not found" });
    }

    await docClient.send(
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
