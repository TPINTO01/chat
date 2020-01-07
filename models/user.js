var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// Schema for User
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
}, {collection: 'users'});

// Authenticate input against database
UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({ email : email }, function(err, user) {
            if (err) {                
                return callback(err)
            } else if (!user) {                
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function(err, result){
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        });
}

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