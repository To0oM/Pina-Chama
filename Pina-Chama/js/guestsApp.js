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

var app = angular.module('guestsApp', ['ngRoute']);

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
		$("#data8").hide();
		$("#data9").show();
		$("#Comments").prop("placeholder", "נא למלא בשדה זה:\nמהיכן הקבוצה, איש קשר\\מדריך, מס' משתתפים, גילאים ומטרת הביקור.");
		$("#data10").hide();
		$("#data11").show();
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

app.controller('mainController', ['$scope', '$http', function($scope, $http) {
	$("#mainBody").hide();
	
	$scope.redirection = function () {
		var path = '/home.html';
		
		window.location.replace(path);
	}
	
	$scope.loadPage = function () {
		var info = {
			userType: 'guest'
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
		$http.get('/guestsMessages').success(function(response) {
			$scope.messages = response;
			
			messages = $scope.messages;
		});

		$http.get('/guestsPosts').success(function(response) {
			$scope.posts = response;
			
			posts = $scope.posts;
		});

		$scope.refresh();
	};

	//initial load
	$scope.loadMessagesDB();
}]);﻿

app.controller('guestBookController', ['$scope', '$http', function($scope, $http) {
	$scope.required = {
		content: true,
		topic: true
	};
	
	$scope.guestPost = {
		topic: '',
		content: ''
	};
	
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
	
	//handle the guest book's 'prev' and 'next' buttons.
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
	
	$("#addGuestPostDiv").hide();
	$("#fade").hide();
	
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
	
	$scope.newGuestPost = function(){
		var windowHeight = $(document).height();
		$('.black_overlay').css('height', windowHeight);
		
		$("#addGuestPostDiv").fadeIn();
		$("#fade").fadeIn();

		$scope.guestPost.topic = '';
		$scope.guestPost.content = '';
		$scope.guestPost.publishName = '';
	};

	$scope.close = function(){
		$("#addGuestPostDiv").fadeOut();
		$("#fade").fadeOut();
	};

	$scope.addGuestPost = function() {
		$scope.guestPost.publicationDate = new Date();
		
		$scope.getLastInsertion();
		pagesNum++;
		$scope.guestPost.pageNum = pagesNum;
		
		//directing to the latest page, with the new post.
		if (pagesNum%2 === 0){
			$scope.currentPage = pagesNum;
		} else {
			$scope.currentPage = pagesNum-1;
		}
		
		$http.post('/guestPost', $scope.guestPost).success(function(response) {
			$scope.loadGuestPostsDB();
		});
	};
	
	$scope.submitGuestPostForm = function() {
		// check to make sure the form is completely valid
		if ($scope.guestPostForm.$valid) {
			$scope.addGuestPost();
			$scope.close();
		}
	};
	
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

app.controller('donationsController', ['$scope', '$http', function($scope, $http) {
	
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
		.when('/donations', {
		templateUrl: 'donations.html',
		controller: 'donationsController',
		controllerAs: 'donations'
	})
		.when('/personalDetails', {
		templateUrl: '../general/personalDetails.html',
		controller: 'personalDetailsContreoller',
		controllerAs: 'personalDetails'
	})
		.when('/main', {
		templateUrl: 'mainGuests.html',
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