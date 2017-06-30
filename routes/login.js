var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {failureRedirect:'/login', failureFlash: 'Invalid username or password'}), function (req,res) {
    console.log("Authentification successful")
    res.redirect('/')
});

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);

});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


// verify login data
passport.use(new LocalStrategy(function (username,password,done) {
    User.getUserByUsername(username, function (err, user) {
        if (err) throw err;
        if (!user) {
            console.log('Unknown User');
            return done(null, false, {message: 'Unknown user'});
        }

        User.comparePassword(password, user.password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                console.log('Invalid Password');
                return done(null, false, {message: 'Invalid Password'})
            }
        });
    });
}));

module.exports = router;
