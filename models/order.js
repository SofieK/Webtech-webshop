var mongoose = require('mongoose');

module.exports = mongoose.model('Order',{
	id: String,
	user: String,
	order: Array,
	total: Number,
	status: {type: String, default: "Awaiting shipment"}
});