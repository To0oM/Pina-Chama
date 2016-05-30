var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cakesSchema = new Schema({
	cakeDate: Date,
	cake: String,
	bakersNames: String
});

mongoose.model('cakes', cakesSchema);
