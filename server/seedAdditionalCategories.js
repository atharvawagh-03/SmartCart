const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const newProducts = [
  // Board Games
  { name: "Monopoly Classic Family Board Game", price: 999, category: "Board Games", stock: 150, image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&q=80", views: 1200 },
  { name: "Catan Base Game", price: 2999, category: "Board Games", stock: 80, image: "https://images.unsplash.com/photo-1633535978168-91dbbf5d52cc?w=400&q=80", views: 800 },
  { name: "Ticket to Ride Board Game", price: 3499, category: "Board Games", stock: 60, image: "https://images.unsplash.com/photo-1632214737227-2b3f11904d9c?w=400&q=80", views: 450 },
  { name: "Scrabble Original Word Game", price: 899, category: "Board Games", stock: 200, image: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400&q=80", views: 900 },
  { name: "Clue Classic Mystery Game", price: 1199, category: "Board Games", stock: 100, image: "https://images.unsplash.com/photo-1585675404543-cfb013b1fc47?w=400&q=80", views: 600 },
  { name: "Pandemic Strategy Board Game", price: 2499, category: "Board Games", stock: 75, image: "https://images.unsplash.com/photo-1632516487541-db40b15e215e?w=400&q=80", views: 550 },
  { name: "Sequence Board Game", price: 699, category: "Board Games", stock: 180, image: "https://images.unsplash.com/photo-1633535978168-91dbbf5d52cc?w=400&q=80", views: 400 },
  { name: "Risk Global Domination Game", price: 1599, category: "Board Games", stock: 90, image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&q=80", views: 700 },
  { name: "Codenames Word Game", price: 1299, category: "Board Games", stock: 130, image: "https://images.unsplash.com/photo-1632214737227-2b3f11904d9c?w=400&q=80", views: 850 },
  { name: "Guess Who? Classic Game", price: 799, category: "Board Games", stock: 110, image: "https://images.unsplash.com/photo-1585675404543-cfb013b1fc47?w=400&q=80", views: 350 },

  // Puzzles
  { name: "Ravensburger 1000 Piece Jigsaw Puzzle", price: 1499, category: "Puzzles", stock: 120, image: "https://images.unsplash.com/photo-1502075775765-b772e09ff382?w=400&q=80", views: 400 },
  { name: "Rubik's Cube 3x3", price: 399, category: "Puzzles", stock: 300, image: "https://images.unsplash.com/photo-1591991731833-b4807cf7ef94?w=400&q=80", views: 1500 },
  { name: "Wooden Tetris Puzzle", price: 499, category: "Puzzles", stock: 150, image: "https://images.unsplash.com/photo-1585675404543-cfb013b1fc47?w=400&q=80", views: 300 },
  { name: "3D Crystal Puzzle - Apple", price: 799, category: "Puzzles", stock: 90, image: "https://images.unsplash.com/photo-1502075775765-b772e09ff382?w=400&q=80", views: 250 },
  { name: "Solar System 500 Piece Puzzle", price: 899, category: "Puzzles", stock: 100, image: "https://images.unsplash.com/photo-1591991731833-b4807cf7ef94?w=400&q=80", views: 350 },
  { name: "Metal Brain Teaser Puzzles Set of 6", price: 599, category: "Puzzles", stock: 200, image: "https://images.unsplash.com/photo-1585675404543-cfb013b1fc47?w=400&q=80", views: 420 },
  { name: "Harry Potter 1000 Piece Puzzle", price: 1299, category: "Puzzles", stock: 80, image: "https://images.unsplash.com/photo-1502075775765-b772e09ff382?w=400&q=80", views: 600 },
  { name: "Kids Wooden Alphabet Puzzle", price: 349, category: "Puzzles", stock: 250, image: "https://images.unsplash.com/photo-1591991731833-b4807cf7ef94?w=400&q=80", views: 700 },
  { name: "Custom Photo Jigsaw Puzzle", price: 999, category: "Puzzles", stock: 50, image: "https://images.unsplash.com/photo-1585675404543-cfb013b1fc47?w=400&q=80", views: 900 },
  { name: "Floor Puzzle for Kids - Safari", price: 699, category: "Puzzles", stock: 130, image: "https://images.unsplash.com/photo-1502075775765-b772e09ff382?w=400&q=80", views: 200 },

  // Video Games
  { name: "Sony PlayStation 5 Console", price: 49990, category: "Video Games", stock: 20, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80", views: 5000 },
  { name: "Xbox Series X Console", price: 49990, category: "Video Games", stock: 25, image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=400&q=80", views: 4000 },
  { name: "Nintendo Switch OLED Model", price: 32990, category: "Video Games", stock: 40, image: "https://images.unsplash.com/photo-1578309565780-60f1b2c45fb0?w=400&q=80", views: 3500 },
  { name: "FIFA 24 Standard Edition (PS5)", price: 4499, category: "Video Games", stock: 100, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80", views: 2500 },
  { name: "Marvel's Spider-Man 2 (PS5)", price: 4999, category: "Video Games", stock: 80, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80", views: 3000 },
  { name: "God of War Ragnarök (PS5)", price: 3999, category: "Video Games", stock: 60, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80", views: 2800 },
  { name: "Super Mario Bros. Wonder (Switch)", price: 3999, category: "Video Games", stock: 90, image: "https://images.unsplash.com/photo-1578309565780-60f1b2c45fb0?w=400&q=80", views: 2000 },
  { name: "DualSense Wireless Controller (White)", price: 5490, category: "Video Games", stock: 120, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80", views: 1800 },
  { name: "Xbox Wireless Controller (Carbon Black)", price: 5390, category: "Video Games", stock: 150, image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=400&q=80", views: 1600 },
  { name: "Grand Theft Auto V (PS5)", price: 1999, category: "Video Games", stock: 200, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80", views: 4500 },

  // Dolls
  { name: "Barbie Signature Looks Doll", price: 1999, category: "Dolls", stock: 60, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", views: 800 },
  { name: "L.O.L. Surprise! O.M.G. Fashion Doll", price: 2499, category: "Dolls", stock: 80, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", views: 900 },
  { name: "Disney Princess Rapunzel Fashion Doll", price: 1499, category: "Dolls", stock: 100, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", views: 1200 },
  { name: "Baby Alive Sudsy Styling Doll", price: 3499, category: "Dolls", stock: 50, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", views: 600 },
  { name: "Rainbow High Core Fashion Doll", price: 2999, category: "Dolls", stock: 70, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", views: 750 },
  { name: "Polly Pocket Keepsake Collection", price: 1299, category: "Dolls", stock: 120, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", views: 500 },
  { name: "Enchantimals Doll & Pet Figure", price: 899, category: "Dolls", stock: 150, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", views: 400 },
  { name: "Cabbage Patch Kids Vintage Doll", price: 3999, category: "Dolls", stock: 30, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", views: 1100 },
  { name: "American Girl WellieWishers Doll", price: 5999, category: "Dolls", stock: 25, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", views: 1300 },
  { name: "Monster High Draculaura Doll", price: 2199, category: "Dolls", stock: 65, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", views: 850 },

  // Action Figures
  { name: "Marvel Legends Iron Man Action Figure", price: 2299, category: "Action Figures", stock: 90, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80", views: 1500 },
  { name: "Star Wars The Black Series Darth Vader", price: 2499, category: "Action Figures", stock: 75, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80", views: 1800 },
  { name: "Transformers Studio Series Bumblebee", price: 1999, category: "Action Figures", stock: 100, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80", views: 1400 },
  { name: "Batman DC Multiverse Action Figure", price: 1799, category: "Action Figures", stock: 110, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80", views: 1200 },
  { name: "Bandai Anime Heroes Naruto Uzumaki", price: 1599, category: "Action Figures", stock: 130, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80", views: 1100 },
  { name: "Jurassic World Super Colossal T-Rex", price: 4999, category: "Action Figures", stock: 40, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80", views: 2200 },
  { name: "G.I. Joe Classified Series Snake Eyes", price: 2199, category: "Action Figures", stock: 60, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80", views: 900 },
  { name: "NECA Teenage Mutant Ninja Turtles", price: 3499, category: "Action Figures", stock: 50, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80", views: 1600 },
  { name: "Masters of the Universe He-Man", price: 1499, category: "Action Figures", stock: 150, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80", views: 800 },
  { name: "Funko Pop! Animation: Goku", price: 999, category: "Action Figures", stock: 200, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80", views: 2500 },

  // Outdoor Toys
  { name: "Nerf Elite 2.0 Motorized Blaster", price: 2999, category: "Outdoor Toys", stock: 85, image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80", views: 1700 },
  { name: "Kids 3-Wheel Kick Scooter with LEDs", price: 1499, category: "Outdoor Toys", stock: 120, image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80", views: 1100 },
  { name: "Giant Bubble Wand Kit", price: 499, category: "Outdoor Toys", stock: 250, image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80", views: 600 },
  { name: "Super Soaker Water Blaster", price: 799, category: "Outdoor Toys", stock: 300, image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80", views: 1900 },
  { name: "Flybar Foam Pogo Jumper", price: 999, category: "Outdoor Toys", stock: 150, image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80", views: 950 },
  { name: "Reusable Water Balloons (Pack of 12)", price: 599, category: "Outdoor Toys", stock: 400, image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80", views: 1400 },
  { name: "Kids Pop-Up Play Tent", price: 1299, category: "Outdoor Toys", stock: 90, image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80", views: 800 },
  { name: "Trampoline with Enclosure Net (6ft)", price: 8999, category: "Outdoor Toys", stock: 30, image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80", views: 2300 },
  { name: "Spikeball Standard Game Set", price: 4999, category: "Outdoor Toys", stock: 50, image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80", views: 1800 },
  { name: "Adjustable Roller Skates for Kids", price: 1899, category: "Outdoor Toys", stock: 110, image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80", views: 1500 },

  // Sports Equipment
  { name: "Wilson US Open Tennis Racket", price: 3499, category: "Sports Equipment", stock: 70, image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&q=80", views: 1200 },
  { name: "Spalding NBA Zi/O Indoor-Outdoor Basketball", price: 2999, category: "Sports Equipment", stock: 90, image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80", views: 1500 },
  { name: "Adidas Predator Edge Football", price: 1999, category: "Sports Equipment", stock: 120, image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80", views: 1800 },
  { name: "Grip Power Pads Lifting Straps", price: 499, category: "Sports Equipment", stock: 250, image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80", views: 900 },
  { name: "Puma Cricket Batting Gloves", price: 1299, category: "Sports Equipment", stock: 85, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80", views: 700 },
  { name: "Yonex Mavis 350 Nylon Shuttlecocks", price: 899, category: "Sports Equipment", stock: 300, image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80", views: 2200 },
  { name: "Kookaburra Kahuna Cricket Bat", price: 5999, category: "Sports Equipment", stock: 40, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80", views: 1900 },
  { name: "Nike Mercurial Lite Shin Guards", price: 1499, category: "Sports Equipment", stock: 140, image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80", views: 1100 },
  { name: "Decathlon Artengo Table Tennis Bat", price: 599, category: "Sports Equipment", stock: 180, image: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=400&q=80", views: 600 },
  { name: "Nivia Heavy Duty Skipping Rope", price: 299, category: "Sports Equipment", stock: 350, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80", views: 1300 },

  // School Supplies
  { name: "Faber-Castell 24 Bi-Colour Pencils", price: 250, category: "School Supplies", stock: 500, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80", views: 2100 },
  { name: "Classmate Pulse 6-Subject Spiral Notebook", price: 180, category: "School Supplies", stock: 400, image: "https://images.unsplash.com/photo-1531346878377-a541e4a115fc?w=400&q=80", views: 1800 },
  { name: "Parker Vector Standard Roller Ball Pen", price: 350, category: "School Supplies", stock: 250, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80", views: 1500 },
  { name: "Wildcraft Graphic Print School Backpack", price: 1499, category: "School Supplies", stock: 150, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", views: 2500 },
  { name: "Camel Artist Acrylic Colors (12 Tubes)", price: 399, category: "School Supplies", stock: 300, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80", views: 1200 },
  { name: "Milton Thermosteel Water Bottle (1L)", price: 999, category: "School Supplies", stock: 200, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80", views: 3000 },
  { name: "Casio FX-991ES Plus Scientific Calculator", price: 1199, category: "School Supplies", stock: 180, image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&q=80", views: 2800 },
  { name: "Maped GeoCustom Geometry Box", price: 199, category: "School Supplies", stock: 450, image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80", views: 1600 },
  { name: "Cello Maxriter Ball Pen Set (Pack of 10)", price: 100, category: "School Supplies", stock: 600, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80", views: 2000 },
  { name: "Apsara Platinum Pencils (Pack of 10)", price: 50, category: "School Supplies", stock: 800, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80", views: 1400 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const categoryCounts = {};
    let added = 0;
    let skipped = 0;

    for (const p of newProducts) {
      const exists = await Product.findOne({ name: p.name });
      if (exists) {
        console.log(`⚠️  Skipped (already exists): ${p.name}`);
        skipped++;
        continue;
      }
      await Product.create(p);
      console.log(`✅ Added [${p.category}]: ${p.name} — ₹${p.price.toLocaleString("en-IN")}`);
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      added++;
    }

    console.log("\n─────────────────────────────────────────");
    console.log(`🎉 Seeding complete!`);
    console.log(`   ${added} products added, ${skipped} skipped\n`);
    console.log("   Breakdown:");
    for (const [cat, count] of Object.entries(categoryCounts)) {
      if (count > 0) console.log(`   • ${cat}: ${count} products`);
    }
    console.log("─────────────────────────────────────────");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seed();
