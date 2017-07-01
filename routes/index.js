var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated,function(req, res, next) {
    if(!req.query.username && req.isAuthenticated())
        res.redirect('/appendUname');
    res.render('index');
});

router.get('/appendUname', ensureAuthenticated, function (req,res,next) {
    res.redirect('/?username=' + res.locals.user.username);
});

function ensureAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
