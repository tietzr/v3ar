const express = require("express");
const router = express.Router();

const { User } = require("./database");
const e = require("express");

router.get("/", async (req, res) => {
  res.send("Welcome to User!");
});

router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    const findUser = await User.findOne(
      {
        email: user.email,
      },
      { password: 0, birthDate: 0 }
    );
    if (!findUser) {
      // If user is not found in database then register it
      const savedUser = await user.save();
      if (!savedUser) {
        res.status(400).send({
          status: "error",
          message:
            "Something Went Wrong!",
        });
      }
      res.send(savedUser);
    }else{      
      // If user is registered with same email then prompt error
      res.status(400).send({
        status: "error",
        message:
          "User Already Exists!",
      });
    }    
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  const loginInfo = req.body;
  try {
    const userFound = await User.findOne(
      {
        email: loginInfo.email,
        password: loginInfo.password,
      },
      { password: 0, birthDate: 0 }
    );

    if (!userFound) {
      res.status(400).send({
        status: "error",
        message:
          "User not found, please make sure you have the correct credentials!",
      });
      return;
    }
    res.send(userFound);
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Something went wrong trying to locate the user in the database",
    });
  }
});

// Add the router for registration form here

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
