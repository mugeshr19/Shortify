const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { redirectUrl } = require("./controllers/urlController");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/url", require("./routes/urlRoutes"));
app.use(
  "/api/analytics",
  require("./routes/analyticsRoutes")
);
app.get("/:shortCode", redirectUrl);

const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("database connection error :", err);
  });
