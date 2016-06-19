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

var stocksPinaList;
var stocksBakeryList;
var stocksFalafelList;

var videos;

var user;

var app = angular.module('bakeryApp', ['ngRoute']);

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
		$("#lblId").show();
		$("#id").show();
		$scope.required.id = true;
		$("#data8").show();
		$("#data9").show();
		$("#Comments").prop("placeholder", "נא למלא בשדה זה את תפקידך בקבוצת האפיה.");
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
	$("#navTab4").click(function(){
		$(".activeTab").prop('class','navTabs');
		$("#navTab4").prop('class','activeTab');
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
			userType: 'bakery'
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
		$http.get('/bakeryMessages').success(function(response) {
			$scope.messages = response;
			
			messages = $scope.messages;
		});

		$http.get('/bakeryPosts').success(function(response) {
			$scope.posts = response;
			
			posts = $scope.posts;
		});

		$scope.refresh();
	};

	//initial load
	$scope.loadMessagesDB();
}]);﻿

app.controller('guidesController', ['$scope', '$http', function($scope, $http) {
	$scope.loadData = function () {
		$http.get('/refresh').success(function(response) {
			$scope.videos = videos;
		});
	};
	
	$scope.loadVideos = function() {
		$http.get('/loadVideos/' + userInfo.userType).success(function(response) {
			$scope.videos = response;
			
			videos = $scope.videos;
		});
		$scope.loadData();
	};
	
	$scope.loadVideos();
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
		templateUrl: 'mainBakery.html',
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