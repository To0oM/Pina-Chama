var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var outofstocksSchema = new Schema({
	category: String,
	product: String,
	quantity: Number,
	comments: String,
	details: String,
	groupType: String
});

mongoose.model('outofstocks', outofstocksSchema);

