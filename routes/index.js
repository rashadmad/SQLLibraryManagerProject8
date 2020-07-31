var express = require('express');
var router = express.Router();
const Book = require('../models').Book;  

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(Book)
  //res.render('index', { title: 'Express' });
});

module.exports = router;
