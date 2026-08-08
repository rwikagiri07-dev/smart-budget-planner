import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect Database
await connectDB();

// Start Server
app.listen(PORT, () => {
  console.log("==================================");
  console.log("🚀 Smart Budget Planner API");
  console.log(`🌍 Running at http://localhost:${PORT}`);
  console.log("==================================");
});
