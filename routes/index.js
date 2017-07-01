var express = require('express');
var router = express.Router();

router.get('/', ensureAuthenticated,function(req, res, next) {
    if(!req.query.username && req.isAuthenticated())
        return res.redirect('/appendUname');
    return res.render('index');
});

router.get('/appendUname', ensureAuthenticated, function (req,res,next) {
    return res.redirect('/?username=' + res.locals.user.username);
});

function ensureAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
