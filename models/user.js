var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	username: String,
	password: String,
	firstname: String,
	street: String,
	housenr: Number,
	city: String,
	country: String,
	admin: {type: Boolean, default: 0},
	cart: {type: Array, default: []}
});