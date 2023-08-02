const mongoose = require("mongoose");

mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const genreSchema = new mongoose.Schema({
  name: String,
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
  subtitle: String,
  description: String,
  releaseDate: Date,
  authors: [String],
  genres: [String],
  rating: Number,
  price: Number,
  isbn: String,
  eisbn: String,
  pages: Number,
  coverURL: String,
});

const User = mongoose.model("User", userSchema);
const Book = mongoose.model("Book", booksSchema);
const Genre = mongoose.model("Genre", genreSchema);

module.exports = { User, Book, Genre };
