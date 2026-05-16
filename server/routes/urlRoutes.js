const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware")
const {shortenUrl,getUrl} = require("../controllers/urlController");

router.post("/shorten",protect, shortenUrl);
router.get("/myurls",protect, getUrl);

module.exports = router;