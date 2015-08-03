var express = require('express');
var router = express.Router();


var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}


module.exports = function(passport){

// PASSPORT 

	/* GET Login Page */
	router.get('/login', function(req, res){
		res.render('login', {message: req.flash('message')});
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});





// REGULAR PAGES

	/* GET Home page. */
	router.get('/', function(req, res) {
		res.render('index');

	});

	/* GET account Page */	
	router.get('/account', isAuthenticated, function(req, res){
		res.render('account', { user: req.user });
	});

	/* GET addproduct Page */	
	router.get('/addproduct', isAuthenticated, function(req, res){
		res.render('addproduct', { user: req.user });
	});


	return router;

}