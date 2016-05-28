var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shiftsSchema = new Schema({
	shiftDay: String,
	shiftTime: String,
	volunteer1Name: String,
	volunteer2Name: String
});

mongoose.model('shifts', shiftsSchema);
