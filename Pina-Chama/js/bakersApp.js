var userInfo = {
	googleId: '',
	fullName: '',
	userType: '',
	phoneNumber: ''
};

var messages;
var posts;

var guestPosts;
var pagesNum;

var user;

var sunCakes;
var monCakes;
var tueCakes;
var wedCakes;
var thuCakes;

var app = angular.module('bakersApp', ['ngRoute']);

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
	$http.get('/getUserInfo').success(function(response) {
		userInfo.googleId = response.googleId;
		userInfo.fullName = response.fullName;
		userInfo.userType = response.userType;
		userInfo.phoneNumber = response.phoneNumber;
		
		$("#userName").html(userInfo.fullName);
	});
	
	$scope.signOut = function() {
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
		$("#lblId").hide();
		$("#id").hide();
		$scope.required.id = false;
		$("#data8").show();
		$("#data9").show();
		$("#Comments").prop("placeholder", "במידה והינך מתנדב קבוע נא לציין את תאריך ההתנדבות.");
		$("#data10").hide();
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
			$("#prev").css("-moz-opacity", "0.4");
			$("#prev").css("opacity", ".40");
			$("#prev").css("filter", "alpha(opacity=40)");
			$("#prev").prop("disabled", true);
			$("#prev").css("cursor", "default");
			$("#prev").prop("title", "תחילת הספר");
		} else {
			$("#prev").css("-moz-opacity", "1");
			$("#prev").css("opacity", "1");
			$("#prev").css("filter", "alpha(opacity=100)");
			$("#prev").prop("disabled", false);
			$("#prev").css("cursor", "pointer"); 
			$("#prev").prop("title", "עמוד קודם");
		}

		if (($scope.currentPage === pagesNum) || ($scope.currentPage === (pagesNum-1)) || (pagesNum === -1)){
			$("#next").css("-moz-opacity", "0.4");
			$("#next").css("opacity", ".40");
			$("#next").css("filter", "alpha(opacity=40)");
			$("#next").prop("disabled", true);
			$("#next").css("cursor", "default"); 
			$("#next").prop("title", "סוף הספר");
		} else {
			$("#next").css("-moz-opacity", "1");
			$("#next").css("opacity", "1");
			$("#next").css("filter", "alpha(opacity=100)");
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

app.controller('mainController', ['$scope', '$http', function($scope, $http) {
	$("#mainBody").hide();
	
	$scope.redirection = function () {
		var path = '/home.html';
		
		window.location.replace(path);
	}
	
	$scope.loadPage = function () {
		var info = {
			userType: 'baker'
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
	$scope.required = {
		cakeDate: true,
		phoneNumber: true,
		cake: true
	};
	
	$scope.cakeRequest = {
		applicantName: userInfo.fullName,
		applicantPhoneNumber: userInfo.phoneNumber
	};
	
	//load the cakes arrangement from the database.
	$scope.refresh = function () {
		$http.get('/refresh').success(function(response) {
			$scope.sunCakes = sunCakes;
			$scope.monCakes = monCakes;
			$scope.tueCakes = tueCakes;
			$scope.wedCakes = wedCakes;
			$scope.thuCakes = thuCakes;
		});
	};
	
	$scope.loadCakesDB = function() {
		$http.get('/bakersCakes/Sun').success(function(response) {
			$scope.sunCakes = response;
			
			sunCakes = $scope.sunCakes;
		});
		
		$http.get('/bakersCakes/Mon').success(function(response) {
			$scope.monCakes = response;
			
			monCakes = $scope.monCakes;
		});
		
		$http.get('/bakersCakes/Tue').success(function(response) {
			$scope.tueCakes = response;
			
			tueCakes = $scope.tueCakes;
		});
		
		$http.get('/bakersCakes/Wed').success(function(response) {
			$scope.wedCakes = response;
			
			wedCakes = $scope.wedCakes;
		});
		
		$http.get('/bakersCakes/Thu').success(function(response) {
			$scope.thuCakes = response;
			
			thuCakes = $scope.thuCakes;
			
			$scope.refresh();
		});
	};
	
	$scope.resetsFields = function() {
		$scope.cakeRequest.cakeDate = '';
		$scope.cakeRequest.cake = '';
		$scope.cakeRequest.comments = '';
		$scope.cakeRequest.applicantName = userInfo.fullName;
		$scope.cakeRequest.applicantPhoneNumber = userInfo.phoneNumber;
		$scope.cakeRequest.requestDate = '';
	};
	
	//initial load
	$scope.loadCakesDB();
	
	$scope.addRequest = function() {
		$scope.cakeRequest.requestDate = new Date();
		
		$http.post('/bakersCakeRequest', $scope.cakeRequest).success(function(response) {
			$scope.loadCakesDB();
			$scope.resetsFields();
			$('#mainTab')[0].click();
		});
	};
	
	$scope.submitForm = function() {
		// check to make sure the form is completely valid
		if ($scope.requestForm.$valid) {
			$scope.addRequest();
		}
	};
}]);﻿

app.controller('aboutCotroller', ['$scope', '$http', function($scope, $http) {
	$("#homeButton").hide();
}]);

app.controller('contactUsCotroller', ['$scope', '$http', function($scope, $http) {
	$("#homeButton").hide();
}]);

app.controller('QandACotroller', ['$scope', '$http', function($scope, $http) {
	$("#homeButton").hide();
}]);

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
		.when('/personalDetails', {
		templateUrl: '../general/personalDetails.html',
		controller: 'personalDetailsContreoller',
		controllerAs: 'personalDetails'
	})
		.when('/main', {
		templateUrl: 'mainBakers.html',
		controller: 'mainController',
		controllerAs: 'main'
	})
		.when('/contactUs', {
		templateUrl: '../contactUs.html',
		controller: 'contactUsCotroller',
		controllerAs:'contactUs'
	})
		.when('/about', {
		templateUrl: '../about.html',
		controller: 'aboutCotroller',
		controllerAs:'about'
	})
		.when('/QuestionsAnswers', {
		templateUrl: '../general/QuestionsAnswers.html',
		controller: 'QandACotroller',
		controllerAs:'QandA'
	})
		.otherwise({
		redirectTo: '/main'
	});

});