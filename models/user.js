const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
      type: String,
      required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
       type: String,
       required: true 
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    User.findOne({'username': username}, callback);
}

module.exports.addUser = function(newUser, callback){
   console.log(newUser);
    bcrypt.genSalt(10, (err,salt) => {
        console.log(newUser.password);
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, callback);
}