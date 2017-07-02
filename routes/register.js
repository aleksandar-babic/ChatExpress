var express = require('express');
var router = express.Router();

var User = require('../models/users');

//Renders registration view
router.get('/', redirectIfLoggedIn, function (req, res, next) {
    res.render('register');
});

//Handles user registration
router.post('/',function (req,res) {
   if(!req.body.username)
       return res.send(500,{ success : false, message : 'Username is required.' });
   if(!req.body.password || !req.body.password2)
       return res.status(500).json({ success : false, message : 'Password and Password verify are required.' });
   if(req.body.password != req.body.password2)
       return res.status(500).json({ success : false, message : 'Passwords dont match.' });

   User.getUserByUsername(req.body.username,function (err,user) {
       if(err)
           return res.send(500,{ success : false, message : 'Error while creating user.' });
       if(user)
           return res.send(500,{ success : false, message : 'User with that username already exists.' });

       var user = new User({username:req.body.username,password:req.body.password});
       User.createUser(user,function (err) {
           if(err)
               return res.send(500,{ success : false, message : 'Error while creating user.' });
           req.login(user,function (err) {
               if(err) return next(err);
               return res.send(200,{ success : true, message : 'Successfully registrated and logged in.' });
           });
       });
   });
});

//Helper that redirects user to home page if he sent request to register but is already logged in
function redirectIfLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return res.redirect('/');
    next();
}

module.exports = router;