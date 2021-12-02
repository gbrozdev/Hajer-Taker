var express = require('express');
var router = express.Router();
var db = require('../connection')
var fun = require('../functions')
var ObjectId = require('mongodb').ObjectId


router.get('/signup', (req, res) => {
  
  if (req.session.signupstatusfalse) {
    res.render('signup', { err: true })
  } else
    res.render('signup')
})


router.post('/signup', (req, res) => {
  fun.doSignup(req.body).then((response) => {
    if (response.signupstatus) {
      session = req.session;
      session.user = response.insertedId
      session.loggedfalse = false
      session.loggedIN = true
      res.redirect('/users/')
    } else {
      req.session.signupstatusfalse = true
      res.redirect('/users/signup/')
    }
  })
})


router.get('/login', function (req, res) {
  console.log(req.session);
  if (req.session.loggedIN) {
    res.redirect('/users/')
  }
  if (req.session.loggedfalse) {
    res.render('login', { err: true });
  } else {
    res.render('login');
  }
});

router.post('/login', (req, res) => {
  fun.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = String(response.user._id)
      req.session.loggedfalse = false
      req.session.loggedIN = true
      res.redirect('/users/')
    } else {
      req.session.loggedfalse = true

      res.redirect('/users/login');
    }
  })
})


module.exports = router;


// router.get('/blog/:id', async (req, res) => {
//   let id = req.params.id
//   let user =  await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
//   let blog = await db.get().collection('blogs').findOne({ _id: ObjectId(id) })
//   let blogs = await db.get().collection('blogs').find().toArray()
//   res.render('blog', { blogs,user,blog })
// })