const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const router = express.Router();

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models --> default get's the index.js
const db = require("../models");

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/unionLeader");

//make ObjectID available for querying
const ObjectId = mongoose.Schema.ObjectId;

// scrape new york times
router.get("/scrape", (req, res) => {
    // First, we grab the body of the html with request
    axios.get("http://www.unionleader.com/section/news/")
        .then((response) => {
            // Then, we load that into cheerio and save it to $ for a shorthand selector


            const $ = cheerio.load(response.data);

            //array for articles to pass to client
            const articles = [];

            let articleCount = 0;

            // Now, we grab every h2 within an article tag, and do the following:
            $("article.media").each(function (i, element) {

                //limit to 20 articles
                if (articleCount === 20) {
                    //exit loop
                    return false
                }
                // Save an empty result object
                let result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .children(".teaser")
                    .children(".title")
                    .children("a")
                    .text();
                result.link = $(this)
                    .children(".teaser")
                    .children(".title")
                    .children("a")
                    .attr("href");
                result.summary = $(this)
                    .children(".teaser")
                    .children(".leadtext")
                    .text();

                console.log(result)

                // if result title is truthy
                if (result.title) {
                    //href from union leader returned from cheerio with relative ref
                    //adding domain and trimming white space before reassigning
                    result.link = "http://www.unionleader.com" + result.link.trim();

                    //add to article array
                    articles.push(result);

                    articleCount++;
                }
            })

            // If we were able to successfully scrape and save an Article, send a message to the client
            res.json(articles);
        })
        .catch((err) => console.log(`ERROR ${err}`));

    // console.log(response.data)

});

router.get("/saved", (req, res) => {

    // Find all Users
    db.Article.find({})
        .then(function (dbArticle) {
            // If all Users are successfully found, send them back to the client
            console.log(dbArticle);
            res.render('saved', {
                articles: dbArticle
            });
        })
        .catch(function (err) {
            // If an error occurs, send the error back to the client
            res.json(err);
        });
})

router.post("/save", (req, res) => {

    //get saved article object from req.body
    const article = req.body;

    // // Create a new Article using the `result` object built from scraping
    db.Article.create(article)
        .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            res.send("success")
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
        });
})

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...

    console.log("looking it up")
    db.Article.findOne({
            _id: req.params.id
        })
        // ..and populate all of the notes associated with it
        .populate("notes")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                notes: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

router.delete("/articles/:id", (req, res) => {

    //get saved article object from req.body
    const articleId = req.params.id;

    console.log("ID: " + articleId)

    // // Create a new Article using the `result` object built from scraping
    db.Article.remove({
            "_id": ObjectId(articleId)
        })
        .then((dbArticle) => {
            // View the added result in the console
            console.log("success " + JSON.stringify(dbArticle));
            res.send(`success deleting ${articleId}`)
        })
        .catch((err) => {
            // If an error occurred, send it to the client
            console.log("testing error " + err);
            return res.json(err);
        });
})

module.exports = router;