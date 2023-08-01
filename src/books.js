const express = require("express");
const router = express.Router();

const { Book } = require("./database");

router.get("/", async (req, res) => {
  res.send("Welcome to Books API!");
});

// Add the router for registration form here

router.post("/list", async (req, res) => {
  try {
    const page = req.body.page ? req.body.page - 1 : 0;
    const numItems = req.body.items ?? 20;
    const sort = req.body.sort ?? "title";

    const books = await Book.find({}, null, {
      limit: numItems,
      skip: page * numItems,
      sort: { [sort]: 1 },
    });
    
    res.send(books);
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = router;