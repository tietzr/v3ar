const dotenv = require("dotenv");
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
// Serve static files from the "public" directory
console.log(__dirname)
app.use(express.static(path.join(__dirname, 'public')));

dotenv.config();

const database = require("./src/database");
var userRoutes = require('./src/users');

app.use('/user', userRoutes);

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.listen(3000, () => console.log("Server is running on port 3000"));
