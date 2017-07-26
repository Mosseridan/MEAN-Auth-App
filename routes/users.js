const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');



// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    // Validate fields TODO: take this out
    const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;        
    if(typeof newUser.name !== 'string' || newUser.name == '')
        return res.json({success: false, msg: 'No name specified.'});
    if(!emailRegExp.test(newUser.email))
        return res.json({success: false, msg: 'No email specified.'});
    if(typeof newUser.username !== 'string' || newUser.username == '')
        return res.json({success: false, msg: 'NonewUser username specified.'});
    if(typeof newUser.password !== 'string' || newUser.password == '')
        return res.json({success: false, msg: 'No password specified.'});

    // Check whether a user with this username already exists and if not create the new user
    User.getUserByUsername(newUser.username, (err, user) =>{
        if(err) throw err;
        if(user) return res.json({success: false, msg: 'Sorry, this username is taken. try anotherone.'});
        User.addUser(newUser, (err, user) => {
            if(err) res.json({success: false, msg:'Failed to register user.'});
            else res.json({success: true, msg:'Congratulations! You are now registered.'});
        });
    });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    // Validate fields TODO: take this out
    if(typeof username !== 'string' || username == '')
        return res.json({success: false, msg: 'No username specified.'});
    if(typeof password !== 'string' || password == '')
        return res.json({success: false, msg: 'No password specified.'});


    // Get user by username and authenticate it's password
    User.getUserByUsername(username, (err, user) =>{
        if(err) throw err;
        if(!user) return res.json({success: false, msg: 'User not found.'});
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user, config.secret, {expiresIn: 604800 /* 1 week */ });
                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } 
            else res.json({success: false, msg: 'Wrong password.'});
        });
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});

module.exports = router;