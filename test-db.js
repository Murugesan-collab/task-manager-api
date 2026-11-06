require("dotenv").config();

const pool = require("./src/config/db");

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected successfully!");
    console.log("Current database time:", result.rows[0].now);
  } catch (error) {
    console.error("Database connection failed!");
    console.error(error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
