const express = require("express");
const router = express.Router();


// homepage view
router.get("/", (req, res) => {

    //adding a property to req for custom Handlebars --> in server.js 
    req.onIndex = true;

    res.render('index', {onIndex: req.onIndex});
});

module.exports = router;