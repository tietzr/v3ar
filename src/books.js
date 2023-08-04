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

    const andClause = [];
    if (filter?.prices?.length) {
      andClause.push({
        $or: filter.prices.map((price) => {
          return {
            price: { $gte: price.min, $lte: price.max ?? Number.MAX_VALUE },
          };
        }),
      });
    }

    if (filter?.search) {
      andClause.push({
        $or: [
          {
            title: new RegExp(filter.search, 'i'),
          },
          {
            authors: new RegExp(filter.search, 'i'),
          },
        ],
      });
    }

    if (andClause.length > 0 ){
      queryFilter.$and = andClause;
    }

    const books = await Book.find(queryFilter, null, {
      limit: numItems,
      skip: page * numItems,
      sort: { [sort]: 1 },
    });

    const total = await Book.count(queryFilter);
    res.send({
      items: books,
      total,
    });
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
