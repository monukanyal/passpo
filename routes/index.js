const express = require('express');
const passport = require('passport');
const router = express.Router();
/* GET home page. */

router.get('/', function (req, res) {

      //console.log('flash'+req.flash('error'));
      res.render('login',{message:req.flash('error')});
});

router.post('/login',passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/', failureFlash: 'Login failed',successFlash: 'Welcome!'  }));
 
/*
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', passport.authenticate('local', {
  clientID: env.AUTH0_CLIENT_ID,
  domain: env.AUTH0_DOMAIN,
  redirectUri: env.AUTH0_CALLBACK_URL,
  responseType: 'code',
  audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
  scope: 'openid profile'}),
  function(req, res) {
    res.redirect("/");
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/user');
  }
);

router.get('/failure', function(req, res) {
  var error = req.flash("error");
  var error_description = req.flash("error_description");
  req.logout();
  res.render('failure', {
    error: error[0],
    error_description: error_description[0],
  });
});

*/

module.exports = router;
