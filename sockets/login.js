var usersArray = require('../app.js');

exports = module.exports = function login(io) {
    io.sockets.on('connection', function (socket) {
        socket.on('tryLogin',function (data,callback) {
                    socket.username = data.username;
                    sendUsernames();
                    callback(true);
        })
    });

    function sendUsernames() {
        io.sockets.emit('usernameList', usersArray.usersArray);
    }

};

