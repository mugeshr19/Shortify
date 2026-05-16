const express = require("express");
const router = express.Router();
const {shortenUrl,getUrl} = require("../controllers/urlController");

router.post("/shorten", shortenUrl);
router.get("/myurls", getUrl);

module.exports = router;