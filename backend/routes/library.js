/**
 * routes/library.js
 */

import express from 'express';
import { Keys } from '../db/keyBuilder.js';
import { dbConfig } from '../config.js';
import { queryItems, putItem, deleteItem } from '../db/docClient.js';

const router = express.Router();

router.get('/:user_id', async (req, res) => {
  console.log('GET /api/library/:user_id');

  const { user_id } = req.params;
  const keys = Keys.user(user_id);

  try {
    const params = {
      TableName: dbConfig.TableName,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': keys.pk,
        ':skPrefix': 'LIBRARY#',
      },
    };

    const result = await queryItems(params);
    res.json(result.Items ?? []);
  } catch (error) {
    console.error('Failed to fetch library items:', error);
    res.status(500).json({ error: 'Failed to fetch library items' });
  }

});

router.post("/:user_id", async (req, res) => {
  console.log("POST /api/library/:user_id");

  const { user_id } = req.params
  const { products } = req.body
  const keys = Keys.user(user_id);

  try {
    for (const product of products) {
      const params = {
        TableName: dbConfig.TableName,
        Item: {
          pk: keys.pk,
          sk: keys.librarySK(product.id),
          ...item,
        },
        ConditionExpression: "attribute_not_exists(sk)",
      };

      try {
        await putItem(params);
        console.log(`Added item ${item.id} to user ${user_id}`);
      } catch (err) {
        if (err.name === "ConditionalCheckFailedException") {
          console.log(`Item ${item.id} already exists, skipping`);
        } else {
          throw err;
        }
      }
    }

    res.json({ success: true, message: "Items processed" });
  } catch (err) {
    console.error("Failed to save items:", err);
    res.status(500).json({ error: "Failed to save items" });
  }
});

router.delete("/:user_id/:product_id", async (req, res) => {
  console.log("DELETE /api/library/:user_id/:product_id");

  const { user_id, product_id } = req.params;
  const keys = Keys.user(user_id);

  try {
    const params = {
      TableName: dbConfig.TableName,
      Key: {
        pk: keys.pk,
        sk: keys.librarySK(product_id), 
      },
    };

    await deleteItem(params);
    console.log(`Removed product ${product_id} from library of user ${user_id}`);
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    console.error("Failed to remove item:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
});


 
export default router;