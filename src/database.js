const mongoose = require("mongoose");

mongoose.connect(process.env.APPSETTING_DB_CONNECTION_STRING, {
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
userSchema.index(
  { email: 1 },
  { collation: { locale: "en", strength: 1 } }
);
userSchema.index( { email: 1 }, { unique: true } );

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
  pages: Number,
  coverURL: String,
});
// Creates indexes to enable the search to ignore case in text
booksSchema.index(
  { isbn: 1 },
  { collation: { locale: "en", strength: 1 } }
);
booksSchema.index( { isbn: 1 }, { unique: true } );

const User = mongoose.model("User", userSchema);
const Book = mongoose.model("Book", booksSchema);
const Genre = mongoose.model("Genre", genreSchema);

module.exports = { User, Book, Genre };
