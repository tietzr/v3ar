const express = require("express");
const router = express.Router();

const { Book, Genre } = require("./database");

router.get("/", async (req, res) => {
  res.send("Welcome to Books API!");
});

router.post("/add", async (req, res) => {
  const newBook = req.body;

  try {
    if (await Book.exists({ isbn: new RegExp(newBook.isbn, "i") })) {
      res.status(500).send({
        status: "error",
        message:
          "The ISBN already exists in the database, please make sure to have a unique code for this book",
      });
    }

    const book = new Book(newBook);
    const savedBook = await book.save();
    
    res.send(savedBook);
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Something went wrong trying to add the book to the database",
    });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.send(book);
  } catch (err) {
    res.status(500).send(err);
  }
});



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

    if (filter?.ids?.length) {
      queryFilter._id = {
        $in: filter.ids,
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
            title: new RegExp(filter.search, "i"),
          },
          {
            authors: new RegExp(filter.search, "i"),
          },
        ],
      });
    }

    if (andClause.length > 0) {
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

router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    res.send(book);
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Something went wrong trying to delete the book from the database",
    });
  }
});

module.exports = router;
