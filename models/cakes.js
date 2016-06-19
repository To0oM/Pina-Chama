var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cakesSchema = new Schema({
	cakeDay: String,
	cake: String,
	bakerName: String
});

mongoose.model('cakes', cakesSchema);
