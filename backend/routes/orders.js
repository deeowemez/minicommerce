import express from 'express';
import { Keys } from '../db/keyBuilder.js';
import { dbConfig } from '../config.js';
import { putItem } from '../db/docClient.js';

const router = express.Router();

router.post('/:user_id', async (req, res) => {
  console.log('POST /api/orders/:user_id');
  
  const { user_id } = req.params;
  const { items } = req.body;
  const order_id = `${Date.now()}`;
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const keys = Keys.user(user_id);

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items array is required' });
  }

  const order_item = {
    pk: keys.pk,
    sk: keys.orderSK(order_id),
    order_id,
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
      const productId = item.productId ?? item.id;
      const params = {
        TableName: dbConfig.TableName,
        Item: {
          pk: keys.pk,
          sk: keys.librarySK(productId),
          ...item,
          productId,
        },
        ConditionExpression: "attribute_not_exists(sk)",
      };

      try {
        await putItem(params);
        console.log(`Added product ${productId} to library of user ${user_id}`);
      } catch (err) {
        if (err.name === "ConditionalCheckFailedException") {
          console.log(`Product ${productId} already exists in library, skipping`);
        } else {
          throw err;
        }
      }
    }

    res.json({ success: true, order_id });
  } catch (err) {
    console.error('❌ Failed to save order:', err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

export default router;
