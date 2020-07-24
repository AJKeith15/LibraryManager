var express = require('express');
var router = express.Router();

/* GET home page. Redirect to book list */
router.get('/', function(req, res, next) {
  res.redirect('/books');
});

module.exports = router;
