/**
 * routes/cart.js
 */

import express from "express";
import { Keys } from "../db/keyBuilder.js";
import { dbConfig } from "../config.js";
import { queryItems, putItem, deleteItem } from "../db/dynamoClient.js";

const router = express.Router();

router.get("/:user_id", async (req, res) => {
  console.log("GET /api/cart/:user_id");

  const { user_id } = req.params, keys = Keys.user(user_id);

  try {
    const params = {
      TableName: dbConfig.TableName,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": keys.pk,
        ":skPrefix": "CART#",
      },
    };

    const result = await queryItems(params);
    res.json({ items: result.Items ?? [] });
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

router.post("/:user_id", async (req, res) => {
  console.log("POST /api/cart/:user_id");

  const { user_id } = req.params
  const { product } = req.body
  const keys = Keys.user(user_id);

  try {
    const params = {
      TableName: dbConfig.TableName,
      Item: {
        pk: keys.pk,
        sk: keys.cartSK(product.id),
        ...product,
      },
      ConditionExpression: "attribute_not_exists(sk)",
    };

    await putItem(params);
    console.log(`Added product ${product.id} to cart for user ${user_id}`);

    res.json({ success: true, message: "Product added to cart" });
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      console.log(`Product ${product.id} already exists in cart`);
      res.json({ success: false, message: "Product already exists in cart" });
    } else {
      console.error("Failed to save product:", err);
      res.status(500).json({ error: "Failed to save product" });
    }
  }
});

router.delete("/:user_id/:product_id", async (req, res) => {
  console.log("DELETE /api/cart/:user_id/:product_id");

  const { user_id, product_id } = req.params;
  const keys = Keys.user(user_id);

  try {
    const params = {
      TableName: dbConfig.TableName,
      Key: {
        pk: keys.pk,
        sk: keys.cartSK(product_id),
      },
    };

    await deleteItem(params);
    console.log(`Removed product ${product_id} from cart for user ${user_id}`);

    res.json({ success: true, message: "Product removed from cart" });
  } catch (err) {
    console.error("Failed to remove product:", err);
    res.status(500).json({ error: "Failed to remove product" });
  }
});

router.delete("/:user_id", async (req, res) => {
  console.log("DELETE /api/cart/:user_id (clear cart)");

  const { user_id } = req.params;
  const keys = Keys.user(user_id);

  try {
    const params = {
      TableName: dbConfig.TableName,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": keys.pk,
        ":skPrefix": "CART#",
      },
    };

    const result = await queryItems(params);

    if (result.Items?.length) {
      for (const item of result.Items) {
        await deleteItem({
          TableName: dbConfig.TableName,
          Key: { pk: item.pk, sk: item.sk },
        });
      }
    }

    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    console.error("Failed to clear cart:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

export default router;
