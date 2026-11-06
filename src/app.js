const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());

app.use(cors());
app.use(morgan("dev"));

// Routers
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Manager API is running!",
  });
});

module.exports = app;
