var express = require('express'); //for routing
var path = require('path');       //to get the absolute path
var mongoose = require('mongoose');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var encode = require( 'hashcode' ).hashCode;

var app = express();              //init the server

var DB_URL = mongodb://pinaChama:phbvjnvduagmhui@ds064748.mlab.com:64748/mLabMongoDB-g || 'mongodb://localhost/mLabMongoDB-g';
var port = process.env.PORT || 8080;


app.use(express.static(__dirname + '/Pina-Chama'));
app.use(bodyParser.json());

app.use(cookieParser('P1N4S3C3E7'));
app.use(cookieSession({
	key: 'app.sess',
	secret: 'P1N4S3C3E7'
}));

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
var CakeRequests = mongoose.model('cakeRequests');
var Cakes = mongoose.model('cakes');
var Posts = mongoose.model('posts');
var Videos = mongoose.model('videos');

app.post('/registerKey', function (req, res) {
	var hash = encode().value(req.body.value);
	
	if(hash == 471730922){
		res.json('Approved');
	}else{
		res.json('Denied');
	}
});

app.get('/getUserInfo', function(req, res) {
	var response = {
	};
	
	response.googleId = req.session.googleId;
	response.fullName = req.session.fullName;
	response.userType = req.session.userType;
	response.phoneNumber = req.session.phoneNumber;
	
	res.json(response);
});

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
		addStreet: req.body.addStreet,
		addApartment: req.body.addApartment,
		addCity: req.body.addCity,
		addPostalCode: req.body.addPostalCode,
		email: req.body.email,
		volunteerStartDate:  req.body.volunteerStartDate,
		comments: comments,
		active: 'פעיל',
		permanent: req.body.permanent,
		team: team,
		dateOfVisit:  req.body.dateOfVisit
	}).save(function (err){
		if (err){
			console.log(err);
		}else{
			req.session.googleId = req.body.googleId;
			req.session.fullName = req.body.firstName + ' ' + req.body.lastName;
			req.session.userType = req.body.userType;
			req.session.phoneNumber = req.body.phoneNumber;
			
			res.json('saved!');
		}
	});
});

app.get('/refresh', function(req, res) {
	res.json('refresh');
});

app.post('/loadPage', function(req, res) {
	if(req.session.userType === req.body.userType){
		res.json('approved');
	}else{
		res.json('denied');
	}
});

app.get('/managersDB', function(req, res) {
	Users.find({userType : 'manager'}, function(err, users) {
		if (err)
			throw err;
		
		res.json(users);
	});
});

app.get('/volunteersDB', function(req, res) {
	Users.find({userType : 'volunteer'}, function(err, users) {
		if (err)
			throw err;
		
		res.json(users);
	});
});

app.get('/guestsDB', function(req, res) {
	Users.find({userType : 'guest'}, function(err, users) {
		if (err)
			throw err;
		
		res.json(users);
	});
});

app.get('/bakeryDB', function(req, res) {
	Users.find({userType : 'bakery'}, function(err, users) {
		if (err)
			throw err;
		
		res.json(users);
	});
});

app.get('/bakersDB', function(req, res) {
	Users.find({userType : 'baker'}, function(err, users) {
		if (err)
			throw err;
		
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
	
	Users.findOne({ 'googleId': id }, 'firstName lastName userType phoneNumber', function (err, users) {
		if (err)
			return handleError(err);
		
		if (users){
			req.session.googleId = id;
			req.session.fullName = users.firstName + ' ' + users.lastName;
			req.session.userType = users.userType;
			req.session.phoneNumber = users.phoneNumber;
		}
		
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

/*----------------------------------------------Out of Stock----------------------------------------------*/
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

//for update item
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

/*----------------------------------------------Messages----------------------------------------------*/
//save messages in DB.
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

//delete messages in DB.
app.delete('/message/:id', function(req, res) {
	var id = req.params.id;
	Messages.remove({_id: id}, function (err, message) {
		res.json(message);
	});
});

/*-----------------------------------------Shift Request-----------------------------------------*/
//save shift request in DB.
app.post('/volunteersShiftRequest', function (req, res) {
	new ShiftRequests({
		shiftDate: req.body.shiftDate,
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

//get all volunteers's shifts in db from the selected day.
app.get('/volunteersShifts/:day', function(req, res) {
	var day = req.params.day;
	var shifts = {};
	
	Shifts.findOne({shiftDay: day, shiftTime: "first"}, function(err, firstShift) {
		if (err)
			throw err;
		
		if(firstShift){
			shifts.firstShift = firstShift;
		}else{
			shifts.firstShift = {
				shiftDay: day,
				shiftTime: "first",
				volunteer1Name: "",
				volunteer2Name: ""
			};
		}
	});
	
	Shifts.findOne({shiftDay: day, shiftTime: "second"}, function(err, secondShift) {
		if (err)
			throw err;
		if(secondShift){
			shifts.secondShift = secondShift;
		}else{
			shifts.secondShift = {
				shiftDay: day,
				shiftTime: "second",
				volunteer1Name: "",
				volunteer2Name: ""
			}
		}
	});
	
	Shifts.findOne({shiftDay: day, shiftTime: "third"}, function(err, thirdShift) {
		if (err)
			throw err;
		if(thirdShift){
			shifts.thirdShift = thirdShift;
		}else{
			shifts.thirdShift = {
				shiftDay: day,
				shiftTime: "third",
				volunteer1Name: "",
				volunteer2Name: ""
			}
		}
	});
	
	Shifts.findOne({shiftDay: day, shiftTime: "fourth"}, function(err, fourthShift) {
		if (err)
			throw err;
		if(fourthShift){
			shifts.fourthShift = fourthShift;
		}else{
			shifts.fourthShift = {
				shiftDay: day,
				shiftTime: "fourth",
				volunteer1Name: "",
				volunteer2Name: ""
			}
		}
	});
	
	Shifts.findOne({shiftDay: day, shiftTime: "fifth"}, function(err, fifthShift) {
		if (err)
			throw err;
		if(fifthShift){
			shifts.fifthShift = fifthShift;
		}else{
			shifts.fifthShift = {
				shiftDay: day,
				shiftTime: "fifth",
				volunteer1Name: "",
				volunteer2Name: ""
			}
		}
	});
	
	Shifts.findOne({shiftDay: day, shiftTime: "sixth"}, function(err, sixthShift) {
		if (err)
			throw err;
		if(sixthShift){
			shifts.sixthShift = sixthShift;
		}else{
			shifts.sixthShift = {
				shiftDay: day,
				shiftTime: "sixth",
				volunteer1Name: "",
				volunteer2Name: ""
			}
		}
	});
	
	setTimeout(function (){
		res.json(shifts);
	}, 300);
});

//for update item
app.put('/saveShifts/:day', function(req, res) {
	var update = req.body;
	var day = req.params.day;
	var currentDayShifts = update.currentDayShifts;
	
	/* ------ first shift ------ */
	Shifts.findOneAndUpdate({shiftDay: day, shiftTime: "first"},
		{$set: {volunteer1Name: currentDayShifts.firstShift.volunteer1Name, volunteer2Name: currentDayShifts.firstShift.volunteer2Name}},
		{new: true} , function(err, sunFirst) {
			if(!sunFirst){
				new Shifts({
					shiftDay: currentDayShifts.firstShift.shiftDay,
					shiftTime: currentDayShifts.firstShift.shiftTime,
					volunteer1Name: currentDayShifts.firstShift.volunteer1Name,
					volunteer2Name: currentDayShifts.firstShift.volunteer2Name
				}).save(function (err){
					if (err)
						throw err;
				});
			}
		}
	);
	
	/* ------ second shift ------ */
	Shifts.findOneAndUpdate({shiftDay: day, shiftTime: "second"},
		{$set: {volunteer1Name: currentDayShifts.secondShift.volunteer1Name, volunteer2Name: currentDayShifts.secondShift.volunteer2Name}},
		{new: true} , function(err, sunFirst) {
			if(!sunFirst){
				new Shifts({
					shiftDay: currentDayShifts.secondShift.shiftDay,
					shiftTime: currentDayShifts.secondShift.shiftTime,
					volunteer1Name: currentDayShifts.secondShift.volunteer1Name,
					volunteer2Name: currentDayShifts.secondShift.volunteer2Name
				}).save(function (err){
					if (err)
						throw err;
				});
			}
		}
	);
	
	/* ------ third shift ------ */
	Shifts.findOneAndUpdate({shiftDay: day, shiftTime: "third"},
		{$set: {volunteer1Name: currentDayShifts.thirdShift.volunteer1Name, volunteer2Name: currentDayShifts.thirdShift.volunteer2Name}},
		{new: true} , function(err, sunFirst) {
			if(!sunFirst){
				new Shifts({
					shiftDay: currentDayShifts.thirdShift.shiftDay,
					shiftTime: currentDayShifts.thirdShift.shiftTime,
					volunteer1Name: currentDayShifts.thirdShift.volunteer1Name,
					volunteer2Name: currentDayShifts.thirdShift.volunteer2Name
				}).save(function (err){
					if (err)
						throw err;
				});
			}
		}
	);
	
	/* ------ fourth shift ------ */
	Shifts.findOneAndUpdate({shiftDay: day, shiftTime: "fourth"},
		{$set: {volunteer1Name: currentDayShifts.fourthShift.volunteer1Name, volunteer2Name: currentDayShifts.fourthShift.volunteer2Name}},
		{new: true} , function(err, sunFirst) {
			if(!sunFirst){
				new Shifts({
					shiftDay: currentDayShifts.fourthShift.shiftDay,
					shiftTime: currentDayShifts.fourthShift.shiftTime,
					volunteer1Name: currentDayShifts.fourthShift.volunteer1Name,
					volunteer2Name: currentDayShifts.fourthShift.volunteer2Name
				}).save(function (err){
					if (err)
						throw err;
				});
			}
		}
	);
	
	/* ------ fifth shift ------ */
	Shifts.findOneAndUpdate({shiftDay: day, shiftTime: "fifth"},
		{$set: {volunteer1Name: currentDayShifts.fifthShift.volunteer1Name, volunteer2Name: currentDayShifts.fifthShift.volunteer2Name}},
		{new: true} , function(err, sunFirst) {
			if(!sunFirst){
				new Shifts({
					shiftDay: currentDayShifts.fifthShift.shiftDay,
					shiftTime: currentDayShifts.fifthShift.shiftTime,
					volunteer1Name: currentDayShifts.fifthShift.volunteer1Name,
					volunteer2Name: currentDayShifts.fifthShift.volunteer2Name
				}).save(function (err){
					if (err)
						throw err;
				});
			}
		}
	);
	
	/* ------ sixth shift ------ */
	Shifts.findOneAndUpdate({shiftDay: day, shiftTime: "sixth"},
		{$set: {volunteer1Name: currentDayShifts.sixthShift.volunteer1Name, volunteer2Name: currentDayShifts.sixthShift.volunteer2Name}},
		{new: true} , function(err, sunFirst) {
			if(!sunFirst){
				new Shifts({
					shiftDay: currentDayShifts.sixthShift.shiftDay,
					shiftTime: currentDayShifts.sixthShift.shiftTime,
					volunteer1Name: currentDayShifts.sixthShift.volunteer1Name,
					volunteer2Name: currentDayShifts.sixthShift.volunteer2Name
				}).save(function (err){
					if (err)
						throw err;
				});
			}
		}
	);
	
	setTimeout(function (){
		res.json("saved!");
	}, 300);
});

//get all shifts requests in db.
app.get('/managersShiftsRequests', function(req, res) {
	ShiftRequests.find(function(err, shiftRequests) {
		if (err)
			throw err;
		res.json(shiftRequests);
	});
});

/*---------------------------------cake Request---------------------------------*/
//save cake request in DB.
app.post('/bakersCakeRequest', function (req, res) {
	new CakeRequests({
		cakeDate: req.body.cakeDate,
		cake: req.body.cake,
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

//get all bakers's cakes arrangement in db from the selected day.
app.get('/bakersCakes/:day', function(req, res) {
	var day = req.params.day;
	
	Cakes.find({cakeDay: day}, function(err, cakes) {
		if (err)
			throw err;
		
		res.json(cakes);
	});
});

//add a new baker.
app.put('/addCake/:day', function(req, res) {
	var update = req.body;
	var day = req.params.day;
	var currentNewCake = update.currentNewCake;
	
	new Cakes({
		cakeDay: day,
		cake: currentNewCake.cake,
		bakerName: currentNewCake.bakerName
	}).save(function (err){
		if (err)
			throw err;
		
		res.json("saved!");
	});
});

//for delete a shift request from db.
app.delete('/shiftRequest/:id', function(req, res) {
	var id = req.params.id;
	
	ShiftRequests.remove({_id: id}, function (err, shiftRequest) {
		res.json(shiftRequest);
	});
});

//for delete a cake baker from db.
app.delete('/baker/:id', function(req, res) {
	var id = req.params.id;
	
	Cakes.remove({_id: id}, function (err, cake) {
		res.json(cake);
	});
});

//for delete a cake request from db.
app.delete('/cakeRequest/:id', function(req, res) {
	var id = req.params.id;
	
	CakeRequests.remove({_id: id}, function (err, cakeRequest) {
		res.json(cakeRequest);
	});
});

//get all cakes requests in db.
app.get('/managersCakesRequests', function(req, res) {
	CakeRequests.find(function(err, cakeRequests) {
		if (err)
			throw err;
		res.json(cakeRequests);
	});
});

/*-------------------------------------Personal Details-------------------------------------*/
//for edit item
app.get('/pesonalDetails/:id', function(req, res) {
	var id = req.params.id;
	Users.findOne({googleId: id}, function (err, user) {
		res.json(user);
	});
});

//for edit item
app.put('/pesonalDetails/:id', function(req, res) {
	var userId = req.params.id;
	
	var id = (req.body.id === undefined)? 0: req.body.id;
	var comments = (req.body.comments === undefined)? 'אין הערות': req.body.comments;
	var team = (req.body.team === undefined)? 'ללא קבוצה': req.body.team;
	var address = req.body.addStreet + ' ' + req.body.addApartment + ', ' + req.body.addCity;
	if (req.body.addPostalCode !== undefined){
		address += ' (' + req.body.addPostalCode + ')';
	}
	
	Users.findOneAndUpdate({_id: userId},
		{$set: {id: id, firstName: req.body.firstName, lastName: req.body.lastName, userType: req.body.userType, dateOfBirth: req.body.dateOfBirth,
				phoneNumber: req.body.phoneNumber, address: address, addStreet: req.body.addStreet, addApartment: req.body.addApartment, 
				addCity: req.body.addCity, addPostalCode: req.body.addPostalCode, email: req.body.email, volunteerStartDate: req.body.volunteerStartDate,
				comments: comments, active: req.body.active, permanent: req.body.permanent, team: team, dateOfVisit: req.body.dateOfVisit}},
		{new: true} , function(err, user) {
			res.json(user);
		});
});

/*-----------------------------------------Guests Book Posts-----------------------------------------*/
//save posts in DB
app.post('/guestPost', function (req, res) {
	new Posts({
		content: req.body.content,
		topic: req.body.topic,
		publicationDate: req.body.publicationDate,
		publishName: req.body.publishName,
		pageNum: req.body.pageNum
	}).save(function (err){
		if (err){
			console.log(err);
		}else{
		   res.json('saved!');
		}
	});
});

//get all guestsBook's posts in db.
app.get('/guestBookPosts', function(req, res) {
	Posts.find(function(err, posts) {
		if (err)
			throw err;
		res.json(posts);
	});
});

//get Last Insertion guestsBook's posts in db.
app.get('/getLastInsertion', function(req, res) {
	Posts.findOne({}, {}, {sort: {'publicationDate' : -1}}, function(err, posts){
		if (err)
			throw err;
		res.json(posts);
	});
});

/*------------------------------------------guides------------------------------------------*/
app.post('/addVideo', function (req, res) {
	new Videos({
		vidName: req.body.vidName,
		fileName: req.body.fileName,
		mp4FileName: req.body.mp4FileName,
		webmFileName: req.body.webmFileName,
		intendeToVolunteers: req.body.intendeToVolunteers,
		intendeToBakery: req.body.intendeToBakery
	}).save(function (err){
		if (err){
			console.log(err);
		}else{
			res.json('saved!');
		}
	});
});

//for loading all videos from DB - manager use.
app.get('/loadVideos', function(req, res) {
	Videos.find(function(err, videos) {
		if (err)
			throw err;
		
		res.json(videos);
	});
});

//for loading the user videos from DB.
app.get('/loadVideos/:userType', function(req, res) {
	var userType = req.params.userType;
	
	if(userType === "volunteer"){
		Videos.find({intendeToVolunteers: true}, function(err, videos) {
			if (err)
				throw err;
			
			res.json(videos);
		});
	}else if(userType === "bakery"){
		Videos.find({intendeToBakery: true}, function(err, videos) {
			if (err)
				throw err;
			
			res.json(videos);
		});
	}
});

//for delete a video from db.
app.delete('/video/:id', function(req, res) {
	var id = req.params.id;
	Videos.remove({_id: id}, function (err, videos) {
		res.json(videos);
	});
});

//listen on port
app.listen(port);