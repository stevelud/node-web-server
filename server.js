// server.js
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
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
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

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


///*******************************************//

app.get('/', (req, res) => {

  res.status(200);

  session = req.session;

  if (req.session.userid) {
    res.render('home.hbs', {
      username:session.userid,
      validUser:true,
      pageTitle:'Home Page',
      welcomeMessage: 'Welcome, ' + req.session.userid,
    });
  } else {
    res.render('home.hbs', {
      pageTitle:'Home Page',
      welcomeMessage:'Welcome to my Website!',
    });
  }
});

app.post('/process-login', handlers.processLogin)


app.get('/about', (req, res) => {
  session = req.session;

  res.render('about.hbs', {
    pageTitle:'About Page',
    username:session.userid,
  });
});


app.get('/projects', (req, res) => {
  session = req.session;

  res.render('projects.hbs', {
    pageTitle:'Projects',
    username:session.userid,
  });
});


app.get('/api', (req, res) => {
  session = req.session;

  res.render('api.hbs', {
    pageTitle:'API',
    username:session.userid,
  });
});

app.get('/user', (req, res) => {
  session = req.session;

  res.render('user.hbs', {
    pageTitle:'User\'s Homepage',
    username:session.userid,
  });
});

app.get('/signup', (req, res) => {
  session = req.session;

  res.render('signup.hbs', {
    pageTitle:'Signup Here',
    username:session.userid,
  });
});

app.post('/logout', (req,res) => {
    req.session.destroy(); // session is ended; cookies on client-side are deleted
    res.redirect('/');
});

app.post('/signup-user', handlers.signupUser)


app.listen(port, () => {
  console.log('Listening on port ' + port + '.');
});
