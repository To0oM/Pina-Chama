var express = require('express'); //for routing
var path = require('path');       //to get the absolute path
var mongoose = require('mongoose');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();              //init the server

var DB_URL = process.env.MONGODB_URL || 'mongodb://localhost/mLabMongoDB-g';
var port = process.env.PORT || 8080;


app.use(express.static(__dirname + '/Pina-Chama'));
app.use(bodyParser.json());

app.use('/bakers', express.static('Pina-Chama/bakers'));
app.use('/bakery', express.static('Pina-Chama/bakery'));
app.use('/css', express.static('Pina-Chama/css'));
app.use('/guests', express.static('Pina-Chama/guests'));
app.use('/img', express.static('Pina-Chama/img'));
app.use('/js', express.static('Pina-Chama/js'));
app.use('/managers', express.static('Pina-Chama/managers'));
app.use('/volunteers', express.static('Pina-Chama/volunteers'));

mongoose.connect(DB_URL);

var db = mongoose.connection;

db.on('error', function (err) {
	console.log('connection error', err);
});
db.once('open', function () {
	console.log('connected to the database');
});

//load all files in models directory
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
	if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

//return an html (web page) or other files
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + "/Pina-Chama/home.html"));
});

var Users = mongoose.model('users');
var OutOfStocks = mongoose.model('outofstocks');
var Messages = mongoose.model('messages');
var ShiftRequests = mongoose.model('shiftRequests');
var Shifts = mongoose.model('shifts');

app.post('/register', function (req, res) {
	var id = (req.body.id === undefined)? 0: req.body.id;
	var comments = (req.body.comments === undefined)? 'אין הערות': req.body.comments;
	var team = (req.body.team === undefined)? 'ללא קבוצה': req.body.team;
	var address = req.body.addStreet + ' ' + req.body.addApartment + ', ' + req.body.addCity;
	if (req.body.addPostalCode !== undefined){
		address += ' (' + req.body.addPostalCode + ')';
	}
	
	new Users({
		googleId: req.body.googleId,
		id: id,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		userType: req.body.userType,
		dateOfBirth: req.body.dateOfBirth,
		phoneNumber: req.body.phoneNumber,
		address: address,
		email: req.body.email,
		volunteerStartDate: req.body.volunteerStartDate,
		comments: comments,
		active: 'פעיל',
		permanent: req.body.permanent,
		team: team,
		dateOfVisit: req.body.dateOfVisit
	}).save(function (err){
		if (err){
			console.log(err);
		}else{
		   res.json('saved!');
		}
	});
});

app.get('/refresh', function(req, res) {
	res.json('refresh');
});

app.get('/managersDB', function(req, res) {
	Users.find({userType : 'manager'}, function(err, users) {
		if (err)
			throw err;
		
		// object of the user
		res.json(users);
	});
});

app.get('/volunteersDB', function(req, res) {
	Users.find({userType : 'volunteer'}, function(err, users) {
		if (err)
			throw err;
		
		// object of the user
		res.json(users);
	});
});

app.get('/guestsDB', function(req, res) {
	Users.find({userType : 'guest'}, function(err, users) {
		if (err)
			throw err;
		
		// object of the user
		res.json(users);
	});
});

app.get('/bakeryDB', function(req, res) {
	Users.find({userType : 'bakery'}, function(err, users) {
		if (err)
			throw err;
		
		// object of the user
		res.json(users);
	});
});

app.get('/bakersDB', function(req, res) {
	Users.find({userType : 'baker'}, function(err, users) {
		if (err)
			throw err;
		
		// object of the user
		res.json(users);
	});
});

app.put('/register/:id/:email', function (req, res) {
	var id = req.params.id;
	var email = req.params.email;
	
	Users.findOne({ 'googleId': id }, 'firstName lastName', function (err, users) {
		if (err)
			return handleError(err);
		
		res.json(users);
	})
});

app.put('/register/:id', function (req, res) {
	var id = req.params.id;
	
	console.log("body.id: " + req.body.userId);
	console.log("params.id: " + id);
	
	Users.findOne({ 'googleId': id }, 'firstName lastName userType', function (err, users) {
		if (err)
			return handleError(err);
		
		res.json(users);
	})
});

//save out of stock in db
app.post('/stock', function (req, res) {
	var comments = (req.body.comments === undefined || req.body.comments === '')? 'אין הערות': req.body.comments;
	
	var d = new Date();
	var date = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	var date = date + "/" + month + "/" + year;
	var minutes = d.getMinutes();
	if(minutes < 10)
		minutes = '0'+minutes;
	var time = d.getHours()+3 + ":" + minutes + ":" + d.getSeconds(); 
	
	var phoneNumber = (req.body.phoneNumber === undefined)? '' : ('טלפון: ' + req.body.phoneNumber + "\n") ;
	var name = (req.body.name === undefined)? '' : ('שם: ' + req.body.name + "\n") ;
	var details =  name +
				   phoneNumber +
				  'תאריך: ' + date + "\n" +
				  'שעה: ' + time;
				   
	var category;
	switch(req.body.category)
	{
		case 'basicProducts':
			category = 'מוצרי יסוד';
			break;
		case 'detergents':
			category = 'חומרי ניקוי';
			break;
		case 'disposableDishes':
			category = 'כלים חד פעמיים';
			break;
		case 'bakingProducts':
			category = 'מוצרי אפיה';
			break;
		case 'falafel':
			category = 'פלאפל';
			break;
		case 'other':
			category = 'שונות';
			break;
	}
	
	new OutOfStocks({
		category: category,
		product: req.body.product,
		quantity: req.body.quantity,
		comments: comments,
		details: details,
		groupType: req.body.groupType,
		isBought: false,
		name: req.body.name,
		phoneNumber: req.body.phoneNumber
	}).save(function (err){
		if (err){
			console.log(err);
		}else{
		   res.json('saved!');
		}
	});
});

//get all messages in db.
app.get('/messages', function(req, res) {
	Messages.find({category : 'message'}, function(err, messages) {
		if (err)
			throw err;
		res.json(messages);
	});
});

//get all posts in db.
app.get('/posts', function(req, res) {
	Messages.find({category : 'posts'}, function(err, posts) {
		if (err)
			throw err;
		res.json(posts);
	});
});

//get all bakers's messages in db.
app.get('/bakersMessages', function(req, res) {
	Messages.find({category : 'message', messageToBakers : true}, function(err, messages) {
		if (err)
			throw err;
		res.json(messages);
	});
});

//get all bakers's posts in db.
app.get('/bakersPosts', function(req, res) {
	Messages.find({category : 'posts', messageToBakers : true}, function(err, posts) {
		if (err)
			throw err;
		res.json(posts);
	});
});

//get all bakery's messages in db.
app.get('/bakeryMessages', function(req, res) {
	Messages.find({category : 'message', messageToBakery : true}, function(err, messages) {
		if (err)
			throw err;
		res.json(messages);
	});
});

//get all bakery's posts in db.
app.get('/bakeryPosts', function(req, res) {
	Messages.find({category : 'posts', messageToBakery : true}, function(err, posts) {
		if (err)
			throw err;
		res.json(posts);
	});
});

//get all guests's messages in db.
app.get('/guestsMessages', function(req, res) {
	Messages.find({category : 'message', messageToGuests : true}, function(err, messages) {
		if (err)
			throw err;
		res.json(messages);
	});
});

//get all guests's posts in db.
app.get('/guestsPosts', function(req, res) {
	Messages.find({category : 'posts', messageToGuests : true}, function(err, posts) {
		if (err)
			throw err;
		res.json(posts);
	});
});

//get all volunteers's messages in db.
app.get('/volunteersMessages', function(req, res) {
	Messages.find({category : 'message', messageToVolunteers : true}, function(err, messages) {
		if (err)
			throw err;
		res.json(messages);
	});
});

//get all volunteers's posts in db.
app.get('/volunteersPosts', function(req, res) {
	Messages.find({category : 'posts', messageToVolunteers : true}, function(err, posts) {
		if (err)
			throw err;
		res.json(posts);
	});
});

//find out of stock in db
app.get('/stockPina', function(req, res) {
	OutOfStocks.find({groupType : 'pina'}, function(err, stocks) {
		if (err)
			throw err;
		console.log(OutOfStocks);
		res.json(stocks);
	});
});

app.get('/stockBakery', function(req, res) {
	OutOfStocks.find({groupType : 'bakery'}, function(err, stocks) {
		if (err)
			throw err;
		
		res.json(stocks);
	});
});

app.get('/stockFalafel', function(req, res) {
	OutOfStocks.find({groupType : 'falafel'}, function(err, stocks) {
		if (err)
			throw err;
		
		res.json(stocks);
	});
});

//for edit item from db 
app.delete('/stock/:id', function(req, res) {
	var id = req.params.id;
	OutOfStocks.remove({_id: id}, function (err, stocks) {
		res.json(stocks);
	});
});

//for edit item
app.get('/stock/:id', function(req, res) {
	var id = req.params.id;
	OutOfStocks.findOne({_id: id}, function (err, stocks) {
		res.json(stocks);
	});
});

app.put('/stock/:id', function(req, res) {
	var id = req.params.id;
	
	var comments = (req.body.comments === undefined || req.body.comments === '')? 'אין הערות': req.body.comments;
	
	var d = new Date();
	var date = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	var date = date + "/" + month + "/" + year;
	var minutes = d.getMinutes();
	if(minutes < 10)
		minutes = '0'+minutes;
	var time = d.getHours()+3 + ":" + minutes + ":" + d.getSeconds(); 
	
	var phoneNumber = (req.body.phoneNumber === undefined)? '' : ('טלפון: ' + req.body.phoneNumber + "\n") ;
	var name = (req.body.name === undefined)? '' : ('שם: ' + req.body.name + "\n") ;
	var details =  name +
				   phoneNumber +
				  'תאריך: ' + date + "\n" +
				  'שעה: ' + time;
				   
	var category;
	switch(req.body.category)
	{
		case 'basicProducts':
			category = 'מוצרי יסוד';
			break;
		case 'detergents':
			category = 'חומרי ניקוי';
			break;
		case 'disposableDishes':
			category = 'כלים חד פעמיים';
			break;
		case 'bakingProducts':
			category = 'מוצרי אפיה';
			break;
		case 'falafel':
			category = 'פלאפל';
			break;
		case 'other':
			category = 'שונות';
			break;
	}
	
	OutOfStocks.findOneAndUpdate({_id: id},
		{$set: {category: category, product: req.body.product, quantity: req.body.quantity, comments: comments, details: details,
		groupType: req.body.groupType, isBought: false, name: req.body.name, phoneNumber: req.body.phoneNumber}},
		{new: true} , function(err, stocks) {
			res.json(stocks);
		});
});

app.put('/stock/:id/:value', function(req, res) {
	var id = req.params.id;
	var value = req.params.value;
	
	OutOfStocks.findOneAndUpdate({_id: id},
		{$set: {isBought: value}}, function(err, stocks) {
			res.json(stocks);
		});
});

//save messages in DB
app.post('/message', function (req, res) {
	new Messages({
		content: req.body.content,
		topic: req.body.topic,
		messageToVolunteers: req.body.messageToVolunteers,
		messageToBakers: req.body.messageToBakers,
		messageToBakery: req.body.messageToBakery,
		messageToGuests: req.body.messageToGuests,
		messageToString: req.body.messageToString,
		category: req.body.category,
		publicationDate: req.body.publicationDate
	}).save(function (err){
		if (err){
			console.log(err);
		}else{
		   res.json('saved!');
		}
	});
});

//delete messages in DB
app.delete('/message/:id', function(req, res) {
	var id = req.params.id;
	Messages.remove({_id: id}, function (err, message) {
		res.json(message);
	});
});

//save shift request in DB
app.post('/volunteersShiftRequest', function (req, res) {
	new ShiftRequests({
		shiftDay: req.body.shiftDay,
		shiftTime: req.body.shiftTime,
		comments: req.body.comments,
		applicantName: req.body.applicantName,
		applicantPhoneNumber: req.body.applicantPhoneNumber,
		requestDate: req.body.requestDate
	}).save(function (err){
		if (err){
			console.log(err);
		}else{
		   res.json('saved!');
		}
	});
});

//get all volunteers's shifts in db.
app.get('/volunteersShifts', function(req, res) {
	Shifts.find(function(err, shifts) {
		if (err)
			throw err;
		res.json(shifts);
	});
});

//get all shifts requests in db.
app.get('/managersShiftsRequests', function(req, res) {
	ShiftRequests.find(function(err, shiftRequests) {
		if (err)
			throw err;
		res.json(shiftRequests);
	});
});

//listen on port
app.listen(port);