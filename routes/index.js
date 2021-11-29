var express = require('express');
var router = express.Router();
var db = require('../connection')


/* GET home page. */
router.get('/', async function (req, res) {
  res.render('index');
});

router.get('/courses', async function (req, res) {
  req.session.url = req.route.path
  console.log(req.session.url);
  let data = await db.get().collection('data').find({"item":"courses"}).toArray()
  res.render('courses',{data});
});

router.get('/add:parameter', async function (req, res) {
  let parameter = req.params.parameter
  console.log(parameter);
  res.render('add',{parameter});
});

router.post('/add', async function (req, res) {
  let data = req.body
  db.get().collection('data').insertOne(data)
  url = req.session.url
  res.redirect(url);
});

router.get('/about', async function (req, res) {
  res.render('about');
});

router.get('/course/:course', async function (req, res) {
  course = req.params.course
  url = '/course/' + course
  req.session.url = url
  let data = await db.get().collection('data').find({ "item":course}).toArray()
  res.render('semester', { data, course });
});

router.get('/:course/:semester', async function (req, res) {
  let course= req.params.course
  let semester = req.params.semester
  let subjectid = (course + semester);
  url = course+'/'+semester
  req.session.url = url
  let data = await db.get().collection('data').find({ "item":subjectid}).toArray()
  res.render('subject',{course,semester,data});
});

router.get('/:course/:semester/:subject', async function (req, res) {
  let course= req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let typeid = (course + semester + subject)
  url = course+'/'+semester+'/'+subject
  req.session.url = url
  let data = await db.get().collection('data').find({ "item":typeid}).toArray()
  res.render('type',{course,semester,subject,data});
});

router.get('/:course/:semester/:subject/:type', async function (req, res) {
  let course= req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let type = req.params.type
  url = course+'/'+semester+'/'+subject+'/'+type
  req.session.url = url
  let uploads = await db.get().collection('uploads').find().toArray()
  res.render('files',{course,semester,subject,type,uploads});
});

router.get('/upload:parameter', async function (req, res) {
  let parameter = req.params.parameter
  res.render('upload',{parameter});
});

router.post('/upload', async function (req, res) {
  let upload = req.body
  db.get().collection('uploads').insertOne(upload)
  url = req.session.url
  res.redirect(url);
});







module.exports = router;
