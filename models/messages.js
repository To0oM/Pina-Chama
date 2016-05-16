var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messagesSchema = new Schema({
	content: String,
	topic: String,
	messageToVolunteers: Boolean,
	messageToBakers: Boolean,
	messageToBakery: Boolean,
	messageToGuests: Boolean,
	messageToString: String,
	category: String,
	publicationDate: Date
});

mongoose.model('messages', messagesSchema);
