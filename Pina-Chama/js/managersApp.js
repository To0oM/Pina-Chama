var userInfo = {
	fullName:''
};

var title = '';
var usersList;

var messages;
var posts;

var guestPosts;
var pagesNum; 

var stocksPinaList;
var stocksBakeryList;
var stocksFalafelList;

var shifts;
var shiftRequests;
var cakes;
var cakeRequests;

var user;

var app = angular.module('managersApp', ['ngRoute']);

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length,c.length);
		}
	}
	return "";
}

app.controller('connectionContreoller', ['$scope', '$http', function($scope, $http) {
	userInfo.fullName = JSON.parse(localStorage.getItem("userName"));
	
	$("#userName").html(userInfo.fullName);
	
	$scope.signOut = function() {
		localStorage.removeItem("userName");
		document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://pina-chama.azurewebsites.net/";
	};
}]);﻿

app.controller('personalDetailsContreoller', ['$scope', '$http', function($scope, $http) {
	$scope.required = {
		firstName: true,
		lastName: true,
		id: true,
		addCity: true,
		addStreet: true,
		addApartment: true,
		phoneNumber: true,
		dateOfBirth: true,
		email: true,
	};
	
	var chooseUserType = function() {
		$("#lblId").show();
		$("#id").show();
		$scope.required.id = true;
		$("#data8").hide();
		$("#data9").show();
		$("#Comments").prop("placeholder", "");
		$("#data10").show();
		$("#data11").hide();
	};
	
	chooseUserType();
	
	$scope.updateForm = function() {
		var id = getCookie("user_id");
		$http.get('/pesonalDetails/' + id).success(function(response) {
			user = response;
			
			var dateOfBirth = '';
			var volunteerStartDate = '';
			var dateOfVisit = '';
			
			if(response.dateOfBirth != null)
				dateOfBirth = new Date(response.dateOfBirth);
			if(response.volunteerStartDate != null)
				volunteerStartDate = new Date(response.volunteerStartDate);
			if(response.dateOfVisit != null)
				dateOfVisit = new Date(response.dateOfVisit);
			
			chooseUserType();
			
			$http.get('/refresh').success(function(response) {
				user.dateOfBirth = dateOfBirth;
				user.volunteerStartDate = volunteerStartDate;
				user.dateOfVisit = dateOfVisit;
				
				$scope.user = user;
			});
		});
	};
	
	$scope.updateForm();
	
	$scope.submitForm = function() {
		// check to make sure the form is completely valid
		if ($scope.userForm.$valid) {
			swal({
				title: "עריכת פרטים אישיים",
				text: "האם אתה בטוח שברצונך לעדכן את הפרטים האישיים?",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "כן, עדכן!",
				closeOnConfirm: false,
				html: false
			}, function(){
				
				$http.put('/pesonalDetails/' + $scope.user._id , $scope.user).success(function(response) {
					swal("עודכן!",
					"הפרטים האישיים עודכנו בהצלחה",
					"success");
				});
				
			});
		}
	};	
}]);﻿

app.controller('navContreoller', ['$scope', '$http', function($scope, $http) {
	$("#navTab1").click(function(){
		$(".activeTab").prop('class','navTabs');
		$("#navTab1").prop('class','activeTab');
	});
	$("#navTab2").click(function(){
		$(".activeTab").prop('class','navTabs');
		$("#navTab2").prop('class','activeTab');
	});
	$("#navTab3").click(function(){
		$(".activeTab").prop('class','navTabs');
		$("#navTab3").prop('class','activeTab');
	});
	$("#navTab4").click(function(){
		$(".activeTab").prop('class','navTabs');
		$("#navTab4").prop('class','activeTab');
	});
	$("#navTab5").click(function(){
		$(".activeTab").prop('class','navTabs');
		$("#navTab5").prop('class','activeTab');
	});
	$("#navTab6").click(function(){
		$(".activeTab").prop('class','navTabs');
		$("#navTab6").prop('class','activeTab');
	});
}]);﻿

app.controller('mainController', ['$scope', '$http', function($scope, $http) {
	$scope.message = {
		category:''
	};

	$scope.required = {
		topic: true,
		content: true,
		messageTo: true
	};
	
	$("#addMessageDiv").hide();
	$("#fade").hide();
	$("#mainBody").hide();
	
	$scope.redirection = function () {
		var path = '/home.html';
		
		window.location.replace(path);
	}
	
	$scope.loadPage = function () {
		var info = {
			userType: 'manager'
		};
		
		$http.post('/loadPage', info).success(function(response) {
			if(response === 'approved'){
				$("#mainBody").show();
			}else{
				$scope.redirection();
			}
		});
	};
	
	$scope.loadPage();
	
	//load the messages from the database.
	$scope.refresh = function () {
		$http.get('/refresh').success(function(response) {
			$scope.messages = messages;
			$scope.posts = posts;
		});
	};
	
	$scope.loadMessagesDB = function() {
		$http.get('/messages').success(function(response) {
			$scope.messages = response;
			
			messages = $scope.messages;
		});

		$http.get('/posts').success(function(response) {
			$scope.posts = response;
			
			posts = $scope.posts;
		});

		$scope.refresh();
	};

	//initial load
	$scope.loadMessagesDB();
	
	$scope.newMessage = function(category){
		var windowHeight = $(window).height();
		$('.black_overlay').css('height', windowHeight);
		
		$("#addMessageDiv").fadeIn();
		$("#fade").fadeIn();

		$scope.message.category = category;
		
		if ($scope.message.category === 'message'){
			var divLocation = $("#messagesDiv").position();
			$("#addMessageDiv").css('top', divLocation.top);
			$("#addMessTitle").html("הוספת הודעה לפינת ההודעות מהאחראים");
		} else {
			var divLocation = $("#postsDiv").position();
			$("#addMessageDiv").css('top', divLocation.top);
			$("#addMessTitle").html("הוספת הודעה לפינת היום שהיה");
		}

		$scope.message.messageToVolunteers = false;
		$scope.message.messageToBakers = false;
		$scope.message.messageToBakery = false;
		$scope.message.messageToGuests = false;
		$scope.message.topic = '';
		$scope.message.content = '';
	};

	$scope.close = function(){
		$("#addMessageDiv").fadeOut();
		$("#fade").fadeOut();
	};

	$scope.addMessage = function() {
		var messageToCount = 0;
		$scope.message.messageToString = '';

		if ($scope.message.messageToVolunteers){
			$scope.message.messageToString += 'מתנדבים';
			messageToCount++;
		}

		if ($scope.message.messageToBakers){
			if (messageToCount !== 0){
				$scope.message.messageToString += ', ';
			}

			$scope.message.messageToString += 'אופי עוגות';
			messageToCount++;
		}

		if ($scope.message.messageToBakery){
			if (messageToCount !== 0){
				$scope.message.messageToString += ', ';
			}

			$scope.message.messageToString += 'חדר אפיה';
			messageToCount++;
		}

		if ($scope.message.messageToGuests){
			if (messageToCount !== 0){
				$scope.message.messageToString += ', ';
			}

			$scope.message.messageToString += 'אורחים';
			messageToCount++;
		}

		$scope.message.publicationDate = new Date();

		$http.post('/message', $scope.message).success(function(response) {
			$scope.loadMessagesDB();
		});
	};
	
	//delete message form the DB
	$scope.remove = function(id) {
		swal({
			title: "מחיקת הודעה",
			text: "האם אתה בטוח שברצונך למחוק הודעה זו?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "כן, מחק!",
			closeOnConfirm: false,
			html: false
		}, function(){
			$http.delete('/message/' + id).success(function(response) {
				$scope.loadMessagesDB();
			});
			swal("נמחק!",
			"הודעה זו הוסרה מרשימת ההודעות",
			"success");
		});
	};
	
	$scope.submitMessageForm = function() {
		// check to make sure the form is completely valid
		if ($scope.messageForm.$valid) {
			$scope.addMessage();
			$scope.close();
		}
	};
}]);﻿

app.controller('guidesController', ['$scope', '$http', function($scope, $http) {
	
}]);﻿

app.controller('stockController', ['$scope', '$http', function($scope, $http) {
	$("#updateStock").prop("title","בחר תחילה מוצר לערוך");
	$scope.isDisabledUpdate = true;
	
	$scope.stock = {
		groupType: 'pina',
		category: 'basicProducts'
	};
	
	$scope.required = {
		product: true,
		quantity: true
	};
	
	//save stock on db
	$scope.submitStockForm = function() {
		// check to make sure the form is completely valid
		if ($scope.stockForm.$valid) {
			$scope.addStock();
		}
	};
	
	//add stock to db
	$scope.addStock = function() {
		$http.post('/stock', $scope.stock).success(function(response) {
			$scope.resetForm();
			$scope.loadStockDB();
		});
	};
	
	$scope.resetForm = function() {
		$scope.stock.groupType = 'pina';
		$scope.stock.category = 'basicProducts';
		$scope.stock.product = '';
		$scope.stock.quantity = '';
		$scope.stock.name = '';
		$scope.stock.phoneNumber = '';
		$scope.stock.comments = '';
	};
	
	//load the data of out of stock to tables
	$scope.loadStocks = function () {
		$http.get('/refresh').success(function(response) {
			$scope.stocksPinaList = stocksPinaList;
			$scope.stocksBakeryList = stocksBakeryList;
			$scope.stocksFalafelList = stocksFalafelList;
		});
	};
	
	$scope.loadManagersList = function() {
		$http.get('/stockPina').success(function(response) {
			$scope.stocksPinaList = response;
			
			stocksPinaList = $scope.stocksPinaList;
		});
	};
	
	$scope.loadVolunteersList = function() {
		$http.get('/stockBakery').success(function(response) {
			$scope.stocksBakeryList = response;
			
			stocksBakeryList = $scope.stocksBakeryList;
		});
	};
	
	$scope.loadBakeryList = function() {
		$http.get('/stockFalafel').success(function(response) {
			$scope.stocksFalafelList = response;
			
			stocksFalafelList = $scope.stocksFalafelList;
		});
	};
	
	$scope.loadStockDB = function() {
		$scope.loadManagersList();
		$scope.loadVolunteersList();
		$scope.loadBakeryList();
		$scope.loadStocks();
	};
	
	//initial load
	$scope.loadStockDB();
	
	$scope.showDetails = function(details) {
		swal("פרטים", details);
	};
	
	//delete message form the DB
	$scope.remove = function(id) {
		swal({
			title: "מחיקת מוצר",
			text: "האם אתה בטוח שברצונך למחוק מוצר זה?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "כן, מחק!",
			closeOnConfirm: false,
			html: false
		}, function(){
			$http.delete('/stock/' + id).success(function(response) {
				$scope.loadStockDB();
			});
			swal("נמחק!",
			"מוצר זה הוסר מרשימת החסרים במלאי",
			"success");
		});
	};
	
	$scope.edit = function(id) {
		$http.get('/stock/' + id).success(function(response) {
			
			$("#updateStock").prop("title","עדכן מוצר");
			$scope.isDisabledUpdate = false;
		
			$scope.stock = response;
			
			switch($scope.stock.category)
			{
				case 'מוצרי יסוד':
					$scope.stock.category = 'basicProducts';
					break;
				case 'חומרי ניקוי':
					$scope.stock.category = 'detergents';
					break;
				case 'כלים חד פעמיים':
					$scope.stock.category = 'disposableDishes';
					break;
				case 'מוצרי אפיה':
					$scope.stock.category = 'bakingProducts';
					break;
				case 'פלאפל':
					$scope.stock.category = 'falafel';
					break;
				case 'שונות':
					$scope.stock.category = 'other';
					break;
			}
		});
	};
	
	$scope.update = function() {
		$http.put('/stock/' + $scope.stock._id , $scope.stock).success(function(response) {
			$("#updateStock").prop("title","בחר תחילה מוצר לערוך");
			$scope.isDisabledUpdate = true;
			
			$scope.loadStockDB();
			$scope.resetForm();
		});
	};
	
	$scope.updateBought = function(id, value) {
		$http.put('/stock/' + id + '/' + value).success(function(response) {
			$scope.loadStockDB();
		});
	}
}]);﻿

app.controller('databaseController', ['$scope', '$http', function($scope, $http) {
	$scope.loadData = function () {
		$http.get('/refresh').success(function(response) {
			$scope.usersList = usersList;
			$scope.title = title;
		});
	};
	
	$scope.loadManagrsDB = function() {
		$http.get('/managersDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר אחראים';
			
			title = $scope.title;
			usersList = $scope.usersList;
		});
		$scope.loadData();
	};
	
	$scope.loadVolunteersDB = function() {
		$http.get('/volunteersDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר מתנדבים';
			
			title = $scope.title;
			usersList = $scope.usersList;
		});
		$scope.loadData();
	};
	
	$scope.loadGuestsDB = function() {
		$http.get('/guestsDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר אורחים';
			
			title = $scope.title;
			usersList = $scope.usersList;
		});
		$scope.loadData();
	};
	
	$scope.loadBakeryDB = function() {
		$http.get('/bakeryDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר חדר אפיה';
			
			title = $scope.title;
			usersList = $scope.usersList;
		});
		$scope.loadData();
	};
	
	$scope.loadBakersDB = function() {
		$http.get('/bakersDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר אופי עוגות';
			
			title = $scope.title;
			usersList = $scope.usersList;
		});
		$scope.loadData();
	};
	
	//initial load
	$scope.loadData();
	
	//show details of volunteers and volunteers at bakery
	$scope.showTableDetails = function(index) {
		var volunteerStartDate;
		if($scope.usersList[index].volunteerStartDate === null)
		{
			volunteerStartDate = 'לא צויין';
		}
		else
		{
			var date = new Date($scope.usersList[index].volunteerStartDate);
			volunteerStartDate = (date.getDate()) + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();	
		}
		var comments = ($scope.usersList[index].comments === null)?  'אין הערות': $scope.usersList[index].comments;
		
		var tableDetails = 'תאריך הצטרפות: ' + volunteerStartDate + "\n" +
					'קביעות: ' + $scope.usersList[index].permanent + "\n" +
					'הערות: ' + comments;
		
		swal("פרטים", tableDetails);
	};
	
	//show details of managers
	$scope.showManagerDetails = function(index) {
		var comments = ($scope.usersList[index].comments === null)?  'אין הערות': $scope.usersList[index].comments;
		
		var tableDetails = 'הערות: ' + comments;
		
		swal("פרטים", tableDetails);
	};
	
	//show details of bakers
	$scope.showBakersDetails = function(index) {
		var volunteerStartDate;
		if($scope.usersList[index].volunteerStartDate === null)
		{
			volunteerStartDate = 'לא צויין';
		}
		else
		{
			var date = new Date($scope.usersList[index].volunteerStartDate);
			volunteerStartDate = (date.getDate()) + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();	
		}
		var comments = ($scope.usersList[index].comments === null)?  'אין הערות': $scope.usersList[index].comments;
		
		var tableDetails = 'תאריך הצטרפות: ' + volunteerStartDate + "\n" +
					'קביעות: ' + $scope.usersList[index].permanent + "\n" +
					'הערות: ' + comments;
		
		swal("פרטים", tableDetails);
	};
	
	//show details of guests
	$scope.showGuestDetails = function(index) {
		var dateOfVisit;
		if($scope.usersList[index].dateOfVisit === null)
		{
			dateOfVisit = 'לא צויין';
		}
		else
		{
			var date = new Date($scope.usersList[index].dateOfVisit);
			dateOfVisit = (date.getDate()) + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();	
		}
		var comments = ($scope.usersList[index].comments === null)?  'אין הערות': $scope.usersList[index].comments;
		
		var tableDetails = 'תאריך ביקור: ' + dateOfVisit + "\n" +
					'הערות: ' + comments;
		
		swal("פרטים", tableDetails);
	};
}]);﻿

app.controller('arrangementController', ['$scope', '$http', function($scope, $http) {
	//load the shifts, cakes, cakeRequests and shiftRequests from the database.
	$scope.refresh = function () {
		$http.get('/refresh').success(function(response) {
			$scope.shifts = shifts;
			$scope.shiftRequests = shiftRequests;
			$scope.cakes = cakes;
			$scope.cakeRequests = cakeRequests;
		});
	};
	
	$scope.loadShiftsDB = function() {
		$http.get('/volunteersShifts').success(function(response) {
			$scope.shifts = response;
			
			shifts = $scope.shifts;
		});

		$http.get('/managersShiftsRequests').success(function(response) {
			$scope.shiftRequests = response;
			
			shiftRequests = $scope.shiftRequests;
		});

		$scope.refresh();
	};
	
	$scope.loadCakesDB = function() {
		$http.get('/bakersCakes').success(function(response) {
			$scope.cakes = response;
			
			cakes = $scope.cakes;
		});
		
		$http.get('/managersCakesRequests').success(function(response) {
			$scope.cakeRequests = response;
			
			cakeRequests = $scope.cakeRequests;
		});
		
		$scope.refresh();
	};
	
	//initial load
	$scope.loadShiftsDB();
	$scope.loadCakesDB();
}]);﻿

app.controller('guestBookController', ['$scope', '$http', function($scope, $http) {
	$("#cmdAdd").hide();
	$scope.currentPage = 0;
	
	$scope.getLastInsertion = function () {
		$http.get('/getLastInsertion').success(function(response) {
			if (response){
				pagesNum = response.pageNum;
			} else {
				pagesNum = -1;
			}
			$scope.updatePage();
		});
	};
	
	$scope.updatePage = function () {
		if ($scope.currentPage === 0){
			$("#prev").prop("disabled", true);
			$("#prev").css("cursor", "default");
			$("#prev").prop("title", "תחילת הספר");
		} else {
			$("#prev").prop("disabled", false);
			$("#prev").css("cursor", "pointer"); 
			$("#prev").prop("title", "עמוד קודם");
		}

		if (($scope.currentPage === pagesNum) || ($scope.currentPage === (pagesNum-1)) || (pagesNum === -1)){
			$("#next").prop("disabled", true);
			$("#next").css("cursor", "default"); 
			$("#next").prop("title", "סוף הספר");
		} else {
			$("#next").prop("disabled", false);
			$("#next").css("cursor", "pointer");
			$("#next").prop("title", "עמוד הבא");
		}
	};
	
	//load the posts from the database.
	$scope.refresh = function () {
		$http.get('/refresh').success(function(response) {
			$scope.guestPosts = guestPosts;
		});
	};
	
	$scope.loadGuestPostsDB = function() {
		$scope.getLastInsertion();
		
		$http.get('/guestBookPosts').success(function(response) {
			$scope.guestPosts = response;
			
			guestPosts = $scope.guestPosts;
		});

		$scope.refresh();
	};

	//initial load
	$scope.loadGuestPostsDB();
	
	$scope.nextPage = function(){
		$scope.currentPage = $scope.currentPage+2;
		$scope.updatePage();
		$scope.loadGuestPostsDB();
	};
	
	$scope.prevPage = function(){
		$scope.currentPage = $scope.currentPage-2;
		$scope.updatePage();
		$scope.loadGuestPostsDB();
	};
}]);﻿

app.config(function ($routeProvider) {
	$routeProvider
		.when('/guestBook', {
		templateUrl: '../general/guestBook.html',
		controller: 'guestBookController',
		controllerAs:'guestBook'
	})
		.when('/arrangement', {
		templateUrl: 'voluntaryArrangement.html',
		controller: 'arrangementController',
		controllerAs:'arrangement'
	})
		.when('/volunteersDB', {
		templateUrl: 'volunteersDatabase.html',
		controller: 'databaseController',
		controllerAs:'database'
	})
		.when('/managersDB', {
		templateUrl: 'managersDatabase.html',
		controller: 'databaseController',
		controllerAs:'database'
	})
    	.when('/bakeryDB', {
		templateUrl: 'bakeryDatabase.html',
		controller: 'databaseController',
		controllerAs:'database'
	})
		.when('/bakersDB', {
		templateUrl: 'bakersDatabase.html',
		controller: 'databaseController',
		controllerAs:'database'
	})
		.when('/guestsDB', {
		templateUrl: 'guestsDatabase.html',
		controller: 'databaseController',
		controllerAs:'database'
	})
		.when('/stock', {
		templateUrl: '../general/outOfStock.html',
		controller: 'stockController',
		controllerAs: 'stock'
	})
		.when('/guides', {
		templateUrl: 'guides.html',
		controller: 'guidesController',
		controllerAs: 'guides'
	})
		.when('/personalDetails', {
		templateUrl: '../general/personalDetails.html',
		controller: 'personalDetailsContreoller',
		controllerAs: 'personalDetails'
	})
		.when('/main', {
		templateUrl: 'mainManagers.html',
		controller: 'mainController',
		controllerAs: 'main'
	})
		.otherwise({
		redirectTo: '/main'
	});

});