var usersArray = require('../app.js');
var Message = require('../models/messages')


exports = module.exports = function(io) {
    io.sockets.on('connection', function (socket) {

        socket.on('newUsername',function (data) {
            if(!(usersArray.usersArray.indexOf(data) > -1))
                usersArray.usersArray.push(data);
            io.sockets.emit('notifyNewUser', data);
            io.sockets.emit('usernameList', usersArray.usersArray);
        })

        //sendUsernames();

        socket.on('sayHello', function (data) {
            console.log("Client is talking to us: " + data);
            Message.find({}).sort('-time').limit(15).exec(function (err, messages) {
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
            var messageSave = new Message({
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

