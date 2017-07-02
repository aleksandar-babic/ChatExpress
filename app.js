var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Handle connection to MongoDB
var mongoose = require('mongoose');
var mongoDBlink ='mongodb://localhost/chatexpress';
mongoose.connect(mongoDBlink);
var db = mongoose.connection;
//Handle connection errors
db.on('error',console.error.bind(console, 'MongoDB connection error:'));

//Routes
var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');


//Passport serialization,deserialization, Local strategy for login
var User = require('./models/users');
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


var app = express();


var server = require('http').Server(app);
var io = require('socket.io')(server);

//Socket implementation files
var socketLogin = require('./sockets/login')(io);
var socketRoom = require('./sockets/room')(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Handle Express sessions
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave:true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//SocketIO middleware
app.use(function(req, res, next){
    res.io = io;
    next();
});

//Global active users array
var usersArray = [];

//Add whole user from request to locals so it can be used app wide
app.get('*', function (req,res,next) {
    res.locals.user = req.user || null;
    next();
});

app.use('/', index);
app.use('/login', login);
app.use('/register',register);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
exports.usersArray = usersArray;