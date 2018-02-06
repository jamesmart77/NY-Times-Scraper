const express = require("express");
const router = express.Router();


// login view
router.get("/", (req, res) => {


    res.render('index', {});
});

module.exports = router;