const fs = require('fs');

//const main = require('handlers');

module.exports = (app) => {



    // handleHomePage
    app.get('/', function(req, res) {

        let session = req.session;

        if (session.userid) {
          console.log(session.userid + ' is visiting the home page.')
        }

        if (session.userid) {
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




    // handleUserPage
    app.get('/about', function(req, res) {

        let session = req.session;

        if (session.userid) {
          console.log(session.userid + " is visiting the about page.")
        }

        res.render('about.hbs', {
          pageTitle:'About Page',
          username:session.userid,
        });

    })




    // handleUserPage
    app.get('/user', function(req, res) {

        let session = req.session;

        res.render('user.hbs', {
          pageTitle:'user page for ' + session.userid,
          username:session.userid,
        });

    })




    // handleAdminPage
    app.get('/admin', function(req, res) {

        let session = req.session;

        res.render('user.hbs', {
          pageTitle:'admin page',
          username:session.userid,
        });

    })





    // handleWordgame
    app.get('/wordgame', function(req, res) {

        let session = req.session;

        if (session.userid) {
          console.log(session.userid + " is now playing the word game.")
        }

        res.render('wordgame.hbs')

    })





    // handleSignupPage
    app.get('/signup', function(req, res) {

        let session = req.session;

        res.render('signup.hbs', {
            pageTitle:'Signup Here',
            username:session.userid,
        });

    })




    //handleLogout
    app.post('/logout', function(req,res) {

      let session = req.session;

      console.log(session.userid + " is logging out.")

      req.session.destroy(); // session is ended; cookies on client-side are deleted
      res.redirect('/');

    })




    ///****  methods for handling login, logout, signup ****///




    // method for handling login attempts; user can log in or get rejected.
    // processLogin
    app.post('/process-login', function(req, res) {

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
            pageTitle:'Let\'s Play Some Games',
            welcomeMessage: 'Welcome to my website.',
            loginErrorMsg: 'No such username exists.',
          });
        }

        // check if login attempt is done by ADMIN
        if (users[0].username === 'admin' && users[0].password === password) {
            let session = req.session;
            session.userid = 'admin';

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

            let session = req.session;
            session.userid = username;

            console.log(session.userid + " has logged in.")

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



    // processSignupUser
    app.post('/signup-user', function(req, res) {

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
      })



    // saveWordgameResult
    app.post('/saveWordgameResult', function(req, res) {

        // write object data to guessed.json or unguessed.json, depending if
        // the word was guessed correctly or not; the sets of guessed and
        // unguessed words will be rendered to either home page or wordgame
        // at some point...

        let objectData = req.body;

        let session = req.session;

        console.log(objectData);

        let word = req.body.word;
        let victory = req.body.guessesLeft > 0 ? true : false ;


        console.log(word)
        console.log(victory)


        if (victory) {

            // keep track of the last 20 guessed words

            let gamesWon = fs.readFileSync('./lib/wordgame/guessed.json', 'utf8');
            gamesWon = JSON.parse(gamesWon)

            if (gamesWon.length < 20) {

                gamesWon.unshift({ word: word,
                    user: session ? session.userid : 'unknown player' })


                gamesWon = JSON.stringify(gamesWon);

                fs.writeFileSync('./lib/wordgame/guessed.json', gamesWon)


            } else {

                gamesWon.pop();

                gamesWon.unshift({ word: word,
                        user: session ? session.userid : 'unknown player' })

                gamesWon = JSON.stringify(gamesWon);

                fs.writeFileSync('./lib/wordgame/guessed.json', gamesWon)

            }

        } else {

            let gamesLost = fs.readFileSync('./lib/wordgame/unguessed.json', 'utf8');
            gamesLost = JSON.parse(gamesLost)

            if (gamesLost.length < 20) {

                gamesLost.unshift({ word: word,
                    user: session ? session.userid : 'unknown player' })


                gamesLost = JSON.stringify(gamesLost);

                fs.writeFileSync('./lib/wordgame/unguessed.json', gamesLost)


            } else {

                gamesLost.pop();
                gamesLost.unshift({ word: word,
                    user: session ? session.userid : 'unknown player' })


                gamesLost = JSON.stringify(gamesLost);

                fs.writeFileSync('./lib/wordgame/unguessed.json', gamesLost)

            }

        }

        res.sendStatus(200);

    })





    // app.get('/stats/:user, handlers.getUserStats')

}
