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
  // res.type('text/plain')
  res.render('home.hbs', {
    pageTitle:'Home Page',
    welcomeMessage:'Welcome to my Website',
  });
  // console.log(req.headers)
  // console.log(req.accepts)
  // console.log(req.ip)
  // console.log(req.path)
  // console.log(req.hostname)
  // console.log(req.xhr)
  // console.log(req.protocol)
  // console.log(req.secure)
  // console.log(req.url)
  // console.log(req.body)
});

app.post('/process-login', (req, res) => {
  console.log(req.body);
})

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle:'About Page',
  });
});

app.get('/form', (req, res) => {
  res.render('form.hbs', {
    pageTitle:'Test Form',
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle:'Projects',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage:'unable to handle request'
  });
});

app.listen(port, () => {
  console.log('Listening on port ' + port + '.');
});
