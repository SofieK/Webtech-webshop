var mongoose = require('mongoose');

module.exports = mongoose.model('Product',{
	id: String,
	Name: String,
	Type: String,
	Option: String,
	Price: Number,
	Picture: String,
	Description: String
});