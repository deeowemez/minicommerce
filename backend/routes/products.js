/**
 * routes/products.js
 */

import express from 'express';

const router = express.Router();

const games = [
  {
    id: '1',
    name: 'Elden Ring',
    description: 'An open-world action RPG by FromSoftware. Explore the Lands Between and become the Elden Lord.',
    price: 2499,
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Cyberpunk 2077',
    description: 'A futuristic RPG set in Night City. Become a cyber-enhanced mercenary in this open-world adventure.',
    price: 1999,
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
    isFeatured: false,
  },
  {
    id: '3',
    name: 'Stardew Valley',
    description: 'A relaxing farming simulator. Grow crops, raise animals, and build relationships in Pelican Town.',
    price: 499,
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg',
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Hades',
    description: 'Battle your way out of the Underworld in this roguelike dungeon crawler from Supergiant Games.',
    price: 799,
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg',
    isFeatured: false,
  },
  {
    id: '5',
    name: 'Baldur’s Gate 3',
    description: 'A story-rich, party-based RPG set in the Dungeons & Dragons universe.',
    price: 2999,
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg',
    isFeatured: true,
  },
];

router.get('/', (req, res) => {
  res.json(games);
});

router.get('/:productId', (req, res) => {
  const product = games.find(g => g.id === req.params.productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

export default router;
