var userInfo = {
	fullName:''
};

var title = '';
var usersList;

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
	
}]);﻿

app.controller('guidesController', ['$scope', '$http', function($scope, $http) {
	
}]);﻿

app.controller('stockController', ['$scope', '$http', function($scope, $http) {
	
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
}]);﻿

app.controller('databaseManage', ['$scope', '$http', function($scope, $http) {
	/*
	$scope.loadManagerDB = function() {
		$http.get('/managerDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר אחראים';
		});
	};
	*/
	/*
	$scope.loadVolunteersDB = function() {
		$http.get('/volunteersDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר מתנדבים';
			
			title = $scope.title;
			usersList = $scope.usersList;
		});
	};
	
	$scope.loadGuestsDB = function() {
		$http.get('/guestsDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר אורחים';
			
			title = $scope.title;
			usersList = $scope.usersList;
		});
	};
	
	$scope.loadBakeryDB = function() {
		$http.get('/bakeryDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר חדר אפיה';
			
			title = $scope.title;
			usersList = $scope.usersList;
		});
	};
	
	$scope.loadBakersDB = function() {
		$http.get('/bakersDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר אופי עוגות';
			
			title = $scope.title;
			usersList = $scope.usersList;
		});
	};*/
	
}]);﻿

app.controller('arrangementController', ['$scope', '$http', function($scope, $http) {
	
}]);﻿

app.controller('guestBookController', ['$scope', '$http', function($scope, $http) {
	$("#cmdAdd").hide();
}]);﻿

app.config(function ($routeProvider) {
	$routeProvider
		.when('/guestBook', {
		templateUrl: '../guests/guestBook.html',
		controller: 'guestBookController',
		controllerAs:'guestBook'
	})
		.when('/arrangement', {
		templateUrl: 'voluntaryArrangement.html',
		controller: 'arrangementController',
		controllerAs:'arrangement'
	})/*
		.when('/database', {
		templateUrl: 'database.html',
		controller: 'databaseManage',
		controllerAs:'databaseM'
	})*/
		.when('/volunteersDB', {
		templateUrl: 'volunteersDatabase.html',
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
		templateUrl: 'outOfStock.html',
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