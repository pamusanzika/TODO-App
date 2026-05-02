const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const todoRoutes = require("./routes/todoRoutes");

const app = express();

// middleware first
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// routes after middleware
app.use("/api/todos", todoRoutes);

// connect DB and start server
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tasky";

if (!process.env.MONGO_URI) {
  console.warn(
    "MONGO_URI is not set. Falling back to mongodb://127.0.0.1:27017/tasky"
  );
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));