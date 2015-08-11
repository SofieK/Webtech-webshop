var mongoose = require('mongoose');

module.exports = mongoose.model('Product',{
	id: String,
	Name: String,
	Price: Number,
	Picture: String,
	Description: String
});