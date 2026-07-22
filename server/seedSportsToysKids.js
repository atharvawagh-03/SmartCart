const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

/**
 * Seed file — Sports, Toys, Kids Clothing
 * 18 products per category = 54 total
 *
 * Prices are realistic Indian market prices (INR) as of mid-2026.
 * All images are from Unsplash (free, no hotlink restrictions, always loads).
 * Pattern matches existing seedWomenProducts.js — skips duplicates by name.
 */
const newProducts = [

  // ─────────────────────────────────────────────────────────────────────────────
  // SPORTS (18 products)
  // Brands: Nike, Adidas, Cosco, Nivia, Yonex, Decathlon, Puma, SG, MRF, Reebok
  // ─────────────────────────────────────────────────────────────────────────────

  {
    name: "Nivia Dominator Basketball (Size 7)",
    price: 1299,
    category: "Sports",
    stock: 120,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80",
    views: 340,
  },
  {
    name: "Cosco Champion Football (Size 5)",
    price: 899,
    category: "Sports",
    stock: 200,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80",
    views: 410,
  },
  {
    name: "Yonex Nanoray 7000i Badminton Racket",
    price: 2499,
    category: "Sports",
    stock: 85,
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80",
    views: 520,
  },
  {
    name: "SG RSD Xtreme Cricket Bat (English Willow)",
    price: 4299,
    category: "Sports",
    stock: 40,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80",
    views: 680,
  },
  {
    name: "Nike Dri-FIT Running T-Shirt",
    price: 1499,
    category: "Sports",
    stock: 250,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    views: 390,
  },
  {
    name: "Adidas Tiro 23 Track Pants",
    price: 2199,
    category: "Sports",
    stock: 180,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80",
    views: 310,
  },
  {
    name: "Decathlon Kipsta Volleyball (Size 5)",
    price: 799,
    category: "Sports",
    stock: 150,
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80",
    views: 220,
  },
  {
    name: "Puma Flex Essential Running Shoes",
    price: 3499,
    category: "Sports",
    stock: 95,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80",
    views: 470,
  },
  {
    name: "Reebok CrossFit Nano X3 Training Shoes",
    price: 8999,
    category: "Sports",
    stock: 55,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80",
    views: 560,
  },
  {
    name: "Nivia Storm Swimming Goggles (UV Protection)",
    price: 449,
    category: "Sports",
    stock: 300,
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80",
    views: 190,
  },
  {
    name: "Cosco Synthetic Shuttle Cock (Pack of 6)",
    price: 349,
    category: "Sports",
    stock: 500,
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80",
    views: 155,
  },
  {
    name: "Decathlon Corength 20kg Adjustable Dumbbell Set",
    price: 3999,
    category: "Sports",
    stock: 60,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    views: 620,
  },
  {
    name: "Boldfit Pro Gym Gloves with Wrist Support",
    price: 699,
    category: "Sports",
    stock: 400,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80",
    views: 280,
  },
  {
    name: "MRF Genius Grand Cricket Helmet (Senior)",
    price: 2799,
    category: "Sports",
    stock: 45,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80",
    views: 340,
  },
  {
    name: "Strauss Yoga Mat 6mm with Carry Strap",
    price: 799,
    category: "Sports",
    stock: 350,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80",
    views: 490,
  },
  {
    name: "Adidas Essential 3-Stripe Shorts",
    price: 1599,
    category: "Sports",
    stock: 200,
    image: "https://images.unsplash.com/photo-1562183241-b937e9d94d73?w=400&q=80",
    views: 260,
  },
  {
    name: "Sparx Men's Running Shoes SM-796",
    price: 1299,
    category: "Sports",
    stock: 130,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    views: 380,
  },
  {
    name: "Nivia Pro Knee Support (Pair)",
    price: 549,
    category: "Sports",
    stock: 280,
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&q=80",
    views: 210,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // TOYS (18 products)
  // Brands: Lego, Hot Wheels, Barbie, Funskool, Hasbro, Fisher-Price, Nerf,
  //         Play-Doh, Hamleys, Learning Resources
  // ─────────────────────────────────────────────────────────────────────────────

  {
    name: "LEGO Classic Creative Brick Box (484 Pieces)",
    price: 3499,
    category: "Toys",
    stock: 80,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80",
    views: 720,
  },
  {
    name: "Hot Wheels 20-Car Gift Pack Assortment",
    price: 1199,
    category: "Toys",
    stock: 250,
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80",
    views: 580,
  },
  {
    name: "Barbie Dreamhouse Playset with 3 Floors",
    price: 8999,
    category: "Toys",
    stock: 30,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    views: 840,
  },
  {
    name: "Nerf Elite 2.0 Commander RD-6 Blaster",
    price: 1799,
    category: "Toys",
    stock: 100,
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80",
    views: 430,
  },
  {
    name: "Play-Doh Kitchen Creations Ultimate Ice Cream Truck",
    price: 2499,
    category: "Toys",
    stock: 70,
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80",
    views: 390,
  },
  {
    name: "Funskool Scrabble Classic Board Game",
    price: 999,
    category: "Toys",
    stock: 180,
    image: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400&q=80",
    views: 320,
  },
  {
    name: "Fisher-Price Laugh & Learn Smart Stages Chair",
    price: 2299,
    category: "Toys",
    stock: 60,
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&q=80",
    views: 280,
  },
  {
    name: "Hasbro Monopoly Classic Board Game",
    price: 1199,
    category: "Toys",
    stock: 200,
    image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&q=80",
    views: 510,
  },
  {
    name: "LEGO Star Wars The Mandalorian Battle Pack",
    price: 2799,
    category: "Toys",
    stock: 45,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80",
    views: 660,
  },
  {
    name: "Hamleys Remote Control Monster Truck",
    price: 3499,
    category: "Toys",
    stock: 55,
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80",
    views: 470,
  },
  {
    name: "Crayola 120-Count Crayon Bucket",
    price: 899,
    category: "Toys",
    stock: 300,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
    views: 240,
  },
  {
    name: "Funskool Play & Learn Wooden Puzzle Set",
    price: 599,
    category: "Toys",
    stock: 220,
    image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&q=80",
    views: 195,
  },
  {
    name: "Hasbro Transformers Bumblebee Action Figure",
    price: 1899,
    category: "Toys",
    stock: 90,
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80",
    views: 550,
  },
  {
    name: "Orbeez Spa Foot Bath with 2000 Orbeez",
    price: 1499,
    category: "Toys",
    stock: 75,
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80",
    views: 310,
  },
  {
    name: "VTech KidiZoom Smartwatch DX3 for Kids",
    price: 4999,
    category: "Toys",
    stock: 40,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    views: 490,
  },
  {
    name: "Skillmatics Educational Game — Guess in 10",
    price: 799,
    category: "Toys",
    stock: 160,
    image: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400&q=80",
    views: 270,
  },
  {
    name: "Melissa & Doug Deluxe Wooden Railway Train Set",
    price: 3299,
    category: "Toys",
    stock: 35,
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80",
    views: 380,
  },
  {
    name: "Play-Doh 24-Pack Modelling Compound Set",
    price: 1199,
    category: "Toys",
    stock: 280,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
    views: 350,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // KIDS CLOTHING (18 products)
  // Brands: H&M Kids, Zara Kids, Mothercare, FirstCry, Babyhug,
  //         Carter's, UCB Kids, Ajio Junior, Max Kids, US Polo Kids
  // ─────────────────────────────────────────────────────────────────────────────

  {
    name: "H&M Kids Cotton Printed T-Shirt (2–10Y)",
    price: 699,
    category: "Kids Clothing",
    stock: 300,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80",
    views: 420,
  },
  {
    name: "Zara Kids Denim Jogger Jeans (3–12Y)",
    price: 2299,
    category: "Kids Clothing",
    stock: 120,
    image: "https://images.unsplash.com/photo-1503944168849-8bf86875bebe?w=400&q=80",
    views: 360,
  },
  {
    name: "Carter's Baby Girl Floral Romper (0–24M)",
    price: 1299,
    category: "Kids Clothing",
    stock: 200,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
    views: 490,
  },
  {
    name: "Mothercare Boys Striped Polo T-Shirt (1–8Y)",
    price: 899,
    category: "Kids Clothing",
    stock: 180,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80",
    views: 290,
  },
  {
    name: "Babyhug Full-Sleeve Fleece Hoodie (1–5Y)",
    price: 1199,
    category: "Kids Clothing",
    stock: 160,
    image: "https://images.unsplash.com/photo-1503944168849-8bf86875bebe?w=400&q=80",
    views: 330,
  },
  {
    name: "US Polo Kids Shorts with Pockets (4–14Y)",
    price: 1099,
    category: "Kids Clothing",
    stock: 220,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80",
    views: 250,
  },
  {
    name: "Max Kids Girls Printed Leggings (2–14Y)",
    price: 599,
    category: "Kids Clothing",
    stock: 350,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
    views: 310,
  },
  {
    name: "Ajio Junior Unisex Tracksuit Set (3–12Y)",
    price: 1799,
    category: "Kids Clothing",
    stock: 130,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80",
    views: 380,
  },
  {
    name: "H&M Kids Puffer Jacket — Winter Collection (2–12Y)",
    price: 2999,
    category: "Kids Clothing",
    stock: 90,
    image: "https://images.unsplash.com/photo-1503944168849-8bf86875bebe?w=400&q=80",
    views: 450,
  },
  {
    name: "FirstCry Baby Boy 3-Piece Clothing Gift Set (0–12M)",
    price: 1499,
    category: "Kids Clothing",
    stock: 175,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80",
    views: 270,
  },
  {
    name: "UCB Kids Graphic Sweatshirt (4–14Y)",
    price: 1899,
    category: "Kids Clothing",
    stock: 110,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80",
    views: 320,
  },
  {
    name: "Zara Kids Girls Smocked Sundress (3–12Y)",
    price: 2499,
    category: "Kids Clothing",
    stock: 80,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
    views: 410,
  },
  {
    name: "Mothercare Unisex Newborn Sleep Suit 3-Pack (0–9M)",
    price: 1099,
    category: "Kids Clothing",
    stock: 240,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80",
    views: 190,
  },
  {
    name: "Nike Kids Sportswear Club Fleece Joggers (3–10Y)",
    price: 2799,
    category: "Kids Clothing",
    stock: 100,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80",
    views: 480,
  },
  {
    name: "Max Kids Boys Formal Shirt + Chino Pants Set (3–12Y)",
    price: 1599,
    category: "Kids Clothing",
    stock: 150,
    image: "https://images.unsplash.com/photo-1503944168849-8bf86875bebe?w=400&q=80",
    views: 230,
  },
  {
    name: "Carter's Girls Unicorn Printed Nightsuit Set (2–8Y)",
    price: 1199,
    category: "Kids Clothing",
    stock: 200,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
    views: 360,
  },
  {
    name: "Babyhug 100% Organic Cotton Onesie Pack of 3 (0–18M)",
    price: 999,
    category: "Kids Clothing",
    stock: 280,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80",
    views: 420,
  },
  {
    name: "H&M Kids Waterproof Rain Jacket with Hood (1.5–10Y)",
    price: 2499,
    category: "Kids Clothing",
    stock: 95,
    image: "https://images.unsplash.com/photo-1503944168849-8bf86875bebe?w=400&q=80",
    views: 340,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Runner
// ─────────────────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const categoryCounts = { Sports: 0, Toys: 0, "Kids Clothing": 0 };
    let added = 0;
    let skipped = 0;

    for (const p of newProducts) {
      const exists = await Product.findOne({ name: p.name });
      if (exists) {
        console.log(`⚠️  Skipped (already exists): ${p.name}`);
        skipped++;
        continue;
      }
      await Product.create(p); // prices are already in INR
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
