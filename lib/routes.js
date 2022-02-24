const fs = require('fs');


module.exports = (app) => {

    // processHome
    app.get('/', function(req, res) {

        session = req.session;

        if (session) {
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

    })


    app.get('/about', function(req, res) {

        session = req.session;

        console.log(session)

        res.render('about.hbs', {
          pageTitle:'About Page',
          username:session.userid,
        });

    })

/*  CURRENTLY DEFUNCT -- WILL FIX

    app.handleUserPage = function(req, res)  {

        session = req.session;

        res.render('user.hbs', {
          pageTitle:'User\'s Homepage',
          username:session.userid,
        });
    }
*/


    // handleWordgame
    app.get('/wordgame', function(req, res) {

        session = req.sesssion;

        console.log(session)

        res.render('wordgame.hbs')

    })

    // handleSignupPage
    app.post('/signup-user', function(req, res) {

        session = req.session;

        res.render('signup.hbs', {
          pageTitle:'Signup Here',
          username:session.userid,
        });

    })

    //handleLogout
    app.post('/logout', function(req,res) {

      req.session.destroy(); // session is ended; cookies on client-side are deleted
      res.redirect('/');

    })

      ///****  methods for handling login, logout, signup ****///


    // method for handling login attempts; user can log in or get rejected.
    //processLogin
    app.post('/process-login', function(req, res) {

        console.log(req.body)

        let username = req.body.username;
        let password = req.body.password;

        let users = fs.readFileSync('./lib/users.json', 'utf8');
        users = JSON.parse(users);

        console.log(users)

        users = users.filter(user => user.userName === username);

        // NOTE: by this point users.length should be 1 or 0

        // VERY FIRST: check if no username exists
        if (users.length === 0) {
          return res.render('home.hbs', {
            // username:req.session.userid,
            pageTitle:'Let\'s Play Some Games',
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
            pageTitle:'Let\'s Play Some Games',
            welcomeMessage: 'Welcome, ' + session.userid,
          });
        }

        // IF NOT ADMIN: look up username, see if user exists
        if (users[0].userName === username) {

          console.log(users)

          // IF USER EXISTS: look up password
          if (users[0].password === password) {

            session = req.session;
            session.userid = username;

            return res.render('home.hbs', {
              username:session.userid,
              pageTitle:'Let\'s Play Some Games',
            });
          } else {
            return res.render('home.hbs', {
              pageTitle: 'Let\'s Play Some Games',
              loginErrorMsg: 'Password is incorrect.',
            });
          }

        }

    })

    // method for handling signup attempts, wherein a username/pswd
    // combination is submitted and analyzed by handler.
    app.signupUser = function(req, res) {
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

    //app.post('/saveWordgameState/:user', handlers.saveWordgameState)

    //app.get('/stats/:user, handlers.getUserStats')

}
