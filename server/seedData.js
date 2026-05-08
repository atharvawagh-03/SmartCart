const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const products = [
  // Amazon Products
  { name: "Echo Dot (5th Gen)", price: 49.99, category: "Electronics", stock: 100, image: "https://m.media-amazon.com/images/I/71C3oJLsyQL._AC_SL1000_.jpg", views: 120 },
  { name: "Kindle Paperwhite (16 GB)", price: 139.99, category: "Electronics", stock: 50, image: "https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg", views: 250 },
  { name: "Amazon Basics Laptop Stand", price: 19.99, category: "Accessories", stock: 200, image: "https://m.media-amazon.com/images/I/61Nl5w788QL._AC_SL1500_.jpg", views: 45 },
  { name: "Fire TV Stick 4K", price: 39.99, category: "Electronics", stock: 150, image: "https://m.media-amazon.com/images/I/51Wt1O78g6L._AC_SL1000_.jpg", views: 300 },
  { name: "Bose QuietComfort 45", price: 329.00, category: "Audio", stock: 40, image: "https://m.media-amazon.com/images/I/51JbsHSktkL._AC_SL1500_.jpg", views: 400 },
  { name: "Sony WH-1000XM5", price: 348.00, category: "Audio", stock: 60, image: "https://m.media-amazon.com/images/I/61+BWqlM12L._AC_SL1500_.jpg", views: 350 },
  { name: "Logitech MX Master 3S", price: 99.99, category: "Accessories", stock: 80, image: "https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg", views: 150 },
  { name: "Apple AirPods Pro (2nd Gen)", price: 249.00, category: "Audio", stock: 120, image: "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg", views: 500 },
  { name: "Samsung Galaxy S23 Ultra", price: 1199.99, category: "Smartphones", stock: 30, image: "https://m.media-amazon.com/images/I/718tB1S2kLL._AC_SL1500_.jpg", views: 600 },
  { name: "MacBook Air M2", price: 1099.00, category: "Laptops", stock: 25, image: "https://m.media-amazon.com/images/I/710TJuHTMhL._AC_SL1500_.jpg", views: 700 },

  // Flipkart Products
  { name: "Poco X5 Pro 5G", price: 299.99, category: "Smartphones", stock: 80, image: "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/8/2/5/-original-imagmbfqzjznhwzq.jpeg?q=70", views: 200 },
  { name: "Realme 11 Pro+", price: 349.99, category: "Smartphones", stock: 60, image: "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/h/c/e/-original-imagryywhehyhzmk.jpeg?q=70", views: 250 },
  { name: "Asus VivoBook 15", price: 499.00, category: "Laptops", stock: 45, image: "https://rukminim2.flixcart.com/image/416/416/xif0q/computer/u/x/s/-original-imagpxgremfuhbuh.jpeg?q=70", views: 180 },
  { name: "boAt Airdopes 141", price: 29.99, category: "Audio", stock: 300, image: "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/5/c/p/-original-imaghz3a37yfhztc.jpeg?q=70", views: 150 },
  { name: "Noise ColorFit Pro 4", price: 45.00, category: "Wearables", stock: 120, image: "https://rukminim2.flixcart.com/image/416/416/xif0q/smartwatch/c/3/v/-original-imagz2p2hzrwythg.jpeg?q=70", views: 110 },
  { name: "HP Pavilion Gaming Desktop", price: 799.00, category: "Computers", stock: 15, image: "https://rukminim2.flixcart.com/image/416/416/xif0q/cpu/h/h/h/-original-imaggfuzr6hhgb8m.jpeg?q=70", views: 300 },
  { name: "Philips Trimmer", price: 25.00, category: "Personal Care", stock: 200, image: "https://rukminim2.flixcart.com/image/416/416/k7usyvk0/trimmer/g/5/j/bt3101-15-philips-original-imafpyyznj9z7fxg.jpeg?q=70", views: 90 },
  { name: "Mi Smart Band 7", price: 35.00, category: "Wearables", stock: 150, image: "https://rukminim2.flixcart.com/image/416/416/xif0q/smart-band-tag/s/k/3/no-free-size-bhr6008in-xiaomi-no-original-imagqhycffh6yxhs.jpeg?q=70", views: 180 },
  { name: "Sony Bravia 55 inch 4K Ultra HD", price: 699.00, category: "Televisions", stock: 10, image: "https://rukminim2.flixcart.com/image/416/416/xif0q/television/h/z/j/-original-imagnn4hc2hzyzzj.jpeg?q=70", views: 400 },
  { name: "LG 1.5 Ton 5 Star Split AC", price: 549.00, category: "Appliances", stock: 20, image: "https://rukminim2.flixcart.com/image/416/416/xif0q/air-conditioner-new/r/f/n/-original-imagqqrnhr9gbkfg.jpeg?q=70", views: 150 },

  // Myntra Products
  { name: "Nike Air Max 270", price: 150.00, category: "Footwear", stock: 50, image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/22378932/2023/3/17/ab58da55-ff8e-4a87-bfb6-5f5c1a7985471679051410115-Nike-Mens-Air-Max-270-Shoes-2411679051409605-1.jpg", views: 350 },
  { name: "Adidas Ultraboost 22", price: 190.00, category: "Footwear", stock: 40, image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/15456984/2021/10/5/341f1737-1854-4632-9c1c-cde37d97cb8a1633420844781-ADIDAS-Men-White--Grey-Ultraboost-22-Running-Shoes-673163342-1.jpg", views: 320 },
  { name: "Puma Suede Classic", price: 70.00, category: "Footwear", stock: 100, image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/11183182/2020/2/25/7111b15c-0bc7-4eab-91ab-cc810f27473b1582622709088-Puma-Unisex-Casual-Shoes-7621582622707255-1.jpg", views: 200 },
  { name: "Levi's 511 Slim Fit Jeans", price: 69.50, category: "Clothing", stock: 120, image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/11387600/2020/7/9/d48eabda-b57d-45db-add1-a08332152a5a1594291880345-Levis-Men-Jeans-7631594291878953-1.jpg", views: 210 },
  { name: "Tommy Hilfiger Polo T-Shirt", price: 49.50, category: "Clothing", stock: 80, image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/1703213/2017/4/19/11492601956165-Tommy-Hilfiger-Men-White-Solid-Polo-Collar-T-shirt-5531492601955938-1.jpg", views: 180 },
  { name: "H&M Relaxed Fit Hoodie", price: 34.99, category: "Clothing", stock: 150, image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/23977320/2023/7/11/17f8a7e0-ce1e-42ba-bd4d-56580dfbf3751689069502941-HM-Men-Black-Relaxed-Fit-Hoodie-9971689069502573-1.jpg", views: 280 },
  { name: "Mango Tailored Coat", price: 119.99, category: "Clothing", stock: 30, image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/22881134/2023/5/2/25a593af-e038-4eeb-bd8d-19cd1d7dcfad1683017584501-MANGO-Men-Khaki-Longline-Tailored-Jacket-821683017583907-1.jpg", views: 100 },
  { name: "Ray-Ban Aviator Classic", price: 161.00, category: "Accessories", stock: 60, image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/2205562/2017/12/5/11512461413867-Ray-Ban-Men-Sunglasses-4081512461413725-1.jpg", views: 230 },
  { name: "Casio Vintage Series Watch", price: 55.00, category: "Accessories", stock: 100, image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/156641/2016/5/24/11464082260682-Casio-Youth-Digital-Men-Grey-Dial-Watch-D011-8911464082260275-1.jpg", views: 170 },
  { name: "Fossil Gen 6 Smartwatch", price: 299.00, category: "Accessories", stock: 40, image: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/15478446/2021/10/7/22f4b2be-0cd4-403d-82d2-ca39decf0be21633587661555-Fossil-Men-Black-Gen-6-Smartwatch-FTW4059-8661633587661073-1.jpg", views: 240 },

  // The Souled Store Products
  { name: "Batman: The Dark Knight Oversized T-Shirt", price: 19.99, category: "Clothing", stock: 200, image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385347.jpg?format=webp&w=480&dpr=1.0", views: 400 },
  { name: "Marvel: Iron Man Arc Reactor T-Shirt", price: 14.99, category: "Clothing", stock: 150, image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1683963473_4030615.jpg?format=webp&w=480&dpr=1.0", views: 350 },
  { name: "Harry Potter: Hogwarts Crest Hoodie", price: 39.99, category: "Clothing", stock: 100, image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1694668102_9648937.jpg?format=webp&w=480&dpr=1.0", views: 300 },
  { name: "Star Wars: Darth Vader Sweatshirt", price: 34.99, category: "Clothing", stock: 80, image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1701334812_6474134.jpg?format=webp&w=480&dpr=1.0", views: 250 },
  { name: "FRIENDS: Central Perk Mug", price: 9.99, category: "Accessories", stock: 300, image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1614343162_3862270.jpg?format=webp&w=480&dpr=1.0", views: 500 },
  { name: "Rick and Morty: Portal Gun Keychain", price: 5.99, category: "Accessories", stock: 400, image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1628163013_6938927.jpg?format=webp&w=480&dpr=1.0", views: 200 },
  { name: "Stranger Things: Hellfire Club Raglan", price: 24.99, category: "Clothing", stock: 120, image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687498705_8869811.jpg?format=webp&w=480&dpr=1.0", views: 450 },
  { name: "Peanuts: Snoopy Backpack", price: 29.99, category: "Bags", stock: 60, image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1691477755_5990264.jpg?format=webp&w=480&dpr=1.0", views: 150 },
  { name: "Disney: Mickey Mouse Sneakers", price: 44.99, category: "Footwear", stock: 50, image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1694248439_3638421.jpg?format=webp&w=480&dpr=1.0", views: 180 },
  { name: "The Office: Dunder Mifflin Cap", price: 14.99, category: "Accessories", stock: 200, image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1678255959_1303848.jpg?format=webp&w=480&dpr=1.0", views: 220 }
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    await Product.insertMany(products);
    console.log("Products added successfully!");
    
    process.exit();
  } catch (error) {
    console.error("Error with data import:", error);
    process.exit(1);
  }
};

seedDB();
