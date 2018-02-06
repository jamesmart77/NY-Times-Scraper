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
var db = require("../models");

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/week18Populater");

// scrape new york times
router.get("/scrape", (req, res) => {
    // First, we grab the body of the html with request
    axios.get("http://www.washingtonpost.com/").then( (err, response) => {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        if (err) {
            console.log("ERROR")
            console.log(err)
        } else {

            var $ = cheerio.load(response.data);

            // Now, we grab every h2 within an article tag, and do the following:
            // $("article.Asset-story--23Oy0").each(function (i, element) {
            //     // Save an empty result object
            //     var result = {};

            //     // Add the text and href of every link, and save them as properties of the result object
            //     result.title = $(this)
            //         .children("a")
            //         .text();
            //     result.link = $(this)
            //         .children("a")
            //         .attr("href");

            //     // Create a new Article using the `result` object built from scraping
            //     db.Article.create(result)
            //         .then(function (dbArticle) {
            //             // View the added result in the console
            //             console.log(dbArticle);
            //         })
            //         .catch(function (err) {
            //             // If an error occurred, send it to the client
            //             return res.json(err);
            //         });
            // });
            console.log(response.data)

            // If we were able to successfully scrape and save an Article, send a message to the client
            res.send("Scrape Complete");
        }
    });
});

module.exports = router;