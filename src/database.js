const mongoose = require("mongoose");

mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  birthDate: Date,
  email: String,
  password: String,
  role: String,
});

const booksSchema = new mongoose.Schema({
  title: String,
  description: Date,
  year: Number,
  author: [String],
  tags: [String],
  genres: [String],
  cover: String,
  rating: Number,
  price: Number,
});

const User = mongoose.model("User", userSchema);
const Book = mongoose.model("Book", booksSchema);

module.exports = { User, Book };
