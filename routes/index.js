var express = require('express');
var router = express.Router();


//Handles homepage get requests
router.get('/', ensureAuthenticated,function(req, res, next) {
    if(!req.query.username && req.isAuthenticated())
        return res.redirect('/appendUname');
    return res.render('index');
});

//Redirect when user sends get request on home page, but does not send an username query
router.get('/appendUname', ensureAuthenticated, function (req,res,next) {
    return res.redirect('/?username=' + res.locals.user.username);
});

//Helper that verifies that user is logged in
function ensureAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
