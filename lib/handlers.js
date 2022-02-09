exports.addUser = function(username, password) {

}


exports.getUser = function(username) {

}



///****  methods for handling login, logout, signup ****///

exports.processLogin = function(req, res) {

  let username = req.body.username;
  let password = req.body.password;

  let users = fs.readFileSync('./lib/users.json', 'utf8');
  users = JSON.parse(users);

  users = users.filter(user => user.username === username);

  // NOTE: by this point users.length should be 1 or 0

  // VERY FIRST: check if no username exists
  if (users.length === 0) {
    res.render('home.hbs', {
      // username:req.session.userid,
      pageTitle:'Home Page',
      welcomeMessage: 'No such username exists.',
    });
  }

  // check if login attempt is done by ADMIN
  if (users[0].username === 'admin' && users[0].password === 'pswd') {
    session = req.session;
    session.userid = username;
    res.render('home.hbs', {
      // username:req.session.userid,
      pageTitle:'Home Page',
      welcomeMessage: 'Welcome, ' + session.userid,
    });
  }

  // IF NOT ADMIN: look up username, see if user exists
  if (users[0].username === username) {

    // IF USER EXISTS: look up password
    if (users[0].password === password) {
      session = req.session;
      session.userid = username;
      res.render('home.hbs', {
        username:session.userid,
        pageTitle:'Home Page',
        welcomeMessage: 'Welcome, ' + session.userid,
      });
    } else {
      res.render('home.hbs', {
        // username:session.userid,
        pageTitle:'Home Page',
        welcomeMessage: 'Welcome, ' + session.userid,
    }
  }

  // IF USER EXISTS: look up password, see if they sync

}

exports.signupUser = function(req, res) {
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

  res.redirect('/');)
}
