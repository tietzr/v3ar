const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');

dotenv.config();

// console.log("KEYS");
// console.log(process.env);

const database = require("./src/database");
const userRoutes = require('./src/users');
const bookRoutes = require('./src/books');
const genreRoutes = require('./src/genres');


// require('./data/data-load');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use('/api/user', userRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/genres', genreRoutes);


const keys = { APPSETTING_BACK_END_URL: process.env.APPSETTING_BACK_END_URL} ;

app.get('/', function(req, res) {
  res.render('pages/index', keys);
});

const pages = ['cart', 'checkout', 'contact', 'about', 'login', 'register', 'add-book', 'edit-book'];

pages.forEach(pageName => {
  app.get(`/pages/${pageName}`, function(req, res) {
    res.render(`pages/${pageName}`, keys);
  });
});

app.get(`/pages/detail/:id`, function(req, res) {
  res.render(`pages/detail`, keys);
});

app.get(`/pages/edit-book/:id`, function(req, res) {
  res.render(`pages/edit-book`, keys);
});

// This app will run on port 3000 locahost:3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
