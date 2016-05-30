var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
	content: String,
	topic: String,
	publicationDate: Date,
	publishName: String,
	pageNum: Number
});

mongoose.model('posts', postsSchema);