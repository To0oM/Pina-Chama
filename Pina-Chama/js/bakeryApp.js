var userInfo = {
	fullName:''
};

var app = angular.module('bakeryApp', ['ngRoute']);

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
}]);﻿

app.controller('guestBookController', ['$scope', '$http', function($scope, $http) {
	$("#cmdAdd").hide();
}]);﻿

app.controller('mainController', ['$scope', '$http', function($scope, $http) {
	
}]);﻿

app.controller('guidesController', ['$scope', '$http', function($scope, $http) {
	
}]);﻿

app.controller('stockController', ['$scope', '$http', function($scope, $http) {
	
}]);﻿

app.controller('arrangementController', ['$scope', '$http', function($scope, $http) {
	
}]);﻿

app.config(function ($routeProvider) {
	$routeProvider
		.when('/guestBook', {
		templateUrl: '../guests/guestBook.html',
		controller: 'guestBookController',
		controllerAs:'guestBook'
	})
		.when('/arrangement', {
		templateUrl: 'bakeryArrangement.html',
		controller: 'arrangementController',
		controllerAs:'arrangement'
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
		templateUrl: 'mainBakery.html',
		controller: 'mainController',
		controllerAs: 'main'
	})
		.otherwise({
		redirectTo: '/main'
	});

});