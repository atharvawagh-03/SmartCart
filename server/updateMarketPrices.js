const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Product = require('./models/Product');

const MARKET_PRICES = {
  // Electronics
  "Echo Dot (5th Gen)": 4499,
  "Kindle Paperwhite": 11999,
  "Fire TV Stick 4K": 3999,
  "Smart Home Hub": 6999,

  // Smartphones
  "Samsung Galaxy S23 Ultra": 89999,
  "iPhone 15 Pro": 99900,
  "OnePlus 12": 64999,
  "Google Pixel 8": 59999,
  "Poco X5 Pro 5G": 20999,

  // Laptops
  "MacBook Air M2": 89990,
  "Dell XPS 15": 129990,
  "HP Pavilion Gaming Laptop": 69990,
  "Asus VivoBook 15": 39990,
  "Lenovo ThinkPad E14": 59990,

  // Audio
  "Sony WH-1000XM5": 26990,
  "Bose QuietComfort 45": 24990,
  "Apple AirPods Pro (2nd Gen)": 20900,
  "JBL Flip 6 Bluetooth Speaker": 9999,
  "boAt Airdopes TWS Earbuds": 1299,

  // Wearables
  "Apple Watch Series 9": 34990,
  "Samsung Galaxy Watch 6": 21990,
  "Noise ColorFit Pro 4": 2999,
  "Mi Smart Band 7": 2499,

  // Clothing
  "Levi's 511 Slim Fit Jeans": 2999,
  "Tommy Hilfiger Polo T-Shirt": 2499,
  "H&M Relaxed Fit Hoodie": 1999,
  "Batman Dark Knight T-Shirt": 799,
  "Harry Potter Hogwarts Hoodie": 1999,
  "Classic Denim Jacket": 2999,

  // Footwear
  "Nike Air Max 270": 11995,
  "Adidas Ultraboost 22": 14999,
  "Puma Suede Classic": 4999,
  "Converse Chuck Taylor All Star": 3999,
  "Nike Running Shoes": 4995,

  // Accessories
  "Ray-Ban Aviator Classic": 8990,
  "Casio Vintage Watch": 2995,
  "Logitech MX Master 3S Mouse": 8495,
  "Mechanical Keyboard": 4999,

  // Computers
  "HP Pavilion Gaming Desktop": 64990,
  "LG 27\" 4K UHD Monitor": 27990,

  // Televisions
  "Sony Bravia 55\" 4K Ultra HD": 54990,
  "Samsung 65\" QLED TV": 89990,

  // Appliances
  "Dyson V15 Detect Vacuum": 52900,
  "Instant Pot Duo 7-in-1": 7499,

  // Personal Care
  "Philips Beard Trimmer": 1499,
  "Dyson Supersonic Hair Dryer": 34900,

  // Bags
  "Samsonite Carry-On Luggage": 8999,
  "The North Face Backpack": 4999,

  // Skincare & Beauty
  "Cetaphil Gentle Skin Cleanser (500ml)": 999,
  "The Ordinary Niacinamide 10% + Zinc 1%": 599,
  "Neutrogena Hydro Boost Water Gel": 950,
  "La Roche-Posay Anthelios SPF 50+ Sunscreen": 1850,
  "Zara Floral Wrap Midi Dress": 2990,
  "H&M High-Waist Flare Trousers": 1999,
  "Myntra Roadster Women Solid Kurta": 799,
  "Biba Ethnic Anarkali Suit Set": 3499,
  "Steve Madden Block Heel Sandals": 4999,
  "Nike Air Force 1 Shadow (Women's)": 8995,
  "Metro Women Block Heel Boots": 3490,
  "Crocs Classic Clog (Women's Pink)": 2995,
  "Fossil Jacqueline Rose Gold Watch": 8495,
  "Hidesign Leather Tote Bag": 5995,
  "Accessorize Pearl Drop Earrings": 799,
  "Zaveri Pearls Gold Plated Choker Necklace": 699,
  "Lakme 9 to 5 Weightless Matte Mousse Lip Color": 399,
  "Maybelline Fit Me Matte+Poreless Foundation": 549,
  "NYX Professional Makeup Eyeshadow Palette": 999,
  "Colorbar Cosmetics Perfect Mascara": 650
};

async function updatePrices() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartcart');
    console.log('Connected to MongoDB.');

    let count = 0;
    for (const [name, price] of Object.entries(MARKET_PRICES)) {
      const res = await Product.updateMany({ name }, { $set: { price } });
      if (res.modifiedCount > 0) {
        count += res.modifiedCount;
        console.log(`Updated "${name}" -> ₹${price.toLocaleString('en-IN')}`);
      }
    }

    console.log(`\nSuccessfully updated ${count} products to realistic Indian market prices!`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error updating prices:', err.message);
  }
}

updatePrices();
