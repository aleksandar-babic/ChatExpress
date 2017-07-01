var express = require('express');
var router = express.Router();

var User = require('../models/users');


router.get('/', function(req, res, next) {
    res.render('register');
});

router.post('/',function (req,res) {
   if(!req.body.username)
       return res.status(500).send('Username is required filed');
   if(!req.body.password || !req.body.password2)
       return res.status(500).send('You must enter and validate password');
   if(req.body.password != req.body.password2)
       return res.status(500).send('Passwords dont match');

   User.getUserByUsername(req.body.username,function (err,user) {
       if(err)
           return res.status(500).send('Error while creating user');
       if(user)
           return res.status(500).send('User with that username already exists.');

       User.createUser(new User({username:req.body.username,password:req.body.password},function (err) {
           if(err)
               return res.status(500).send('Error while creating user');
       }));
       return res.redirect('/login');
   });
});
module.exports = router;