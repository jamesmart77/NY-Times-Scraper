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

// Require all models
const db = require("../models");

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/unionLeader");

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

router.post("/save", (req, res) => {

    const article = req.body;
    console.log("Hitting it");
    console.log(article);
    
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

module.exports = router;