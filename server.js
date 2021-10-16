// server.js
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
// const bodyParser = require('body-parser');
// const morgan = require('morgan');

// no arguments needed to pass to express:
var app = express('view engine', 'hbs');
var port = process.env.PORT || 8080;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

/** Logging all http requests and their details: */
app.use((req, res, next) =>{
  let now = new Date().toString();
  let log = now + '\n';
  log += '\t' + 'Method: ' + req.method + '\n' + '\t' + 'Path: ' + req.path;
  log += '\n' + '\t' + 'Cookies: ' + req.cookies;

  // console.log('\t', 'IP:', req.ip);
  // console.log('\t', 'Hostname:', req.hostname);

  // fs.appendFile('server.log', log + '\n', err => {
  //   if (err) {
  //     console.log('ERROR: could not append log onto server.log.');
  //   }
  // });

  console.log(log);
  next();
});

// the following middleware goes right to the 'under maintenance' page.
// next() is not called, and so all following middleware is ignored and
// maintenance.hbs is the only page that ever pops up:
// (static files in /public are still available through direct access,
//  because that middleware is executed first)
/*
app.use((req, res, next) => {
  res.render('maintenance.hbs');
});
*/

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle:'Home Page',
    welcomeMessage:'Welcome to my Website',
  });
  /*
  res.send({
    name:'john',
    pets:['spot', 'fido']
  });
  */
});

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

app.get('/bad', (req, res) => {
  res.send({
    errorMessage:'unable to handle request'
  });
});

app.listen(port, () => {
  console.log('Listening on port ' + port + '.');
});
