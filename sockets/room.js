var usersArray = require('../app.js');
var Message = require('../models/messages')


exports = module.exports = function(io) {
    io.sockets.on('connection', function (socket) {
        //Listens to newUsername event from frontend, triggered when user joins room
        socket.on('newUsername',function (data) {
            if(!(usersArray.usersArray.indexOf(data) > -1))
                usersArray.usersArray.push(data);
            io.sockets.emit('notifyNewUser', data);
            io.sockets.emit('usernameList', usersArray.usersArray);
        })
        //Listens to sayHello event from frontend, triggered when user joins room
        //Sends last 15 messages from room to user
        socket.on('sayHello', function (data) {
            console.log("Client is talking to us: " + data);
            Message.find({}).sort('-time').limit(15).exec(function (err, messages) {
               socket.emit('getRecentMessages',messages);
            });
        });

        //Listens to leaving event from frontend, triggered when user unloads window(closes tab or logout)
        socket.on('leaving',function (data) {
           socket.username = data;
            if(!socket.username) return;
            usersArray.usersArray.splice(usersArray.usersArray.indexOf(socket.username), 1);
            sendUsernames();
            io.sockets.emit('userLeft', socket.username);
            console.log("Goodbye, "+socket.username+".")
        });

        //Listens to disconnect event from socket, triggered when user is disconnected (either leaved room or had connectivity problems)
        socket.on('disconnect',function (socket) {
            io.sockets.emit('userCount', Object.keys(io.sockets.sockets).length);
        });

        //Listens to send_message event from frontend, triggered when user sends an message
        socket.on('send_message', function (data) {
            console.log(data.username+" : " + data.message)
            var messageSave = new Message({
                sender: data.username,
                body: data.message
            });
            messageSave.save(function (err) {
                if(err) console.log("ERROR SAVING MESSAGE: " + err);
            });
            io.sockets.emit('responseMessage', data);
        });
        io.sockets.emit('userCount', Object.keys(io.sockets.sockets).length);
    });

    function sendUsernames() {
        io.sockets.emit('usernameList', usersArray.usersArray);
    }
};

