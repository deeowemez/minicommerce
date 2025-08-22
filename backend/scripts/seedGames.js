/**
 * scripts/seedGames.js
 */

import { games } from "../db/seeds/games.js";
import { Keys } from "../db/keyBuilder.js";
import { dbConfig } from "../config.js";
import { putItem } from "../db/docClient.js";
import { nanoid } from "nanoid";

async function seedGames() {
  for (const game of games) {
    const id = nanoid(10);
    console.log(`Seeding game: ${game.name} with ID: ${id}`);
    const keys = Keys.product(id);

    const item = {
      pk: keys.pk,
      sk: keys.metaSK,
      id: id,
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
