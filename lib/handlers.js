const fs = require('fs');


///****  methods for handling login, logout, signup ****///

exports.processLogin = function(req, res) {

  let username = req.body.username;
  let password = req.body.password;

  let users = fs.readFileSync('./lib/users.json', 'utf8');
  users = JSON.parse(users);

  users = users.filter(user => user.userName === username);

  // NOTE: by this point users.length should be 1 or 0

  // VERY FIRST: check if no username exists
  if (users.length === 0) {
    return res.render('home.hbs', {
      // username:req.session.userid,
      pageTitle:'Home Page',
      welcomeMessage: 'Welcome to my website.',
      loginErrorMsg: 'No such username exists.',
    });
  }

  // check if login attempt is done by ADMIN
  if (users[0].username === 'admin' && users[0].password === password) {
    session = req.session;
    session.userid = username;
    return res.render('home.hbs', {
      username:req.session.userid,
      pageTitle:'Home Page',
      welcomeMessage: 'Welcome, ' + session.userid,
    });
  }

  // IF NOT ADMIN: look up username, see if user exists
  if (users[0].userName === username) {

    // IF USER EXISTS: look up password
    if (users[0].password === password) {
      session = req.session;
      session.userid = username;
      return res.render('home.hbs', {
        username:session.userid,
        pageTitle:'Home Page',
        welcomeMessage: 'Welcome to my website.',
      });
    } else {
      return res.render('home.hbs', {
        pageTitle:'Home Page',
        welcomeMessage: 'Welcome to my website.',
        loginErrorMsg: 'Password is incorrect.',
      });
    }
  }
}


// method for handling signup attempts, wherein a username/pswd
// combination is submitted:
exports.signupUser = function(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  console.log(req.session)

  if (username === "" || password === "") {
    return res.render('signup.hbs', {
      pageTitle:'Signup Here',
      signupMsg:'You did not enter either a password or username.',
      signupWarningClass:"signupWarning",
    })
  }

  // STEP 1 - validate password

  // STEP 2 - check if username already exists

  // if username/pswd is OK, check if there are too many users (say, 30)

  // STEP 3 - fetch users array, append user to it,

  let users = fs.readFileSync('./lib/users.json', 'utf8');
  users = JSON.parse(users);

  let userArray = users.filter(user => user.userName === username);

  console.log(users);


  // make sure the user name doesn't exist:
  if (userArray.length > 0) {
    return res.render('signup.hbs', {
      pageTitle:'Signup Here',
      signupMsg:'User with that user name already exists.',
      signupWarningClass:"signupWarning",
    })
  } else {
    let newUser = {};
    newUser.userName = username;
    newUser.password = password;

    users.push(newUser);
    users = JSON.stringify(users);
    fs.writeFileSync('./lib/users.json', users);

    session = req.session;
    session.userid = username;

    return res.render('home.hbs', {
      username:session.userid,
      pageTitle:'Home Page',
      welcomeMessage: 'Welcome to my website.',
    });
  }

  // res.redirect('/');
}
