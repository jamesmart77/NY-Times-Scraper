const express = require("express");
const router = express.Router();


// homepage view
router.get("/", (req, res) => {


    res.render('index', {});
});

module.exports = router;