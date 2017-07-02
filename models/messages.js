var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessagesSchema = new Schema({
    sender: String,
    body: String,
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessagesSchema);
