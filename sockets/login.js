/**
 * Created by Aleksandar Babic on 7.5.17..
 * Take a look at my portfolio at https://aleksandar.alfa-ing.com
 */

var usersArray = require('../app.js');

exports = module.exports = function login(io) {
    io.sockets.on('connection', function (socket) {
        socket.on('tryLogin',function (data,callback) {
                if(!validateUserName(data.username))
                    callback(false);
                else{
                    usersArray.usersArray.push(data.username);
                    socket.username = data.username;
                    sendUsernames();
                    callback(true);
                }
        })
    });

    function validateUserName(username) {
        return (usersArray.usersArray.indexOf(username) != -1)?false:true
    }

    function sendUsernames() {
        io.sockets.emit('usernameList', usersArray.usersArray);
    }

};

