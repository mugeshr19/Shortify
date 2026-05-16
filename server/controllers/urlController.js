const URL = require("../models/Url");
const Click = require("../models/Click");
const { nanoid } = require("nanoid");
const QRcode = require("qrcode");
const useragent = require("useragent");

const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customCode } = req.body;
    const shortCode = customCode || nanoid(6);
    const existingCode = await URL.findOne({
      shortCode,
    });
    const existingUrl = await URL.findOne({
      originalUrl,
    });
    if (existingCode) {
      return res.status(400).json({
        error: "Custom code already exists",
      });
    }
    if (existingUrl) {
      return res.status(200).json({
        url: existingUrl,
        message: "URL already exists",
      });
    }
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    const qrCode = await QRcode.toDataURL(shortUrl);
    const url = await URL.create({
      originalUrl,
      shortUrl,
      shortCode,
      qrCode,
      user: req.user._id,
    });
    res.status(201).json(url);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await URL.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    url.clicks += 1;
    await url.save();
    const agent = useragent.parse(req.headers["user-agent"]);
    await Click.create({
      url: url._id,
      ipAddress: req.ip,
      brower: agent.family,
      os: agent.os.family,
      device: agent.device.family,
      referrer: req.get("Referrer") || "Direct",
    });
    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const getUrl = async (req, res) => {
  try {
    const urls = await URL.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  shortenUrl,
  redirectUrl,
  getUrl,
};
