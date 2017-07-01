var express = require('express');
var router = express.Router();
var passport = require('passport');

var usersArray = require('../app.js');

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/', function (req,res,next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (! user) {
            return res.send(401,{ success : false, message : 'authentication failed' });
        }
        req.login(user, function(err){
            if(err){
                return next(err);
            }
            console.log("Authentification successful");
            usersArray.usersArray.push(req.body.username);
            res.redirect('/?username=' + req.body.username);
        });
    })(req, res, next);
});

module.exports = router;
