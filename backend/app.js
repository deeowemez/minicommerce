/**
 * app.js
 */


import express from 'express';
import cors from 'cors';
import productsRoute from './routes/products.js';
import ordersRoute from './routes/orders.js';
import libraryRoute from './routes/library.js'
import cartRoute from './routes/cart.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/library', libraryRoute);
app.use('/api/cart', cartRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
