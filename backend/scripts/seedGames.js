/**
 * scripts/seedGames.js
 */

import { games } from "../db/seeds/games.js";
import { Keys } from "../db/keyBuilder.js";
import { dbConfig } from "../config.js";
import { putItem } from "../db/docClient.js";

async function seedGames() {
  for (const game of games) {
    const keys = Keys.product(game.id);

    const item = {
      pk: keys.pk,
      sk: keys.metaSK,
      id: game.id,
      name: game.name,
      description: game.description,
      price: game.price,
      imageUrl: game.imageUrl,
      isFeatured: game.isFeatured,
    };

    try {
      await putItem({
        TableName: dbConfig.TableName,
        Item: item,
      });
      console.log(`Seeded: ${game.name}`);
    } catch (err) {
      console.error("Failed to seed", game.name, err);
    }
  }
}

seedGames();
