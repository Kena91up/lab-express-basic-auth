const express = require('express');
const router = require("express").Router();
const UserNameModel = require('../models/User.model')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/* GET login page */
router.get("/login", (req, res, next) => {
    res.render('form/login.hbs')
});

/* GET signup page */
router.get("/signup", (req, res, next) => {
  res.render('form/signup.hbs')
});

// Handle POST requests to /signup
router.post("/signup", (req, res, next) => {
    const {username, password} = req.body
    //validate first
   // checking if the user has entered all three fields
   // we're missing one important step here
   if (!username.length || !password.length) {
     res.render('form/signup', {msg: 'Please enter all fields'})
     return;
 }

  let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.render('form/signup', { msg: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

     // creating a salt 
     let salt = bcrypt.genSaltSync(10);
     let hash = bcrypt.hashSync(password, salt);
      //console.log(hash)
      UserNameModel.create({username, password: hash})
      .then(() => {
         res.redirect('/')
      })
      .catch(() => {
        next(err)
     })

});
// Handle POST requests to /signin
router.post("/login", (req, res, next) => {
 const {username, password} = req.body

 UserNameModel.findOne({username})
   .then((result) => {
     //if result exists
     if(result){
         bcrypt.compare(password, result.password)
         .then((isMatching) => {
               if(isMatching){
                 req.session.userName = result
                   res.redirect('/profile')
               } else {
                    res.render('form/login.hbs',{msg:'Password dont match'})
               }
         })
         } else {
           res.render('form/login.hbs',{msg:'Email does not match'})
       }
   })
   .catch(() => {
     next(err)
  })

});
//GET request to handle /profile

//Middleware to protect routes
const checkUserName =(req, res, next) =>{
    if (req.session.userName) {
      next()
  }
  else {
      res.redirect('/login')
  }
  }
  
  router.get('/profile', checkUserName, (req, res, next) => {
    let username = req.session.userName.username
    res.render('profile.hbs', {username})
  })

  router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
  })
  

  router.get('/main', (req, res)=>{
    res.render('main.hbs')
});
router.get('/private', (req, res)=>{
  res.render('private.hbs')
});


module.exports = router;