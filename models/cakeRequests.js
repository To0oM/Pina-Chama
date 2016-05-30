var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cakeRequestsSchema = new Schema({
	cakeDate: Date,
	cake: String,
	comments: String,
	applicantName: String,
	applicantPhoneNumber: String,
	requestDate: Date
});

mongoose.model('cakeRequests', cakeRequestsSchema);
