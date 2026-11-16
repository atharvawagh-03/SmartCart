const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Product = require('./models/Product');

const URL_REPLACEMENTS = {
  // Xbox Series X & controllers
  "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=400&q=80": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80",
  // Nintendo Switch OLED & Switch games
  "https://images.unsplash.com/photo-1578309565780-60f1b2c45fb0?w=400&q=80": "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80",
  // Board games - Ticket to Ride, Codenames
  "https://images.unsplash.com/photo-1632214737227-2b3f11904d9c?w=400&q=80": "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&q=80",
  // Board games - Catan, Sequence
  "https://images.unsplash.com/photo-1633535978168-91dbbf5d52cc?w=400&q=80": "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&q=80",
  // Board games & puzzles - Clue, Guess Who, Tetris, Metal puzzle
  "https://images.unsplash.com/photo-1585675404543-cfb013b1fc47?w=400&q=80": "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&q=80",
  // Board games - Pandemic
  "https://images.unsplash.com/photo-1632516487541-db40b15e215e?w=400&q=80": "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&q=80",
  // Puzzles - Ravensburger, Crystal, Harry Potter, Safari
  "https://images.unsplash.com/photo-1502075775765-b772e09ff382?w=400&q=80": "https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?w=400&q=80",
  // School Supplies - Notebook
  "https://images.unsplash.com/photo-1531346878377-a541e4a115fc?w=400&q=80": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&q=80",
  // seedData.js - Electronics
  "https://images.unsplash.com/photo-1527443224154-c4a573d5f5ac?w=400&q=80": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
  // seedSportsToysKids.js - Kids toys
  "https://images.unsplash.com/photo-1503944168849-8bf86875bebe?w=400&q=80": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80",
  // seedSportsToysKids.js - Sports / Toy
  "https://images.unsplash.com/photo-1562183241-b937e9d94d73?w=400&q=80": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80",
  // seedWomenProducts.js - Cosmetics
  "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
  // seedWomenProducts.js - Skincare
  "https://images.unsplash.com/photo-1596285508507-5da817c3b8e0?w=400&q=80": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
  // seedWomenProducts.js - Women's dress
  "https://images.unsplash.com/photo-1583241800698-e8ab01830a63?w=400&q=80": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80",
  // seedWomenProducts.js - Fashion
  "https://images.unsplash.com/photo-1631214524020-3c69b8a535a4?w=400&q=80": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80"
};

const PRODUCT_SPECIFIC_OVERRIDES = {
  "Xbox Wireless Controller (Carbon Black)": "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&q=80",
  "Super Mario Bros. Wonder (Switch)": "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&q=80",
  "Rubik's Cube 3x3": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80",
  "Wooden Tetris Puzzle": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80",
  "Metal Brain Teaser Puzzles Set of 6": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80"
};

async function fixSeedFiles() {
  const seedFiles = [
    path.join(__dirname, 'seedData.js'),
    path.join(__dirname, 'seedAdditionalCategories.js'),
    path.join(__dirname, 'seedSportsToysKids.js'),
    path.join(__dirname, 'seedWomenProducts.js')
  ];

  for (const filePath of seedFiles) {
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');
    let replacedCount = 0;

    for (const [badUrl, goodUrl] of Object.entries(URL_REPLACEMENTS)) {
      if (content.includes(badUrl)) {
        content = content.replaceAll(badUrl, goodUrl);
        replacedCount++;
      }
    }

    // Apply product-specific overrides in content if matching line exists
    for (const [productName, goodUrl] of Object.entries(PRODUCT_SPECIFIC_OVERRIDES)) {
      const regex = new RegExp(`name:\\s*["']${productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'],[\\s\\S]*?image:\\s*["']([^"']+)["']`);
      const match = content.match(regex);
      if (match && match[1] !== goodUrl) {
        content = content.replace(match[0], match[0].replace(match[1], goodUrl));
        replacedCount++;
      }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${path.basename(filePath)} (${replacedCount} replacements)`);
  }
}

async function fixDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartcart');
    console.log('Connected to MongoDB.');

    // 1. Fix by bad URL
    let totalUpdated = 0;
    for (const [badUrl, goodUrl] of Object.entries(URL_REPLACEMENTS)) {
      const res = await Product.updateMany({ image: badUrl }, { $set: { image: goodUrl } });
      if (res.modifiedCount > 0) {
        console.log(`Updated ${res.modifiedCount} products from broken URL -> ${goodUrl.slice(0, 45)}...`);
        totalUpdated += res.modifiedCount;
      }
    }

    // 2. Fix specific products
    for (const [productName, goodUrl] of Object.entries(PRODUCT_SPECIFIC_OVERRIDES)) {
      const res = await Product.updateMany({ name: productName }, { $set: { image: goodUrl } });
      if (res.modifiedCount > 0) {
        console.log(`Updated override for "${productName}"`);
        totalUpdated += res.modifiedCount;
      }
    }

    console.log(`Successfully updated ${totalUpdated} products in MongoDB!`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Database update error:', err.message);
  }
}

async function main() {
  console.log('=== Step 1: Updating Seed Files ===');
  await fixSeedFiles();

  console.log('\n=== Step 2: Updating MongoDB Database ===');
  await fixDatabase();

  console.log('\nAll images fixed successfully!');
}

main();
