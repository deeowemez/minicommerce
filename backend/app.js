/**
 * app.js
 */
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import productsRoute from './routes/products.js';
import ordersRoute from './routes/orders.js';
import libraryRoute from './routes/library.js'
import cartRoute from './routes/cart.js';

// Admin Imports
import reportRoutes from './routes/admin/reports.js';
import { verifyToken, adminOnly } from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/library', libraryRoute);
app.use('/api/cart', cartRoute);

// Admin Routes
app.use('/api/admin/reports', verifyToken, adminOnly, reportRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
