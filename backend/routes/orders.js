import express from 'express';
import { Keys } from '../db/keyBuilder.js';
import { dbConfig } from '../config.js';
import { putItem } from '../db/docClient.js';
import { nanoid } from 'nanoid';

const router = express.Router();

router.post('/:user_id', async (req, res) => {
  console.log('POST /api/orders/:user_id');
  
  const { user_id } = req.params;
  const { items } = req.body;
  const id = nanoid(10);
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const keys = Keys.user(user_id);

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items array is required' });
  }

  const order_item = {
    pk: keys.pk,
    sk: keys.orderSK(id),
    id,
    items,
    total,
    createdAt: new Date().toISOString(),
  };

  try {
    await putItem({
      TableName: dbConfig.TableName,
      Item: order_item,
    });

    for (const item of items) {
      const params = {
        TableName: dbConfig.TableName,
        Item: {
          pk: keys.pk,
          sk: keys.librarySK(item.id),
          ...item,
        },
        ConditionExpression: "attribute_not_exists(sk)",
      };

      try {
        await putItem(params);
        console.log(`Added product ${item.id} to library of user ${user_id}`);
      } catch (err) {
        if (err.name === "ConditionalCheckFailedException") {
          console.log(`Product ${item.id} already exists in library, skipping`);
        } else {
          throw err;
        }
      }
    }

    res.json({ success: true, id });
  } catch (err) {
    console.error('❌ Failed to save order:', err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

export default router;
