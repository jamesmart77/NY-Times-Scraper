const express = require("express");
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const bodyParser = require("body-parser");
const path = require("path");
const logger = require("morgan");

const index = require('./routes/index_route');
const articlesRoute = require('./routes/articles');

const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

//make all files available in Public folder
app.use(express.static(path.join(__dirname, 'public')))

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// =======================================
//ROUTES

// route to render home page
app.use('/', index);

// route to handle article GET and Save POST
app.use('/', articlesRoute);

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});