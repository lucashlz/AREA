const express = require("express");
const router = express.Router();
const aboutjson = require("../about.json")

// About json page
router.get("/about.json", function (req, res) {
  res.send(aboutjson);
});

module.exports = router;