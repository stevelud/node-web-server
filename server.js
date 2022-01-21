// server.js
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');
// const ws = require('ws');
// const morgan = require('morgan');
const expressSession = require('express-session')
const cookieParser = require('cookie-parser')

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

  if (req.session.userid) {
    res.render('home.hbs', {
      user:req.session.userid,
      validUser:true,
      pageTitle:'Home Page',
      welcomeMessage: 'Welcome, ' + req.session.userid,
    });
  } else {
    res.render('home.hbs', {
      validUser:false,
      pageTitle:'Home Page',
      welcomeMessage:'Welcome to my Website!',
    });
  }
});

app.post('/process-login', (req, res) => {
  if (req.body.username === myusername && req.body.password === mypassword) {
    session = req.session;
    session.userid = req.body.username;
    res.render('home.hbs', {
      validUser:true,
      pageTitle:'Home Page',
      welcomeMessage: 'Welcome, ' + req.session.userid,
    });
  } else {
    res.redirect('/')
  }
})

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle:'About Page',
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle:'Projects',
  });
});

app.get('/api', (req, res) => {
  res.render('api.hbs', {
    pageTitle:'API',
  });
});

app.post('/logout',(req,res) => {
    req.session.destroy(); // session is ended; cookies on client-side are deleted
    res.redirect('/');
});

app.listen(port, () => {
  console.log('Listening on port ' + port + '.');
});
