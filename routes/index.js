var express = require('express');
var router = express.Router();
var db = require('../connection')
var fun = require('../functions')
var ObjectId = require('mongodb').ObjectId


/* GET home page. */

router.get('/myprofile', async function (req, res) {
  req.session.url = '/myprofile'
  let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
  let uploads = await db.get().collection('uploads').find({ "user": req.session.user }).toArray()
  if (user) {
    res.render('myprofile', { user, uploads })
  } else {
    res.redirect('/login')
  }
});

router.get('/', async function (req, res) {
  if (req.session.admin === true) {
    res.render('index', { admin: true });
  } else {
    res.render('index');
  }
});

router.get('/list/:id', async function (req, res) {
  if (req.session.user) {
    let old = await db.get().collection('list').findOne({ id: ObjectId(req.params.id), userid: req.session.user })
    if (!old) {
      let uploads = await db.get().collection('uploads').findOne({ _id: ObjectId(req.params.id) })
      let listdata = { data: uploads, userid: req.session.user, id: uploads._id }
      db.get().collection('list').insertOne(listdata)
    }
    res.redirect('back')
  } else {
    res.redirect('/login')
  }
});

router.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/');
});

router.get('/list', async function (req, res) {
  req.session.url = '/list'
  if (req.session.user) {
    let listdata = await db.get().collection('list').find({ userid: req.session.user }).toArray()
    res.render('list', { listdata });
  } else {
    res.redirect('/login')
  }
});

router.get('/deletelist/:id', async function (req, res) {
  let id = req.params.id
  db.get().collection('list').deleteOne({ id: ObjectId(id), userid: req.session.user })
  res.redirect('back')
});

router.get('/about', async function (req, res) {
  res.render('about');
});

router.get('/admin', async function (req, res) {
  res.render('admin');
});

router.get('/login', function (req, res) {
  if (req.session.loggedIN) {
    res.redirect('/users/')
  }
  if (req.session.loggedfalse) {
    res.render('login', { err: true });
  } else {
    res.render('login');
  }
});

router.get('/signup', (req, res) => {
  if (req.session.signupstatusfalse) {
    res.render('signup', { err: true })
  } else
    res.render('signup')
})

router.get('/delete/:id', async function (req, res) {
  let id = req.params.id
  db.get().collection('data').deleteOne({ _id: ObjectId(id) })
  res.redirect('back')
});

router.get('/deleteupload/:id', async function (req, res) {
  let id = req.params.id
  db.get().collection('uploads').deleteOne({ _id: ObjectId(id) })
  res.redirect('back')
});

router.get('/edit/:id', async function (req, res) {
  let id = req.params.id
  let data = await db.get().collection('data').findOne({ _id: ObjectId(id) })
  res.render('edit', { data })
});
 
router.get('/editupload/:id', async function (req, res) {
  let id = req.params.id
  let upload = await db.get().collection('uploads').findOne({ _id: ObjectId(id) })
  res.render('editupload', { upload })
});

router.post('/edit', async function (req, res) {
  let newdata = req.body.name
  let query = { _id: ObjectId(req.body.id) }
  var newvalues = { $set: { name: newdata } };
  db.get().collection('data').updateOne(query, newvalues)
  res.redirect(req.session.url)
});

router.post('/editupload', async function (req, res) {
  let newname = req.body.name
  let newlink = req.body.link
  let query = { _id: ObjectId(req.body.id) }
  var newvalues = { $set: { name: newname, link: newlink } };
  db.get().collection('uploads').updateOne(query, newvalues)
  res.redirect(req.session.url)
});

router.get('/courses', async function (req, res) {
  req.session.url = req.route.path
  let data = await db.get().collection('data').find({ "item": "courses" }).toArray()
  if (req.session.admin === true) {
    res.render('courses', { data, admin: true });
  } else {
    res.render('courses', { data });
  }
});

router.get('/add:parameter', async function (req, res) {
  let parameter = req.params.parameter
  res.render('add', { parameter });
});

router.post('/add', async function (req, res) {
  let data = req.body
  db.get().collection('data').insertOne(data)
  url = req.session.url
  res.redirect(url);
});

router.post('/admin', async function (req, res) {
  let admindata = req.body
  if (admindata.gmail === "gbroz@123", admindata.password === "9846551975") {
    req.session.admin = true
    let users = await db.get().collection('users').find().toArray()
    res.render('admindata', { users });
  } else {
    res.render('admin');
  }
});

router.get('/videos/:course/:semester/:subject', async function (req, res) {
  let course = req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let videoid = ('videos' + course + semester + subject)
  url = 'videos' + '/' + course + '/' + semester + '/' + subject
  req.session.url = url
  let uploads = await db.get().collection('uploads').find({ "item": videoid, "type": "link" }).toArray()
  let playlists = await db.get().collection('uploads').find({ "item": videoid , "type":"playlist" }).toArray()
  if (req.session.admin === true) {
    res.render('videos', { course, semester, subject, uploads, playlists , admin: true });
  } else {
    res.render('videos', { course, semester, subject, uploads ,playlists });
  }
});

router.get('/course/:course', async function (req, res) {
  course = req.params.course
  url = '/course/' + course
  req.session.url = url
  let data = await db.get().collection('data').find({ "item": course }).toArray()
  if (req.session.admin === true) {
    res.render('semester', { data, course, admin: true });
  } else {
    res.render('semester', { data, course });
  }
});

router.get('/:course/:semester', async function (req, res) {
  let course = req.params.course
  let semester = req.params.semester
  let subjectid = (course + semester);
  url = course + '/' + semester
  req.session.url = url
  let data = await db.get().collection('data').find({ "item": subjectid }).toArray()
  if (req.session.admin === true) {
    res.render('subject', { course, semester, data, admin: true });
  } else {
    res.render('subject', { course, semester, data });
  }
});

router.get('/:course/:semester/:subject', async function (req, res) {
  let course = req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let typeid = (course + semester + subject)
  url = course + '/' + semester + '/' + subject
  req.session.url = url
  let data = await db.get().collection('data').find({ "item": typeid }).toArray()
  if (req.session.admin === true) {
    res.render('type', { course, semester, subject, data, admin: true });
  } else {
    res.render('type', { course, semester, subject, data });
  }
});

router.get('/:course/:semester/:subject/:type', async function (req, res) {

  let course = req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let type = req.params.type
  let fileid = (course + semester + subject + type)
  url = course + '/' + semester + '/' + subject + '/' + type
  req.session.url = url
  let uploads = await db.get().collection('uploads').find({ "item": fileid }).toArray()
  if (req.session.admin) {
    res.render('files', { course, semester, subject, type, uploads, admin: true });
  } else {
    if (req.session.user) {
      res.render('files', { course, semester, subject, type, uploads, users: true });
    } else {
      res.render('files', { course, semester, subject, type, uploads });
    }
  }
});

router.get('/:course/:semester/:subject/:type/:id/:filename', async function (req, res) {
  let course = req.params.course
  let semester = req.params.semester
  let subject = req.params.subject
  let type = req.params.type
  let id = req.params.id
  let file = await db.get().collection('uploads').findOne({ _id: ObjectId(id) })
  let url = file.link;
  let myArray = url.split("/").pop();
  myArray = myArray.split(".")
  file.filename = myArray[0]
  console.log(file);
  let blogname = "Calicut University " + course+" "+ semester+" "+ subject+" " + type + " download | " + file.filename
  let blogdesc = "Calicut University " + course+" "+ semester+" "+ subject+" " + type + " You can download from here.. Studocu place for calicut university students | " + file.filename
  res.render('fileframe', { file, course, semester, subject, type, blogname,blogdesc });
})

router.get('/upload:parameter', async function (req, res) {
  let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
  let parameter = req.params.parameter
  res.render('upload', { parameter, user });
});

router.get('/pdfupload:parameter', async function (req, res) {
  let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
  let parameter = req.params.parameter
  res.render('uploadpdf', { parameter, user });
});

router.post('/upload', async function (req, res) {
  let upload = req.body
  var ytlink = upload.link
  var playlist = upload.playlist
  if (ytlink) {
    ytlink = ytlink.replace("https://youtu.be/", "");
    upload.link = ytlink
  }
  if (playlist) {
    playlist = playlist.replace("https://youtube.com/playlist?", "");
    upload.playlist = playlist
  }
  db.get().collection('uploads').insertOne(upload)
  url = req.session.url
  res.redirect(url);
});

router.post('/pdfupload', async function (req, res) {
  let upload = req.body
  db.get().collection('uploads').insertOne(upload)
  url = req.session.url
  res.redirect(url);
});

router.post('/signup', (req, res) => {
  fun.doSignup(req.body).then((response) => {
    if (response.signupstatus) {
      session = req.session;
      session.user = response.insertedId
      session.loggedfalse = false
      session.loggedIN = true
      res.redirect(req.session.url)
    } else {
      req.session.signupstatusfalse = true
      res.redirect('/signup/')
    }
  })
})


router.post('/login', (req, res) => {
  fun.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = String(response.user._id)
      req.session.loggedfalse = false
      req.session.loggedIN = true
      res.redirect(req.session.url)
    } else {
      req.session.loggedfalse = true
      res.redirect('/login');
    }
  })
})

module.exports = router;
