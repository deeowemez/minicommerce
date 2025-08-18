
/**
 * routes/orders.js
 */

import express from 'express';
import { Keys } from '../db/keyBuilder.js';
import { dbConfig } from '../config.js';
import { putItem } from '../db/docClient.js';

const router = express.Router();

router.post('/:user_id', async (req, res) => {
  console.log('POST /api/orders/:user_id');
  
  const { user_id } = req.params, { items } = req.body, order_id = `${Date.now()}`;
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

  console.log('Saving order item:', order_item);

  try {
    await putItem({
      TableName: dbConfig.TableName,
      Item: order_item,
    });
    res.json({ success: true, order_id });
  } catch (err) {
    console.error('Failed to save order:', err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

export default router;
