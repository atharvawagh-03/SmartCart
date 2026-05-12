const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const users = [
  { name: "Vaishali Wagh",      email: "vaishali@gmail.com",   password: "vaishali123" },
  { name: "Anoushka Patil",     email: "anoushka@gmail.com",   password: "anoushka123" },
  { name: "Rutuja Wagh",        email: "rutuja@gmail.com",     password: "rutuja123" },
  { name: "Prem Jaiswal",       email: "prem@gmail.com",       password: "prem123" },
  { name: "Tejas Sonawane",     email: "tejas@gmail.com",      password: "tejas123" },
  { name: "Rahile Shah",        email: "rahile@gmail.com",     password: "rahile123" },
  { name: "Shashank Vispute",   email: "shashank@gmail.com",   password: "shashank123" },
  { name: "Kushagra Vispute",   email: "kushagra@gmail.com",   password: "kushagra123" },
  { name: "Sanket Chaudhari",   email: "sanket@gmail.com",     password: "sanket123" },
  { name: "Parth Pawar",        email: "parth@gmail.com",      password: "parth123" },
  { name: "Darshan Jagtap",     email: "darshan@gmail.com",    password: "darshan123" },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    let added = 0;
    let skipped = 0;

    for (const u of users) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log(`⚠️  Skipped (already exists): ${u.email}`);
        skipped++;
        continue;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);

      await User.create({
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: "user",
      });

      console.log(`✅ Added: ${u.name} (${u.email})`);
      added++;
    }

    console.log(`\n🎉 Done! ${added} user(s) added, ${skipped} skipped.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding users:", err.message);
    process.exit(1);
  }
};

seedUsers();
