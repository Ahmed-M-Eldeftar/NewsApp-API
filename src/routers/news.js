const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const News = require("../models/news");
const auth = require("../middelware/auth");

router.post("/new", auth, async function (req, res) {
  try {
    const news = new News({ ...req.body, user: req.user._id });
    news.publishedAt = News.displayTime();
    await news.save();
    res.send(news);
  } catch (err) {
    res.send(err);
  }
});
router.get("/news", auth, async (req, res) => {
  try {
    await req.user.populate("news");
    res.send(req.user.news);
  } catch (err) {
    res.send(err);
  }
});
router.get("/news/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const news = await News.findOne({ _id, user: req.user._id });
    if (!news) {
      res.send("No news has user");
    }
    res.send(news);
  } catch (err) {
    res.send(err);
  }
});
router.get("/createdBy/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const news = await News.findById(_id);
    if (!news) {
      res.send("No news has user");
    }
    console.log(news);
    await news.populate("user");
    res.send(news.user);
  } catch (err) {
    res.send(err);
  }
});

router.patch("/news/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const news = await News.findOneAndUpdate(
      { _id, user: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!news) {
      res.send("No news has user");
    }
    res.send(news);
  } catch (err) {
    res.send(err);
  }
});
router.delete("/news/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const news = await News.findOneAndDelete({ _id, user: req.user._id });
    if (!news) {
      res.send("No news has user");
    }
    res.send(news);
  } catch (err) {
    res.send(err);
  }
});
module.exports = router;
