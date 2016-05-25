var userInfo = {
	fullName:''
};

var title = '';
var usersList;

var messages;
var posts;

var stocksPinaList;
var stocksBakeryList;
var stocksFalafelList;

var app = angular.module('managersApp', ['ngRoute']);

app.controller('connectionContreoller', ['$scope', '$http', function($scope, $http) {
	userInfo.fullName = JSON.parse(localStorage.getItem("userName"));
	
	$("#userName").html(userInfo.fullName);
	
	$scope.signOut = function() {
		localStorage.removeItem("userName");
		document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://pina-chama.azurewebsites.net/";
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
	
	//initial load
	$scope.loadStocks();
	
	$scope.loadStockDB = function() {
		$scope.loadManagersList();
		$scope.loadVolunteersList();
		$scope.loadBakeryList();
		$scope.loadStocks();
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
	
	//initial load
	$scope.loadData();
	
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
	
	$scope.showTableDetails = function(index) {
		console.log("index: " + index);
		var volunteerStartDate = ($scope.usersList[index].volunteerStartDate === null)? 'לא צויין': $scope.usersList[index].volunteerStartDate;
		
		var tableDetails = 'הערות: ' + $scope.usersList[index].comments + "\n" +
					'תאריך הצטרפות: ' + volunteerStartDate + "\n" +
					'קביעות: ' + $scope.usersList[index].permanent;
		
		swal("פרטים", tableDetails);
	};
}]);﻿

app.controller('arrangementController', ['$scope', '$http', function($scope, $http) {
	
}]);﻿

app.controller('guestBookController', ['$scope', '$http', function($scope, $http) {
	$("#cmdAdd").hide();
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
		.when('/main', {
		templateUrl: 'mainManagers.html',
		controller: 'mainController',
		controllerAs: 'main'
	})
		.otherwise({
		redirectTo: '/main'
	});

});