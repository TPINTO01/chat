var mongoose = require('mongoose');

// Schema for User
var MessageSchema = new mongoose.Schema({
    sender: {
        type: String,
    },
    message: {
        type: String,
    }, 
}, {collection: 'messages'});

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;