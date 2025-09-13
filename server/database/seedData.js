// utils/seedAdmin.js
import { User } from "../models/user.model.js";

export const seedData = async () => {
  const adminExists = await User.findOne({ role: "admin" });
  if (adminExists) {
    console.log("Admin user already exists.");
  }

  const res = await fetch("http://localhost:5000/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Admin",
      phone: "9999999999",
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
      address: "Admin HQ",
      city: "Admin City",
      state: "Admin State",
      zip: "000000",
      role: "admin",
    }),
  });

  const data = await res.json();

  if (data.success) {
    console.log("✅ Admin user seeded via API.");
  } else {
    console.log("⚠️ Admin seeding failed:", data.message);
  }
};
