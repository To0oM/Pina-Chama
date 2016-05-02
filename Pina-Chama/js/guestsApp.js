var userInfo = {
	fullName:''
};

var app = angular.module('guestsApp', ['ngRoute']);

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

app.controller('mainController', ['$scope', '$http', function($scope, $http) {
	
}]);﻿

app.controller('guestBookController', ['$scope', '$http', function($scope, $http) {
	
}]);﻿

app.controller('donationsController', ['$scope', '$http', function($scope, $http) {
	
}]);﻿

app.config(function ($routeProvider) {
	$routeProvider
		.when('/guestBook', {
		templateUrl: 'guestBook.html',
		controller: 'guestBookController',
		controllerAs:'guestBook'
	})
		.when('/donations', {
		templateUrl: 'donations.html',
		controller: 'donationsController',
		controllerAs: 'donations'
	})
		.when('/main', {
		templateUrl: 'mainGuests.html',
		controller: 'mainController',
		controllerAs: 'main'
	})
		.otherwise({
		redirectTo: '/main'
	});

});