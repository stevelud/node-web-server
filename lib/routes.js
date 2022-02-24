const fs = require('fs');
//const https = require('https');


exports.handleHomePage = function(req, res) {

  session = req.session;

  if (req.session.userid) {
    res.render('home.hbs', {
      username:session.userid,
      validUser:true,
      pageTitle:'Let\'s Play Some Games',
      welcomeMessage: "",
    });
  } else {
    res.render('home.hbs', {
      pageTitle:'Let\'s Play Some Games',
      welcomeMessage: "",
    });
  }
}


exports.handleAboutPage = function(req, res) {

  session = req.session;

  res.render('about.hbs', {
    pageTitle:'About Page',
    username:session.userid,
  });
}


exports.handleUserPage = function(req, res)  {

  session = req.session;

  res.render('user.hbs', {
    pageTitle:'User\'s Homepage',
    username:session.userid,
  });
}


exports.handleWordgamePage = function(req, res) {

  session = req.sesssion;

  res.render('wordgame.hbs', {
    pageTitle:'word game',
  })
}


exports.handleSignupPage = function(req, res) {

  session = req.session;

  res.render('signup.hbs', {
    pageTitle:'Signup Here',
    username:session.userid,
  });
}


exports.handleLogout = function(req,res) {
    req.session.destroy(); // session is ended; cookies on client-side are deleted
    res.redirect('/');
}

///****  methods for handling login, logout, signup ****///

// method for handling login attempts; user can log in or get rejected.
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
// combination is submitted and analyzed by handler.
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


  // if there are ten or more users (how could there be more than 10?),
  // then signup is not possible
  if (users.length >= 10) {
    return res.render('signup.hbs', {
      pageTitle:'Signup Here',
      signupMsg:'ADMIN: There are too many users on this site. ' +
        'Registration is not permitted',
      signupWarningClass:"signupWarning",
    })
  }


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