// server.js
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
// const ws = require('ws');
// const morgan = require('morgan');
const expressSession = require('express-session')
const cookieParser = require('cookie-parser')
const routes = require('./lib/routes.js')

// no arguments needed to pass to express:
var app = express('view engine', 'hbs');
var port = process.env.PORT || 8080;


app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'));



// cookie middleware should come before session middleware
app.use(cookieParser());

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(expressSession({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

routes(app);

// HANDLEBARS **********************************************//

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

app.set('view engine', 'hbs');

//**********************************************************//


app.listen(port, () => {
  console.log('Listening on port ' + port + '.');
});
