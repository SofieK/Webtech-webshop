var express = require('express');
var router = express.Router();

var multer = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.slice(file.mimetype.indexOf('/')+1))
	}
});
var upload = multer({ storage: storage }).single('image');

var User = require('./../models/user');
var Product = require('./../models/product');
var Order = require('./../models/order');


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


	Product.find().exec(function(err, products) {
		var p = products;

		if(req.user){
			var b = {products: p, user : req.user};
		}else{
			var b = {products: p}
		}
			//console.log(b);
			res.render('index', b);
		});
});

/* GET account Page */	
router.get('/account', isAuthenticated, function(req, res){
	res.render('account', { user: req.user });
});

/* GET addproduct Page */	
router.get('/addproduct', isAuthenticated, function(req, res){
	res.render('addproduct', { user: req.user });
});

router.post('/upload', upload, function(req, res){
	console.log(req.body);
	console.log("size = "+req.body.size);
	var option = "One";
	var new_product_data = {Name : req.body.title, Type: req.body.type, Option: option, Price : req.body.price, Picture : req.file.filename, Description :  req.body.description};
	Product.create(new_product_data, function(err, b){});
	res.redirect('/');
});

router.get('/product/:key', function(req, res){
		//console.log(req.params.key);
		product_id = req.params.key;

		Product.findById( product_id, function(err, item){
			productdetail = item;

			if(req.user){
				var i = {product: productdetail, user : req.user};
			}else{
				var i = {product: productdetail}
			}

			res.render('productdetail', i);
		})

	});


router.post('/cart', function(req, res){
	var cart_user = req.user._id;

	var cart_product = {"product_id": req.body.product_id, "amount": req.body.amount};
	console.log(req.body);

	User.findByIdAndUpdate(cart_user, {$push: {"cart": cart_product}}, {safe: true, upsert: true}, function(err, b){
				//console.log('updated:' + b);
				//var added = true;
				res.redirect('cart')
			})
});

router.get('/cart', function(req, res){
	
	if (req.user){
		var cart_array = req.user.cart;
		var cart_length = cart_array.length;
		var array_id = [];
		var cart = [];
		var ii=0;
		for(var i=0; i<cart_length; i++){

			array_id[i] = cart_array[i].amount;

			Product.findById(cart_array[i].product_id, function(err, result){
				cart.push(result);


				ii++;

				if(ii == cart_length){
					//console.log(array_id);
					var cartdata = { "cart": cart, "amount": array_id, user : req.user};
					//console.log('CARTDATA ='+cartdata);
					res.render('cart', cartdata );
				}

				
			})

		};


	}else{
		res.render('cart');
	}


});


router.post('/order', isAuthenticated, function(req, res){
	
	User.findByIdAndUpdate(req.user._id, {"cart" : []}, function(err, b){
		//console.log('update'+b);
	});
	res.redirect('order')

});

router.get('/order', isAuthenticated, function(req, res){

	if(req.user.admin == 1){
		Order.find(function(err, b) {
		 // console.log(b);
		  res.render('orders', { user: req.user, orders: b });
		})
	} else if(req.user.admin == 0){
		Order.find({user: req.user._id}, function(err, b) {
		  //console.log(b);
		  res.render('orders', { user: req.user, orders: b });
		})
	}

	
});


router.get('/order/:key', isAuthenticated, function(req, res){
		//console.log(req.params.key);
		var order_id = req.params.key;

		Order.findById( order_id, function(err, b){
			var orderdetail = b;
			var order = b.order;
			var items = [];
			var order_length = order.length;
			var ii = 0; 
			for (var i = 0; i < order.length; i++) {
				Product.findById(order[i].product_id, function(err, d){
					items.push(d);
					ii++;

					if(ii == order_length){
						//console.log(array_id);
						var order_data = {orders: items, orderdetail: orderdetail, user : req.user};
						//console.log('order_data ='+order_data.orderdetail);
						res.render('orderdetail', order_data );
					}
				})
			};
			
		})

	});


return router;

}