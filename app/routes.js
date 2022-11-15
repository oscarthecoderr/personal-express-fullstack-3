const { ObjectID } = require("mongodb").ObjectId;

module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      let dogs =[
        {
          src:"https://i.ytimg.com/vi/MPV2METPeJU/maxresdefault.jpg",
          name: "Curious Dogo",
          description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos, magnam id iste vel ut cupiditate illum eius maxime laudantium accusamus aliquid eveniet debitis at corrupti quisquam doloribus minus consectetur deserunt!"
        },
        {
          src:"https://static01.nyt.com/images/2019/06/17/science/17DOGS/17DOGS-facebookJumbo.jpg",
          name: "Sweet Dogo",
          description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos, magnam id iste vel ut cupiditate illum eius maxime laudantium accusamus aliquid eveniet debitis at corrupti quisquam doloribus minus consectetur deserunt!"
        },
        {
          src:"https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/HB4AT3D3IMI6TMPTWIZ74WAR54.jpg",
          name: "Happy Dogo",
          description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos, magnam id iste vel ut cupiditate illum eius maxime laudantium accusamus aliquid eveniet debitis at corrupti quisquam doloribus minus consectetur deserunt!"
        },
        {
          src:"https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2016/05/19091354/Weimaraner-puppy-outdoors-with-bright-blue-eyes.20190813165758508-1.jpg",
          name: "Blue Eye Dogo",
          description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos, magnam id iste vel ut cupiditate illum eius maxime laudantium accusamus aliquid eveniet debitis at corrupti quisquam doloribus minus consectetur deserunt!"
        },
        {
          src:"https://www.sciencenewsforstudents.org/wp-content/uploads/2020/03/1030_conservationdog-1028x579.png",
          name: "Working Dogo",
          description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos, magnam id iste vel ut cupiditate illum eius maxime laudantium accusamus aliquid eveniet debitis at corrupti quisquam doloribus minus consectetur deserunt!"
        },
        {
          src:"https://images.ctfassets.net/cnu0m8re1exe/1oxM7W0NZuecyG9dzwHMMC/5e25719d2118739f6c63542f48b55022/shutterstock_1235974405.jpg",
          name: "Dreamy Dogo",
          description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos, magnam id iste vel ut cupiditate illum eius maxime laudantium accusamus aliquid eveniet debitis at corrupti quisquam doloribus minus consectetur deserunt!"
        },
        {
          src:"https://www.aspca.org/sites/default/files/problems-older-dog_main.jpg",
          name: "Lazy Dogo",
          description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos, magnam id iste vel ut cupiditate illum eius maxime laudantium accusamus aliquid eveniet debitis at corrupti quisquam doloribus minus consectetur deserunt!"
        },
        {
          src:"https://s3.amazonaws.com/p2p-pet-images/cms/photos/82-Do-dogs-get-tired-of-barking.jpg",
          name: "Nosey Dogo",
          description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos, magnam id iste vel ut cupiditate illum eius maxime laudantium accusamus aliquid eveniet debitis at corrupti quisquam doloribus minus consectetur deserunt!"
        },

      ]
      console.log(dogs)
        db.collection('adoption').find({email:req.user.local.email}).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            favorites: result,
            dogs:dogs
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res, next) {
        req.logout(function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
      });

// message board routes ===============================================================

    app.post('/adopt', (req, res) => {
      db.collection('adoption').save({name: req.body.name,description:req.body.description, email:req.user.local.email, adopted:false, }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        //res.redirect('/profile')
        res.redirect(req.get('referer'));
      })
    })

    app.put('/adopt', (req, res) => {
      db.collection('adoption')
      .findOneAndUpdate({_id: ObjectID(req.body._id)}, {
        $set: {
          adopted:true
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.put('/thumbDown', (req, res) => {
      db.collection('messages')
      .findOneAndUpdate({_id: ObjectID(req.body._id)}, {
        $inc: {
          thumbDown: 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })


    app.delete('/delete', (req, res) => {
      console.log(req.body)
      db.collection('adoption').findOneAndDelete({_id: ObjectID(req.body._id)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
