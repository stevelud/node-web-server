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

app.post('/process-login', (req, res) => {

  // FIRST: check if login attempt is done by ADMIN:
  if (req.body.username === 'admin' && req.body.password === 'pswd') {
    session = req.session;
    session.userid = req.body.username;
    res.render('home.hbs', {
      username:req.session.userid,
      pageTitle:'Home Page',
      welcomeMessage: 'Welcome, ' + req.session.userid,
    });
  } else {
    res.redirect('/')
  }

})

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

app.post('/signup-user', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  // STEP 1 - validate password

  // STEP 2 - check if username already exists

  // STEP 3 - fetch users array, append user to it,

  let arr;
  let newUser = {};

  let users = fs.readFileSync('./lib/users.json', 'utf8');
  users = JSON.parse(users);
  console.log(users)

  newUser.userName = username;
  newUser.password = password;

  users.push(newUser);
  users = JSON.stringify(users)
  fs.writeFileSync('./lib/users.json', users)

  console.log(users)

  res.redirect('/');
})

app.listen(port, () => {
  console.log('Listening on port ' + port + '.');
});
