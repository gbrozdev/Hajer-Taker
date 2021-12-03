var express = require('express');
var router = express.Router();
var db = require('../connection')
var fun = require('../functions')
var ObjectId = require('mongodb').ObjectId


router.post('/signup', (req, res) => {
  console.log(req.body);
  fun.doSignup(req.body).then((response) => {
    if (response.signupstatus) {
      session = req.session;
      session.user = response.insertedId
      session.loggedfalse = false
      session.loggedIN = true
      res.redirect('/profile')
    } else {
      req.session.signupstatusfalse = true
      res.redirect('/users/signup/')
    }
  })
})


router.post('/login', (req, res) => {
  console.log(req.body);
  fun.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = String(response.user._id)
      req.session.loggedfalse = false
      req.session.loggedIN = true
      res.redirect('/')
    } else {
      req.session.loggedfalse = true
      res.redirect('/login');
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