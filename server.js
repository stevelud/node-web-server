// server.js
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
// const ws = require('ws');
// const morgan = require('morgan');
const expressSession = require('express-session')
const cookieParser = require('cookie-parser')
const handlers = require('./lib/handlers.js')


// no arguments needed to pass to express:
var app = express('view engine', 'hbs');
var port = process.env.PORT || 8080;

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'));

app.use(cookieParser());

//** LOGIN section of server ************** //

// TEMP/PRACTICE: username and password
const myusername = 'admin'
const mypassword = 'pswd'

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(expressSession({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));


///********************  HANDLERS   ***********************************//

app.get('/', handlers.handleHomePage);

app.post('/process-login', handlers.processLogin);

app.get('/about', handlers.handleAboutPage);

app.get('/projects', handlers.handleProjectPage);

app.get('/user', handlers.handleUserPage);

app.get('/signup', handlers.handleSignupPage);

app.post('/signup-user', handlers.signupUser)

app.post('/logout', (req,res) => {
    req.session.destroy(); // session is ended; cookies on client-side are deleted
    res.redirect('/');
});

///********************************************************************//


app.listen(port, () => {
  console.log('Listening on port ' + port + '.');
});
