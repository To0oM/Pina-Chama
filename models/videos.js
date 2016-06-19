var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var videosSchema = new Schema({
	vidName: String,
	fileName: String,
	mp4FileName: String,
	webmFileName: String,
	intendeToVolunteers: Boolean,
	intendeToBakery: Boolean
});

mongoose.model('videos', videosSchema);
