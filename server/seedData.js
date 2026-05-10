const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

// All images use Unsplash - guaranteed to load with no hotlink restrictions
const products = [
  // Electronics
  {
    name: "Echo Dot (5th Gen)",
    price: 49.99, category: "Electronics", stock: 100,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&q=80",
    views: 120
  },
  {
    name: "Kindle Paperwhite",
    price: 139.99, category: "Electronics", stock: 50,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80",
    views: 250
  },
  {
    name: "Fire TV Stick 4K",
    price: 39.99, category: "Electronics", stock: 150,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80",
    views: 300
  },
  {
    name: "Smart Home Hub",
    price: 89.00, category: "Electronics", stock: 75,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    views: 190
  },

  // Smartphones
  {
    name: "Samsung Galaxy S23 Ultra",
    price: 1199.99, category: "Smartphones", stock: 30,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
    views: 600
  },
  {
    name: "iPhone 15 Pro",
    price: 1099.00, category: "Smartphones", stock: 40,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
    views: 750
  },
  {
    name: "OnePlus 12",
    price: 799.99, category: "Smartphones", stock: 55,
    image: "https://images.unsplash.com/photo-1508389377389-b8221c0bcc9e?w=400&q=80",
    views: 300
  },
  {
    name: "Google Pixel 8",
    price: 699.00, category: "Smartphones", stock: 45,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80",
    views: 280
  },
  {
    name: "Poco X5 Pro 5G",
    price: 299.99, category: "Smartphones", stock: 80,
    image: "https://images.unsplash.com/photo-1581993192008-63e896f4f744?w=400&q=80",
    views: 200
  },

  // Laptops
  {
    name: "MacBook Air M2",
    price: 1099.00, category: "Laptops", stock: 25,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80",
    views: 700
  },
  {
    name: "Dell XPS 15",
    price: 1599.00, category: "Laptops", stock: 20,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&q=80",
    views: 450
  },
  {
    name: "HP Pavilion Gaming Laptop",
    price: 899.00, category: "Laptops", stock: 35,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&q=80",
    views: 380
  },
  {
    name: "Asus VivoBook 15",
    price: 499.00, category: "Laptops", stock: 45,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    views: 180
  },
  {
    name: "Lenovo ThinkPad E14",
    price: 749.00, category: "Laptops", stock: 30,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&q=80",
    views: 220
  },

  // Audio
  {
    name: "Sony WH-1000XM5",
    price: 348.00, category: "Audio", stock: 60,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80",
    views: 350
  },
  {
    name: "Bose QuietComfort 45",
    price: 329.00, category: "Audio", stock: 40,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    views: 400
  },
  {
    name: "Apple AirPods Pro (2nd Gen)",
    price: 249.00, category: "Audio", stock: 120,
    image: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=400&q=80",
    views: 500
  },
  {
    name: "JBL Flip 6 Bluetooth Speaker",
    price: 129.00, category: "Audio", stock: 80,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    views: 320
  },
  {
    name: "boAt Airdopes TWS Earbuds",
    price: 29.99, category: "Audio", stock: 300,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&q=80",
    views: 150
  },

  // Wearables
  {
    name: "Apple Watch Series 9",
    price: 399.00, category: "Wearables", stock: 60,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    views: 480
  },
  {
    name: "Samsung Galaxy Watch 6",
    price: 299.00, category: "Wearables", stock: 75,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80",
    views: 310
  },
  {
    name: "Noise ColorFit Pro 4",
    price: 45.00, category: "Wearables", stock: 120,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80",
    views: 110
  },
  {
    name: "Mi Smart Band 7",
    price: 35.00, category: "Wearables", stock: 150,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80",
    views: 180
  },

  // Clothing
  {
    name: "Levi's 511 Slim Fit Jeans",
    price: 69.50, category: "Clothing", stock: 120,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
    views: 210
  },
  {
    name: "Tommy Hilfiger Polo T-Shirt",
    price: 49.50, category: "Clothing", stock: 80,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80",
    views: 180
  },
  {
    name: "H&M Relaxed Fit Hoodie",
    price: 34.99, category: "Clothing", stock: 150,
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
    views: 280
  },
  {
    name: "Batman Dark Knight T-Shirt",
    price: 19.99, category: "Clothing", stock: 200,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80",
    views: 400
  },
  {
    name: "Harry Potter Hogwarts Hoodie",
    price: 39.99, category: "Clothing", stock: 100,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80",
    views: 300
  },
  {
    name: "Classic Denim Jacket",
    price: 89.99, category: "Clothing", stock: 60,
    image: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=400&q=80",
    views: 230
  },

  // Footwear
  {
    name: "Nike Air Max 270",
    price: 150.00, category: "Footwear", stock: 50,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    views: 350
  },
  {
    name: "Adidas Ultraboost 22",
    price: 190.00, category: "Footwear", stock: 40,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80",
    views: 320
  },
  {
    name: "Puma Suede Classic",
    price: 70.00, category: "Footwear", stock: 100,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80",
    views: 200
  },
  {
    name: "Converse Chuck Taylor All Star",
    price: 65.00, category: "Footwear", stock: 130,
    image: "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=400&q=80",
    views: 260
  },
  {
    name: "Nike Running Shoes",
    price: 120.00, category: "Footwear", stock: 85,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80",
    views: 310
  },

  // Accessories
  {
    name: "Ray-Ban Aviator Classic",
    price: 161.00, category: "Accessories", stock: 60,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
    views: 230
  },
  {
    name: "Casio Vintage Watch",
    price: 55.00, category: "Accessories", stock: 100,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80",
    views: 170
  },
  {
    name: "Logitech MX Master 3S Mouse",
    price: 99.99, category: "Accessories", stock: 80,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
    views: 150
  },
  {
    name: "Mechanical Keyboard",
    price: 149.99, category: "Accessories", stock: 55,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",
    views: 200
  },

  // Computers
  {
    name: "HP Pavilion Gaming Desktop",
    price: 799.00, category: "Computers", stock: 15,
    image: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=400&q=80",
    views: 300
  },
  {
    name: "LG 27\" 4K UHD Monitor",
    price: 399.00, category: "Computers", stock: 40,
    image: "https://images.unsplash.com/photo-1527443224154-c4a573d5f5ac?w=400&q=80",
    views: 190
  },

  // Televisions
  {
    name: "Sony Bravia 55\" 4K Ultra HD",
    price: 699.00, category: "Televisions", stock: 10,
    image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&q=80",
    views: 400
  },
  {
    name: "Samsung 65\" QLED TV",
    price: 1199.00, category: "Televisions", stock: 8,
    image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&q=80",
    views: 350
  },

  // Appliances
  {
    name: "Dyson V15 Detect Vacuum",
    price: 699.00, category: "Appliances", stock: 18,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    views: 280
  },
  {
    name: "Instant Pot Duo 7-in-1",
    price: 99.00, category: "Appliances", stock: 90,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",
    views: 200
  },

  // Personal Care
  {
    name: "Philips Beard Trimmer",
    price: 25.00, category: "Personal Care", stock: 200,
    image: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&q=80",
    views: 90
  },
  {
    name: "Dyson Supersonic Hair Dryer",
    price: 429.00, category: "Personal Care", stock: 30,
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80",
    views: 220
  },

  // Bags
  {
    name: "Samsonite Carry-On Luggage",
    price: 139.00, category: "Bags", stock: 45,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    views: 160
  },
  {
    name: "The North Face Backpack",
    price: 89.00, category: "Bags", stock: 70,
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&q=80",
    views: 210
  },
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    await Product.deleteMany({});
    console.log("Old products cleared.");

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products added successfully!`);

    process.exit();
  } catch (error) {
    console.error("Error with data import:", error);
    process.exit(1);
  }
};

seedDB();
