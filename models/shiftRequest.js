var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shiftRequestsSchema = new Schema({
	shiftDay: String,
	shiftTime: String,
	comments: String,
	applicantName: String,
	applicantPhoneNumber: String,
	requestDate: Date
});

mongoose.model('shiftRequests', shiftRequestsSchema);
