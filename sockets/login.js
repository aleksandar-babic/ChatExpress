var usersArray = require('../app.js');

exports = module.exports = function login(io) {
    //Listens to connection event, triggered when user creates socket
    io.sockets.on('connection', function (socket) {
        //Listens on tryLogin event, triggered when user sends ajax request for login
        socket.on('tryLogin',function (data,callback) {
            socket.username = data.username;
            io.sockets.emit('usernameList', usersArray.usersArray);
            callback(true);
        });
    });
};

