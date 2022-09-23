const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middelware/auth");
const multer = require("multer");
const upload = multer({
  fileFilter(req, file, cd) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
      return cd(new Error("Please upload image"));
    }
    cd(null, true);
  },
}); //
router.post("/signup", upload.single("avatar"), async (req, res) => {
  try {
    const user = new User(req.body);
    user.image = req.file.buffer;
    await user.save();
    const token = user.generateToken();
    res.send({ token, user });
  } catch (err) {
    res.send(err.message);
  }
});
router.get("/myProfile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (err) {
    res.send(err.message);
  }
});
router.patch("/users", auth, async (req, res) => {
  const upload = Object.keys(req.body);
  try {
    const _id = req.user._id;
    const user = await User.findById(_id);
    upload.forEach((elem) => (user[elem] = req.body[elem]));
    await user.save();
    res.send(user);
  } catch (err) {
    res.send(err.message);
  }
});
router.delete("/users", auth, async (req, res) => {
  try {
    const _id = req.user._id;
    console.log(_id);
    await User.findByIdAndDelete(_id);
    res.send("Delete success.");
  } catch (err) {
    res.send(err.message);
  }
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = user.generateToken();
    res.send({ token, user });
  } catch (err) {
    res.send(err.message);
  }
});
module.exports = router;
