/**
 * Created by Aleksandar Babic on 8.5.17..
 * Take a look at my portfolio at https://aleksandar.alfa-ing.com
 */

//Handle connection to MongoDB
var mongoose = require('mongoose');
var mongoDBlink = 'mongodb://not:gonna@give.it.to.you:33981/devdb64';
mongoose.connect(mongoDBlink);
var db = mongoose.connection;
//Handle connection errors
db.on('error',console.error.bind(console, 'MongoDB connection error:'));

//Define a schema
var Schema = mongoose.Schema;

var MessagesSchema = new Schema({
    sender: String,
    body: String,
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('messagesModel', MessagesSchema);
