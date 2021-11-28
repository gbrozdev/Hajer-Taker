var express = require('express');
var router = express.Router();
var db = require('../connection')


/* GET home page. */
router.get('/', async function (req, res) {
  res.render('index');
});

router.get('/add', async function (req, res) {
  res.render('add');
});

router.get('/bca', async function (req, res) {
  res.render('semester');
});

router.get('/semester1', async function (req, res) {
  res.render('subject');
});

router.get('/english', async function (req, res) {
  res.render('type');
});

router.get('/notes', async function (req, res) {
  res.render('files');
});

router.get('/form', async function (req, res) {
  res.render('form');
});

module.exports = router;
