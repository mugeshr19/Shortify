const express = require("express");
const cors = require("cors");

const {redirectUrl} = require("./controllers/urlController");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/url",require("./controllers/urlController"));

app.use("/:shortCode",redirectUrl);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));