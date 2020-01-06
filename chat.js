/* Dependencies:
    express
    mongoose
    bcrypt
    bodyparser
*/

var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true });
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});


UserSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash){
        if (err) {
            console.log("UserSchema failed or something")
            return next(err);
        } 
        user.password = hash;
        console.log("Got the hashed password");
        next();
    })
});

var User = mongoose.model('User', UserSchema);
module.exports = User;


// App routes & responses

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/',function(req,res){
    res.send('Hello World!');
});

app.post('/', function(req, res, next){
    console.log(req.body);

    //extract data from request
    //create db entry
    if (req.body.email && req.body.username && req.body.password) {
        var userData = {
            email : req.body.email,
            username : req.body.username,
            password : req.body.password
        };

        // Use schema.create to insert data into db
        User.create(userData, function(err, user){
            if (err) {
                return next (err);
            }
        });

        res.send("Successfully posted email, username, password")
    }

    res.send("Unsuccessful post");
});

var server=app.listen(3000,function() {});