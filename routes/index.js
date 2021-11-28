var express = require('express');
var router = express.Router();
var db = require('../connection')


/* GET home page. */
router.get('/', async function (req, res) {
  let data = await db.get().collection('data').find().toArray()
  res.render('index',{data});
});

router.get('/add', async function (req, res) {
  res.render('add');
});

router.post('/add', async function (req, res) {
  let data = req.body
  db.get().collection('data').insertOne(data)
  res.redirect('/');
});

router.get('/:course', async function (req, res) {
  course = req.params.course
  let data = await db.get().collection('data').find({"course":course}).toArray()
  res.render('semester',{course});
});

router.get('/:course/add', async function (req, res) {
  let course = req.params.course
  res.render('add',{course});
});



// router.get('/:course/add', async function (req, res) {
//   let semester = req.body
//   db.get().collection('semester').insertOne(semester)
//   res.redirect('/semester1');
// });

















router.get('/semester1', async function (req, res) {
  res.render('subject');
});

// router.get('/english', async function (req, res) {
//   res.render('type');
// });

// router.get('/notes', async function (req, res) {
//   res.render('files');
// });

// router.get('/form', async function (req, res) {
//   res.render('form');
// });


module.exports = router;
