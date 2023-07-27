const express = require("express");
const router = express.Router();

const { User } = require("./database")

router.get("/", async (req, res) => {
    res.send("Welcome to User!");
});

router.post("/add", async (req, res) => {
  try {
    console.log(req.body);
    const user = new User(req.body);
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/list", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = router;