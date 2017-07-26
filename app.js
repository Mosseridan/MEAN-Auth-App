const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const users = require('./routes/users');

// Connect to DataBase
mongoose.connect(config.database);

//On connection
mongoose.connection.on('connected', () => 
    console.log('Connected to database: '+config.database));

//On connection
mongoose.connection.on('error', (err) => 
    console.log('DataBase error: '+err));


// Express app
const app = express();

// Port
const port = process.env.PORT || 8080;
// var port = 3000; 
// for(let i = 3; i < process.argv.length; i++){
//     if(process.argv[i-1] === '-p' && Number.isInteger(Number(process.argv[i])))
//         port = Number(process.argv[i]);
// }

// CORS middleware
app.use(cors());

// Set static foleder
app.use(express.static(path.join(__dirname, 'public')));

// Body-parser middleware
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

// Index route
app.get('/', (req, res) =>
    res.send('Invalid Endpoint'));

app.get('*', (req,res) =>
    res.sendFile(path.join(__dirname, 'public/index.html')));

// Start server
app.listen(port, (err) => {
    if(err) throw err;
    console.log('Server started on port '+port);
});