/* Dependencies:
    express
    express session
    mongoose
    bcrypt
    bodyparser 
    socket.io */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var Message = require('./models/message');

// Coonect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatapp', { useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;

// Handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

// Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// Sessions for tracking logiuns
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
}));

// Include routes
var routes = require('./router')
app.use('/', routes)

// Listen on port 3000
var server = app.listen(3000,function() {
  console.log('app listening on port 3000');
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
      console.log('message: ' + msg);
      io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
      console.log('user disconnected');
  });
});

app.use(function(req, res, next){
  req.io = io;
  next();
});
