const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {

	 res.render('dashboard'	,{message:req.flash('success'),email:req.session.passport.user[0]._id});
	
});


module.exports = router;
