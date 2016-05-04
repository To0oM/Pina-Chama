var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var outofstocksSchema = new Schema({
	category: String,
	product: String,
	quantity: Number,
	comments: String,
	name: String,
	phoneNumber: String,
	dateAndTime: Date,
});

mongoose.model('outofstocks', outofstocksSchema);
