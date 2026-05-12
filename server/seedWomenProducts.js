const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

// All images use Unsplash — no hotlink issues, always loads correctly
const newProducts = [

  // ─── SKINCARE ───────────────────────────────────────────────────────────────
  {
    name: "Cetaphil Gentle Skin Cleanser (500ml)",
    price: 14.99, category: "Skincare", stock: 200,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
    views: 320
  },
  {
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    price: 6.90, category: "Skincare", stock: 300,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
    views: 510
  },
  {
    name: "Neutrogena Hydro Boost Water Gel",
    price: 19.99, category: "Skincare", stock: 180,
    image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=400&q=80",
    views: 430
  },
  {
    name: "La Roche-Posay Anthelios SPF 50+ Sunscreen",
    price: 24.99, category: "Skincare", stock: 150,
    image: "https://images.unsplash.com/photo-1526758097130-bab247274f58?w=400&q=80",
    views: 380
  },
  {
    name: "Mamaearth Vitamin C Face Serum",
    price: 12.99, category: "Skincare", stock: 250,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80",
    views: 290
  },
  {
    name: "Plum Bright Years Cell Renewal Serum",
    price: 18.50, category: "Skincare", stock: 120,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80",
    views: 210
  },
  {
    name: "WOW Skin Science Aloe Vera Gel",
    price: 9.99, category: "Skincare", stock: 400,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80",
    views: 175
  },
  {
    name: "Kiehl's Ultra Facial Cream SPF 30",
    price: 38.00, category: "Skincare", stock: 90,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80",
    views: 350
  },
  {
    name: "Forest Essentials Soundarya Age Defying Face Oil",
    price: 45.00, category: "Skincare", stock: 60,
    image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&q=80",
    views: 195
  },
  {
    name: "Biotique Bio Papaya Tan Removal Scrub",
    price: 7.50, category: "Skincare", stock: 280,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80",
    views: 140
  },

  // ─── WOMEN'S CLOTHING ────────────────────────────────────────────────────────
  {
    name: "Zara Floral Wrap Midi Dress",
    price: 49.99, category: "Women's Clothing", stock: 100,
    image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80",
    views: 420
  },
  {
    name: "H&M High-Waist Flare Trousers",
    price: 29.99, category: "Women's Clothing", stock: 130,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
    views: 310
  },
  {
    name: "Myntra Roadster Women Solid Kurta",
    price: 18.99, category: "Women's Clothing", stock: 200,
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&q=80",
    views: 260
  },
  {
    name: "Biba Ethnic Anarkali Suit Set",
    price: 55.00, category: "Women's Clothing", stock: 80,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80",
    views: 340
  },
  {
    name: "W for Woman Printed Straight Kurta",
    price: 22.00, category: "Women's Clothing", stock: 160,
    image: "https://images.unsplash.com/photo-1596285508507-5da817c3b8e0?w=400&q=80",
    views: 190
  },
  {
    name: "Mango Linen Blazer",
    price: 79.99, category: "Women's Clothing", stock: 60,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
    views: 370
  },
  {
    name: "FabIndia Cotton Salwar Suit",
    price: 42.00, category: "Women's Clothing", stock: 90,
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80",
    views: 215
  },
  {
    name: "Vero Moda Ruched Mini Skirt",
    price: 34.99, category: "Women's Clothing", stock: 110,
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&q=80",
    views: 280
  },
  {
    name: "Global Desi Embroidered Palazzo Pants",
    price: 27.50, category: "Women's Clothing", stock: 140,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
    views: 160
  },
  {
    name: "Only Women Denim Shirt Dress",
    price: 44.99, category: "Women's Clothing", stock: 75,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
    views: 295
  },

  // ─── WOMEN'S FOOTWEAR ────────────────────────────────────────────────────────
  {
    name: "Steve Madden Block Heel Sandals",
    price: 79.99, category: "Women's Footwear", stock: 80,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",
    views: 330
  },
  {
    name: "Nike Air Force 1 Shadow (Women's)",
    price: 110.00, category: "Women's Footwear", stock: 60,
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400&q=80",
    views: 450
  },
  {
    name: "Metro Women Block Heel Boots",
    price: 59.99, category: "Women's Footwear", stock: 70,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    views: 210
  },
  {
    name: "Crocs Classic Clog (Women's Pink)",
    price: 49.99, category: "Women's Footwear", stock: 150,
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80",
    views: 180
  },
  {
    name: "Lavie Strappy Wedge Heels",
    price: 39.99, category: "Women's Footwear", stock: 100,
    image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=400&q=80",
    views: 240
  },

  // ─── WOMEN'S ACCESSORIES ─────────────────────────────────────────────────────
  {
    name: "Fossil Jacqueline Rose Gold Watch",
    price: 129.00, category: "Women's Accessories", stock: 50,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    views: 380
  },
  {
    name: "Hidesign Leather Tote Bag",
    price: 99.00, category: "Women's Accessories", stock: 65,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
    views: 290
  },
  {
    name: "Accessorize Pearl Drop Earrings",
    price: 12.99, category: "Women's Accessories", stock: 300,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
    views: 220
  },
  {
    name: "Zaveri Pearls Gold Plated Choker Necklace",
    price: 17.50, category: "Women's Accessories", stock: 200,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
    views: 190
  },
  {
    name: "Caprese Mini Crossbody Bag",
    price: 49.99, category: "Women's Accessories", stock: 90,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    views: 260
  },

  // ─── BEAUTY & MAKEUP ─────────────────────────────────────────────────────────
  {
    name: "Lakme 9 to 5 Weightless Matte Mousse Lip Color",
    price: 5.99, category: "Beauty & Makeup", stock: 400,
    image: "https://images.unsplash.com/photo-1631214524020-3c69b8a535a4?w=400&q=80",
    views: 470
  },
  {
    name: "Maybelline Fit Me Matte+Poreless Foundation",
    price: 9.99, category: "Beauty & Makeup", stock: 280,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    views: 520
  },
  {
    name: "NYX Professional Makeup Eyeshadow Palette",
    price: 15.99, category: "Beauty & Makeup", stock: 150,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80",
    views: 390
  },
  {
    name: "Colorbar Cosmetics Perfect Mascara",
    price: 11.99, category: "Beauty & Makeup", stock: 220,
    image: "https://images.unsplash.com/photo-1583241800698-e8ab01830a63?w=400&q=80",
    views: 310
  },
  {
    name: "Sugar Cosmetics Contour De Force Mini Kit",
    price: 19.99, category: "Beauty & Makeup", stock: 130,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
    views: 280
  },
];

const seedWomenProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

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
      console.log(`✅ Added [${p.category}]: ${p.name}`);
      added++;
    }

    console.log(`\n🎉 Done! ${added} products added, ${skipped} skipped.`);
    console.log(`\nCategories added:`);
    console.log(`  • Skincare`);
    console.log(`  • Women's Clothing`);
    console.log(`  • Women's Footwear`);
    console.log(`  • Women's Accessories`);
    console.log(`  • Beauty & Makeup`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seedWomenProducts();
