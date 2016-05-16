var userInfo = {
	fullName:''
};

var messages;
var posts;

var app = angular.module('bakersApp', ['ngRoute']);

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
}]);﻿

app.controller('guestBookController', ['$scope', '$http', function($scope, $http) {
	$("#cmdAdd").hide();
}]);﻿

app.controller('mainController', ['$scope', '$http', function($scope, $http) {
	//load the messages from the database.
	$scope.refresh = function () {
		$http.get('/refresh').success(function(response) {
			$scope.messages = messages;
			$scope.posts = posts;
		});
	};
	
	$scope.loadMessagesDB = function() {
		$http.get('/bakersMessages').success(function(response) {
			$scope.messages = response;
			
			messages = $scope.messages;
		});

		$http.get('/bakersPosts').success(function(response) {
			$scope.posts = response;
			
			posts = $scope.posts;
		});

		$scope.refresh();
	};

	//initial load
	$scope.loadMessagesDB();
}]);﻿

app.controller('arrangementController', ['$scope', '$http', function($scope, $http) {
	
}]);﻿

app.config(function ($routeProvider) {
	$routeProvider
		.when('/guestBook', {
		templateUrl: '../general/guestBook.html',
		controller: 'guestBookController',
		controllerAs:'guestBook'
	})
		.when('/arrangement', {
		templateUrl: 'bakeArrangement.html',
		controller: 'arrangementController',
		controllerAs:'arrangement'
	})
		.when('/main', {
		templateUrl: 'mainBakers.html',
		controller: 'mainController',
		controllerAs: 'main'
	})
		.otherwise({
		redirectTo: '/main'
	});

});