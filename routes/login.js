var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', redirectIfLoggedIn, function (req, res, next) {
    res.render('login');
});

router.post('/', function (req,res,next) {

    if(!req.body.username)
        res.status(500).send('Username is required');
    if(!req.body.password)
        res.status(500).send('Password is required');

    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (! user) {
            return res.send(401,{ success : false, message : 'Authentication failed' });
        }
        req.login(user, function(err){
            if(err){
                return next(err);
            }
            console.log("Authentification successful");
            return res.send(200,{ success : true, message : 'Successfully logged in' });
        });
    })(req, res, next);
});

router.get('/destroy',function (req,res,next) {
    req.logout();
    res.redirect('/login');
});

function redirectIfLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return res.redirect('/');
    next();
}

module.exports = router;
