/**
 * Created by Aleksandar Babic on 7.5.17..
 * Take a look at my portfolio at https://aleksandar.alfa-ing.com
 */

var usersArray = require('../app.js');
var messagesModel = require('../models/messages')


exports = module.exports = function(io) {
    io.sockets.on('connection', function (socket) {

        socket.on('newUsername',function (data) {
            io.sockets.emit('notifyNewUser', data);
        })

        sendUsernames();

        socket.on('sayHello', function (data) {
            console.log("Client is talking to us: " + data);
            messagesModel.find({}).sort('-time').limit(15).exec(function (err,messages) {
               socket.emit('getRecentMessages',messages);
            });
        });

        socket.on('leaving',function (data) {
           socket.username = data;
            if(!socket.username) return;
            usersArray.usersArray.splice(usersArray.usersArray.indexOf(socket.username), 1);
            sendUsernames();
            io.sockets.emit('userLeft', socket.username);
            console.log("Goodbye, "+socket.username+".")
        })
        socket.on('disconnect',function (socket) {
            io.sockets.emit('userCount', Object.keys(io.sockets.sockets).length);
        })
        socket.on('send_message', function (data) {
            console.log(data.username+" : " + data.message)
            var messageSave = new messagesModel({
                sender: data.username,
                body: data.message
            });
            messageSave.save(function (err) {
                if(err) console.log("ERROR SAVING MESSAGE: " + err);
            })
            io.sockets.emit('responseMessage', data);
        });
        io.sockets.emit('userCount', Object.keys(io.sockets.sockets).length);
    });

    function sendUsernames() {
        io.sockets.emit('usernameList', usersArray.usersArray);
    }
};

