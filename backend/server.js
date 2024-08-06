const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const shortid = require("shortid");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://url-shortener-ui.onrender.com",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Url = mongoose.model("Url", urlSchema);

app.post("/api/shorten", async (req, res) => {
  const { url } = req.body;
  const shortUrl = shortid.generate();

  const newUrl = new Url({
    originalUrl: url,
    shortUrl: shortUrl,
  });

  await newUrl.save();

  res.json({ shortUrl: shortUrl });
});

app.get("/thach.lalala/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });

  if (url) {
    url.clicks += 1;
    await url.save();
    res.redirect(url.originalUrl);
  } else {
    res.status(404).json("No URL found");
  }
});

app.get("/api/urls", async (req, res) => {
  try {
    const urls = await Url.find();
    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching URLs" });
  }
});

// New route to delete a URL
app.delete("/api/urls/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Url.findByIdAndDelete(id);
    res.json({ message: "URL deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting URL" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
