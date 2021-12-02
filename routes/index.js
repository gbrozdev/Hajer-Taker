const { ObjectID } = require('bson');
var express = require('express');
var router = express.Router();
var db = require('../connection')


/* GET home page. */
router.get('/', async function (req, res) {
  if (req.session.admin === true) {
    res.render('index', {admin:true});
  } else {
    res.render('index');
  }
});

router.get('/delete/:id', async function (req, res) {
  let id = req.params.id
  db.get().collection('data').deleteOne({ _id : ObjectID(id) })
  res.redirect('back')
});

router.get('/deleteupload/:id', async function (req, res) {
  let id = req.params.id
  db.get().collection('uploads').deleteOne({ _id : ObjectID(id) })
  res.redirect('back')
});

router.get('/edit/:id', async function (req, res) {
  let id = req.params.id
  let data = await db.get().collection('data').findOne({ _id: ObjectID(id) })
  res.render('edit',{data})
});

router.get('/editupload/:id', async function (req, res) {
  let id = req.params.id
  let upload = await db.get().collection('uploads').findOne({ _id: ObjectID(id) })
  res.render('editupload',{upload})
});

router.post('/edit', async function (req, res) {
  let newdata = req.body.name
  let query = { _id: ObjectID(req.body.id) }
  var newvalues = { $set: {name:newdata} };
  db.get().collection('data').updateOne(query, newvalues)
  res.redirect(req.session.url)
});

router.post('/editupload', async function (req, res) {
  let newname = req.body.name
  let newlink = req.body.link
  let query = { _id: ObjectID(req.body.id) }
  var newvalues = { $set: { name:newname,link:newlink } };
  db.get().collection('uploads').updateOne(query, newvalues)
  res.redirect(req.session.url)
});

router.get('/courses', async function (req, res) {
  req.session.url = req.route.path
  let data = await db.get().collection('data').find({ "item": "courses" }).toArray()
  if (req.session.admin === true) {
    res.render('courses',{data,admin:true});
  } else {
    res.render('courses',{data});
  }
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

router.get('/admin', async function (req, res) {
  res.render('admin');
});

router.post('/admin', async function (req, res) {
  let admindata = req.body
  if (admindata.gmail === "gbroz@123",admindata.password === "9846551975") {
    req.session.admin = true
  res.redirect('/');
  } else {
    res.render('admin');
}
});

router.get('/videos/:course/:semester/:subject', async function (req, res) {
  let course= req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let videoid = ('videos'+course + semester + subject)
  url = 'videos' + '/' + course+'/'+semester+'/'+subject
  req.session.url = url
  let uploads = await db.get().collection('uploads').find({ "item": videoid }).toArray()
  if (req.session.admin === true) {
    res.render('videos',{course,semester,subject,uploads,admin:true});
  } else {
    res.render('videos',{course,semester,subject,uploads});
  }
});

router.get('/course/:course', async function (req, res) {
  course = req.params.course
  url = '/course/' + course
  req.session.url = url
  let data = await db.get().collection('data').find({ "item": course }).toArray()
  if (req.session.admin === true) {
    res.render('semester',{data, course, admin:true});
  } else {
    res.render('semester', { data, course });
  }
});

router.get('/:course/:semester', async function (req, res) {
  let course= req.params.course
  let semester = req.params.semester
  let subjectid = (course + semester);
  url = course+'/'+semester
  req.session.url = url
  let data = await db.get().collection('data').find({ "item": subjectid }).toArray()
  if (req.session.admin === true) {
    res.render('subject',{course,semester,data,admin:true});
  } else {
    res.render('subject',{course,semester,data});
  }
});

router.get('/:course/:semester/:subject', async function (req, res) {
  let course= req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let typeid = (course + semester + subject)
  url = course+'/'+semester+'/'+subject
  req.session.url = url
  let data = await db.get().collection('data').find({ "item": typeid }).toArray()
  if (req.session.admin === true) {
    res.render('type',{course,semester,subject,data,admin:true});
  } else {
    res.render('type',{course,semester,subject,data});
  }
});

router.get('/:course/:semester/:subject/:type', async function (req, res) {
  let course= req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let type = req.params.type
  let fileid = (course + semester + subject +type)
  url = course+'/'+semester+'/'+subject+'/'+type
  req.session.url = url
  let uploads = await db.get().collection('uploads').find({ "item": fileid }).toArray()
  if (req.session.admin === true) {
    res.render('files',{course,semester,subject,type,uploads,admin:true});
  } else {
    res.render('files',{course,semester,subject,type,uploads});
  }
});

router.get('/upload:parameter', async function (req, res) {
  let parameter = req.params.parameter
  res.render('upload',{parameter});
});

router.post('/upload', async function (req, res) {
  let upload = req.body
    var ytlink = upload.link
    ytlink = ytlink.replace("https://youtu.be/", "");
    upload.link = ytlink
  db.get().collection('uploads').insertOne(upload)
  url = req.session.url
  res.redirect(url);
});







module.exports = router;
