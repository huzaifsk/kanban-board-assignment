// seed.js - Database seeder for creating default admin user
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");
require("dotenv").config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    const adminExists = await User.findOne({ username: "admin" });
    
    if (adminExists) {
      console.log("Admin user already exists");
      
      const salt = await bcrypt.genSalt(10);
      adminExists.password = await bcrypt.hash("pass123", salt);
      adminExists.role = "admin";
      await adminExists.save();
      console.log("Admin password updated to 'pass123'");
    } else {

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("pass123", salt);
      
      const admin = new User({
        username: "admin",
        password: hashedPassword,
        role: "admin",
      });
      
      await admin.save();
      console.log("✅ Admin user created successfully!");
      console.log("Username: admin");
      console.log("Password: pass123");
    }

    const deletedUsers = await User.deleteMany({
      username: { $ne: "admin" },
      role: "admin"
    });
    
    if (deletedUsers.deletedCount > 0) {
      console.log(`Removed ${deletedUsers.deletedCount} other admin user(s)`);
    }

    console.log("\n✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedAdmin();