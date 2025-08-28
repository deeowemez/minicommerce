import express from "express";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Parser } from "json2csv";
import docClient from "../../db/docClient.js";
import { dbConfig } from "../../config.js";    
import { verifyToken, adminOnly } from '../../middleware/authMiddleware.js';

const router = express.Router();

// group the orders by week using ISO week helper
function getWeek(dateStr) {
  const d = new Date(dateStr);
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

// apply middleware admin auth
router.use(verifyToken, adminOnly);

// GET list of weeks
router.get("/", async (req, res) => {
  try {
    console.log("Scanning DynamoDB table:", dbConfig.TableName);
    const data = await docClient.send(new ScanCommand({ TableName: dbConfig.TableName }));
    const orders = data.Items.filter(o => o.sk.startsWith("ORDER#"));

    const grouped = {};
    for (const order of orders) {
      const week = getWeek(order.createdAt);
      if (!grouped[week]) grouped[week] = [];
      grouped[week].push(order);
    }

    res.json(Object.keys(grouped).map(week => ({ week, url: `/api/admin/reports/${week}` })));
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// GET CSV for a specific week
router.get("/:week", async (req, res) => {
  try {
    const { week } = req.params;
    const data = await docClient.send(new ScanCommand({ TableName: dbConfig.TableName }));
    const orders = data.Items.filter(o => o.sk.startsWith("ORDER#"));
    const filtered = orders.filter(o => getWeek(o.createdAt) === week);

    const rows = filtered.map(o => ({
      order_id: o.order_id,
      createdAt: o.createdAt,
      user_id: o.pk,
      total: o.total,
      game_names: o.items.map(i => i.name).join("; "),
    }));

    const parser = new Parser({ fields: ["order_id", "createdAt", "user_id", "game_names", "total"] });
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment(`report-${week}.csv`);
    res.send(csv);
  } catch (err) {
    console.error("Error generating CSV:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

export default router;
