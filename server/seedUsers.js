const mongoose = require("mongoose");
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

    // Delete existing seeded users first so we can re-insert with correct hashing
    const emails = users.map((u) => u.email);
    await User.deleteMany({ email: { $in: emails } });
    console.log("🗑️  Cleared previous entries for these users\n");

    for (const u of users) {
      // Pass plain-text password — the User pre-save hook will hash it once
      await User.create({
        name: u.name,
        email: u.email,
        password: u.password,
        role: "user",
      });
      console.log(`✅ Added: ${u.name} (${u.email})`);
    }

    console.log(`\n🎉 Done! All ${users.length} users seeded successfully.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding users:", err.message);
    process.exit(1);
  }
};

seedUsers();
