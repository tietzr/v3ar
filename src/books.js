const express = require("express");
const router = express.Router();

const { Book, Genre } = require("./database");

router.get("/", async (req, res) => {
  res.send("Welcome to Books API!");
});

// Add the router for registration form here

router.post("/list", async (req, res) => {
  try {
    const page = req.body.page ? req.body.page - 1 : 0;
    const numItems = req.body.items ?? 20;
    const sort = req.body.sort ?? "title";

    const filter = req.body.filter;

    const queryFilter = {};
    if (filter?.genres?.length) {
      queryFilter.genres = {
        $in: filter.genres,
      };
    }

    if (filter?.prices?.length) {
      queryFilter.$or = filter.prices.map((price) => {
        return {
          price: { $gte: price.min, $lte: price.max ?? Number.MAX_VALUE },
        };
      });
    }

    const books = await Book.find(queryFilter, null, {
      limit: numItems,
      skip: page * numItems,
      sort: { [sort]: 1 },
    });

    res.send(books);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/genres", async (req, res) => {
  try {
    const genres = await Genre.find({}, null, {
      sort: { name: 1 },
    });
    res.send(genres);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
