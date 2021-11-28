var express = require('express');
var router = express.Router();
var db = require('../connection')


/* GET home page. */
router.get('/', async function (req, res) {
  let items = await db.get().collection('items').find().toArray()
  res.render('index',{items});
});

router.get('/add', async function (req, res) {
  res.render('add');
});

router.get('/:id', async function (req, res) {
  let itemid = req.params.id
  res.render('semester',{itemid});
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

router.post('/add', async function (req, res) {
  let item = req.body
  db.get().collection('items').insertOne(item)
  res.redirect('/');
});

router.get('/:itemid/add', async function (req, res) {
  res.render('add');
});

module.exports = router;
