// server.js
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');
// const ws = require('ws');
// const morgan = require('morgan');

// no arguments needed to pass to express:
var app = express('view engine', 'hbs');
var port = process.env.PORT || 8080;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }))

/*
app.use((req, res, next) => {
  res.render('maintenance.hbs');
});
*/

// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

app.get('/', (req, res) => {
  res.status(200);
  res.render('home.hbs', {
    pageTitle:'Home Page',
    welcomeMessage:'Welcome to my Website',
  });
});

app.post('/process-login', (req, res) => {
  console.log(req.body);
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

app.listen(port, () => {
  console.log('Listening on port ' + port + '.');
});
