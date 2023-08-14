const express = require("express");
const router = express.Router();
const { Genre } = require("./database");

router.get("/", async (req, res) => {
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