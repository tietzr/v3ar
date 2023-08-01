const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser')

const app = express();
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Serve static files from the "public" directory
console.log(__dirname)
app.use(express.static(path.join(__dirname, 'public')));

dotenv.config();

const database = require("./src/database");
var userRoutes = require('./src/users');
app.set('view engine', 'ejs');

app.use('/api/user', userRoutes);

app.get('/', function(req, res) {
  res.render('pages/index');
});

const pages = ['cart', 'checkout', 'contact', 'detail', 'shop', 'login'];

pages.forEach(pageName => {
  app.get(`/pages/${pageName}`, function(req, res) {
    res.render(`pages/${pageName}`);
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
