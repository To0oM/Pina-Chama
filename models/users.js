var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
	googleId: String,
	id: Number,
	firstName: String,
	lastName: String,
	userType: String,
	dateOfBirth: Date,
	phoneNumber: String,
	address: String,
	email: String,
	volunteerStartDate: Date,
	comments: String,
	active: String,
	permanent: String,
	team: String,
	dateOfVisit: Date
});

mongoose.model('users', usersSchema);
