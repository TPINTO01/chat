var express = require('express');
var router = express.Router();
var User = require('./models/user');

// Require login for page
function requireLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('You must be logged in to view this content.');
        err.status = 401;
        return next(err);
    }
}

// GET route for login page
router.get('/login', function(req, res){
    return res.sendFile(__dirname + '/templates/login.html');
});

// POST route for Registration/login page
router.post('/login', function(req, res, next){
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
        User.create(userData, function(err, user) {
            if (err) {
                return next (err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/chat');            
            }
        });
    } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function(error, user){        
            if (error || !user) {
                console.log('esketit');
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/chat');            
            }
        });
    } else {    
        var err = new Error('All fields required');
        err.status = 400;
        return next(err);
    }
});

// GET route after registering/login
router.get('/chat', function (req, res, next){
    User.findById(req.session.userId, function(error, user) {
        if (error) {
            return next(error);
        } else if (user === null) {
            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err);
        } else {           
            return res.sendFile(__dirname + '/templates/chat.html');       
        }
    });
});

// GET for logout
router.get('/logout', function(req, res, next){
    if (req.session) {
        // delete session object
        req.session.destroy(function(err){
            if (err) {
                return next(err); 
            } else {
                return res.redirect('/login');           
            }
        });
    }
});

module.exports = router;