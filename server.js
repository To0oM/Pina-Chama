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

app.get('/managerDB', function(req, res) {
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
	new OutOfStocks({
		category: req.body.category,
		product: req.body.product,
		quantity: req.body.quantity,
		comments: req.body.comments,
		name: req.body.name,
		phoneNumber: req.body.phoneNumber,
		dateAndTime: req.body.dateAndTime
	}).save(function (err){
		if (err){
			console.log(err);
		}else{
		   res.json('saved!');
		}
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

//listen on port
app.listen(port);