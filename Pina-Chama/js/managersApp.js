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

var sunShifts;
var monShifts;
var tueShifts;
var wedShifts;
var thuShifts;
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
			
			if($scope.usersList === undefined) {
				$(".sendEmailsButton").hide();
				$(".exportButton").hide();
				$(".emailTxt").hide();
			}
		});
	};
	
	$scope.loadManagrsDB = function() {
		$http.get('/managersDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר אחראים';
			
			title = $scope.title;
			usersList = $scope.usersList;
			
			if($scope.usersList.length === 0) {
				$(".sendEmailsButton").hide();
				$(".exportButton").hide();
				$(".emailTxt").hide();
			}
		});
		$scope.loadData();
	};
	
	$scope.loadVolunteersDB = function() {
		$http.get('/volunteersDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר מתנדבים';
			
			title = $scope.title;
			usersList = $scope.usersList;
			
			if($scope.usersList.length === 0) {
				$(".sendEmailsButton").hide();
				$(".exportButton").hide();
				$(".emailTxt").hide();
			}
		});
		$scope.loadData();
	};
	
	$scope.loadGuestsDB = function() {
		$http.get('/guestsDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר אורחים';
			
			title = $scope.title;
			usersList = $scope.usersList;
			
			if($scope.usersList.length === 0) {
				$(".sendEmailsButton").hide();
				$(".exportButton").hide();
				$(".emailTxt").hide();
			}
		});
		$scope.loadData();
	};
	
	$scope.loadBakeryDB = function() {
		$http.get('/bakeryDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר חדר אפיה';
			
			title = $scope.title;
			usersList = $scope.usersList;
			
			if($scope.usersList.length === 0) {
				$(".sendEmailsButton").hide();
				$(".exportButton").hide();
				$(".emailTxt").hide();
			}
		});
		$scope.loadData();
	};
	
	$scope.loadBakersDB = function() {
		$http.get('/bakersDB').success(function(response) {
			$scope.usersList = response;
			$scope.title = 'מאגר אופי עוגות';
			
			title = $scope.title;
			usersList = $scope.usersList;
			
			if($scope.usersList.length === 0) {
				$(".sendEmailsButton").hide();
				$(".exportButton").hide();
				$(".emailTxt").hide();
			}
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
	
	$scope.exportData = function () {
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Report.xls");
    };
	
	$scope.sendEmail = function () {
		var mailAdrress = "";
		for(var i=0; i<$scope.usersList.length; i++)
		{
			if($scope.usersList[i].active === "פעיל")
			{
				mailAdrress += $scope.usersList[i].email;
				if(i != $scope.usersList.length - 1)
					mailAdrress += ",";
			}
		}
		
		window.location.replace("mailto:"+mailAdrress);
	};
}]);﻿

app.controller('arrangementController', ['$scope', '$http', function($scope, $http) {
	//load the shifts, cakes, cakeRequests and shiftRequests from the database.
	$scope.refresh = function () {
		$http.get('/refresh').success(function(response) {
			$scope.sunShifts = sunShifts;
			$scope.monShifts = monShifts;
			$scope.tueShifts = tueShifts;
			$scope.wedShifts = wedShifts;
			$scope.thuShifts = thuShifts;
			$scope.shiftRequests = shiftRequests;
			
			$scope.sunCakes = sunCakes;
			$scope.monCakes = monCakes;
			$scope.tueCakes = tueCakes;
			$scope.wedCakes = wedCakes;
			$scope.thuCakes = thuCakes;
			$scope.cakeRequests = cakeRequests;
			
			$scope.classSet(1);
			$scope.classSet(2);
			$scope.classSet(3);
			$scope.classSet(4);
			$scope.classSet(5);
		});
	};
	
	$scope.loadShiftsRequestsDB = function() {
		$http.get('/managersShiftsRequests').success(function(response) {
			$scope.shiftRequests = response;
			
			shiftRequests = $scope.shiftRequests;
			
			//make a fake server call to make a little delay for the refresh call.
			$http.get('/refresh').success(function(response) {
				$scope.refresh();
			});
		});
	};
	
	$scope.loadShiftsDB = function() {
		$http.get('/volunteersShifts/Sun').success(function(response) {
			$scope.sunShifts = response;
			
			sunShifts = $scope.sunShifts;
		});
		
		$http.get('/volunteersShifts/Mon').success(function(response) {
			$scope.monShifts = response;
			
			monShifts = $scope.monShifts;
		});
		
		$http.get('/volunteersShifts/Tue').success(function(response) {
			$scope.tueShifts = response;
			
			tueShifts = $scope.tueShifts;
		});
		
		$http.get('/volunteersShifts/Wed').success(function(response) {
			$scope.wedShifts = response;
			
			wedShifts = $scope.wedShifts;
		});
		
		$http.get('/volunteersShifts/Thu').success(function(response) {
			$scope.thuShifts = response;
			
			thuShifts = $scope.thuShifts;
			
			$scope.loadShiftsRequestsDB();
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
			
			$http.get('/managersCakesRequests').success(function(response) {
				$scope.cakeRequests = response;
				
				cakeRequests = $scope.cakeRequests;
				
				//make a fake server call to make a little delay for the refresh call.
				$http.get('/refresh').success(function(response) {
					$scope.refresh();
				});
			});
		});
	};
	
	//initial load
	$scope.loadShiftsDB();
	$scope.loadCakesDB();
	
	$scope.editShift = function(updateShifts){
		$http.put('/saveShifts/' + updateShifts.currentDay, updateShifts).success(function(response) {
			$scope.loadShiftsDB();
		});
	};
	
	$scope.classSet = function(dayNum){
		switch (dayNum) {
			case 1:
				if($scope.sunShifts.firstShift.volunteer1Name === ''){
					$("#sunFirstVol1").toggleClass("shift-success", false);
					$("#sunFirstVol1").toggleClass("shift-danger", true);
				}else{
					$("#sunFirstVol1").toggleClass("shift-success", true);
					$("#sunFirstVol1").toggleClass("shift-danger", false);
				}
				if($scope.sunShifts.firstShift.volunteer2Name === ''){
					$("#sunFirstVol2").toggleClass("shift-success", false);
					$("#sunFirstVol2").toggleClass("shift-danger", true);
				}else{
					$("#sunFirstVol2").toggleClass("shift-success", true);
					$("#sunFirstVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.sunShifts.secondShift.volunteer1Name === ''){
					$("#sunSecondVol1").toggleClass("shift-success", false);
					$("#sunSecondVol1").toggleClass("shift-danger", true);
				}else{
					$("#sunSecondVol1").toggleClass("shift-success", true);
					$("#sunSecondVol1").toggleClass("shift-danger", false);
				}
				if($scope.sunShifts.secondShift.volunteer2Name === ''){
					$("#sunSecondVol2").toggleClass("shift-success", false);
					$("#sunSecondVol2").toggleClass("shift-danger", true);
				}else{
					$("#sunSecondVol2").toggleClass("shift-success", true);
					$("#sunSecondVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.sunShifts.thirdShift.volunteer1Name === ''){
					$("#sunThirdVol1").toggleClass("shift-success", false);
					$("#sunThirdVol1").toggleClass("shift-danger", true);
				}else{
					$("#sunThirdVol1").toggleClass("shift-success", true);
					$("#sunThirdVol1").toggleClass("shift-danger", false);
				}
				if($scope.sunShifts.thirdShift.volunteer2Name === ''){
					$("#sunThirdVol2").toggleClass("shift-success", false);
					$("#sunThirdVol2").toggleClass("shift-danger", true);
				}else{
					$("#sunThirdVol2").toggleClass("shift-success", true);
					$("#sunThirdVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.sunShifts.fourthShift.volunteer1Name === ''){
					$("#sunFourthVol1").toggleClass("shift-success", false);
					$("#sunFourthVol1").toggleClass("shift-danger", true);
				}else{
					$("#sunFourthVol1").toggleClass("shift-success", true);
					$("#sunFourthVol1").toggleClass("shift-danger", false);
				}
				if($scope.sunShifts.fourthShift.volunteer2Name === ''){
					$("#sunFourthVol2").toggleClass("shift-success", false);
					$("#sunFourthVol2").toggleClass("shift-danger", true);
				}else{
					$("#sunFourthVol2").toggleClass("shift-success", true);
					$("#sunFourthVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.sunShifts.fifthShift.volunteer1Name === ''){
					$("#sunFifthVol1").toggleClass("shift-success", false);
					$("#sunFifthVol1").toggleClass("shift-danger", true);
				}else{
					$("#sunFifthVol1").toggleClass("shift-success", true);
					$("#sunFifthVol1").toggleClass("shift-danger", false);
				}
				if($scope.sunShifts.fifthShift.volunteer2Name === ''){
					$("#sunFifthVol2").toggleClass("shift-success", false);
					$("#sunFifthVol2").toggleClass("shift-danger", true);
				}else{
					$("#sunFifthVol2").toggleClass("shift-success", true);
					$("#sunFifthVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.sunShifts.sixthShift.volunteer1Name === ''){
					$("#sunSixthVol1").toggleClass("shift-success", false);
					$("#sunSixthVol1").toggleClass("shift-danger", true);
				}else{
					$("#sunSixthVol1").toggleClass("shift-success", true);
					$("#sunSixthVol1").toggleClass("shift-danger", false);
				}
				if($scope.sunShifts.sixthShift.volunteer2Name === ''){
					$("#sunSixthVol2").toggleClass("shift-success", false);
					$("#sunSixthVol2").toggleClass("shift-danger", true);
				}else{
					$("#sunSixthVol2").toggleClass("shift-success", true);
					$("#sunSixthVol2").toggleClass("shift-danger", false);
				}
				break;
			case 2:
				if($scope.monShifts.firstShift.volunteer1Name === ''){
					$("#monFirstVol1").toggleClass("shift-success", false);
					$("#monFirstVol1").toggleClass("shift-danger", true);
				}else{
					$("#monFirstVol1").toggleClass("shift-success", true);
					$("#monFirstVol1").toggleClass("shift-danger", false);
				}
				if($scope.monShifts.firstShift.volunteer2Name === ''){
					$("#monFirstVol2").toggleClass("shift-success", false);
					$("#monFirstVol2").toggleClass("shift-danger", true);
				}else{
					$("#monFirstVol2").toggleClass("shift-success", true);
					$("#monFirstVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.monShifts.secondShift.volunteer1Name === ''){
					$("#monSecondVol1").toggleClass("shift-success", false);
					$("#monSecondVol1").toggleClass("shift-danger", true);
				}else{
					$("#monSecondVol1").toggleClass("shift-success", true);
					$("#monSecondVol1").toggleClass("shift-danger", false);
				}
				if($scope.monShifts.secondShift.volunteer2Name === ''){
					$("#monSecondVol2").toggleClass("shift-success", false);
					$("#monSecondVol2").toggleClass("shift-danger", true);
				}else{
					$("#monSecondVol2").toggleClass("shift-success", true);
					$("#monSecondVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.monShifts.thirdShift.volunteer1Name === ''){
					$("#monThirdVol1").toggleClass("shift-success", false);
					$("#monThirdVol1").toggleClass("shift-danger", true);
				}else{
					$("#monThirdVol1").toggleClass("shift-success", true);
					$("#monThirdVol1").toggleClass("shift-danger", false);
				}
				if($scope.monShifts.thirdShift.volunteer2Name === ''){
					$("#monThirdVol2").toggleClass("shift-success", false);
					$("#monThirdVol2").toggleClass("shift-danger", true);
				}else{
					$("#monThirdVol2").toggleClass("shift-success", true);
					$("#monThirdVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.monShifts.fourthShift.volunteer1Name === ''){
					$("#monFourthVol1").toggleClass("shift-success", false);
					$("#monFourthVol1").toggleClass("shift-danger", true);
				}else{
					$("#monFourthVol1").toggleClass("shift-success", true);
					$("#monFourthVol1").toggleClass("shift-danger", false);
				}
				if($scope.monShifts.fourthShift.volunteer2Name === ''){
					$("#monFourthVol2").toggleClass("shift-success", false);
					$("#monFourthVol2").toggleClass("shift-danger", true);
				}else{
					$("#monFourthVol2").toggleClass("shift-success", true);
					$("#monFourthVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.monShifts.fifthShift.volunteer1Name === ''){
					$("#monFifthVol1").toggleClass("shift-success", false);
					$("#monFifthVol1").toggleClass("shift-danger", true);
				}else{
					$("#monFifthVol1").toggleClass("shift-success", true);
					$("#monFifthVol1").toggleClass("shift-danger", false);
				}
				if($scope.monShifts.fifthShift.volunteer2Name === ''){
					$("#monFifthVol2").toggleClass("shift-success", false);
					$("#monFifthVol2").toggleClass("shift-danger", true);
				}else{
					$("#monFifthVol2").toggleClass("shift-success", true);
					$("#monFifthVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.monShifts.sixthShift.volunteer1Name === ''){
					$("#monSixthVol1").toggleClass("shift-success", false);
					$("#monSixthVol1").toggleClass("shift-danger", true);
				}else{
					$("#monSixthVol1").toggleClass("shift-success", true);
					$("#monSixthVol1").toggleClass("shift-danger", false);
				}
				if($scope.monShifts.sixthShift.volunteer2Name === ''){
					$("#monSixthVol2").toggleClass("shift-success", false);
					$("#monSixthVol2").toggleClass("shift-danger", true);
				}else{
					$("#monSixthVol2").toggleClass("shift-success", true);
					$("#monSixthVol2").toggleClass("shift-danger", false);
				}
				break;
			case 3:
				if($scope.tueShifts.firstShift.volunteer1Name === ''){
					$("#tueFirstVol1").toggleClass("shift-success", false);
					$("#tueFirstVol1").toggleClass("shift-danger", true);
				}else{
					$("#tueFirstVol1").toggleClass("shift-success", true);
					$("#tueFirstVol1").toggleClass("shift-danger", false);
				}
				if($scope.tueShifts.firstShift.volunteer2Name === ''){
					$("#tueFirstVol2").toggleClass("shift-success", false);
					$("#tueFirstVol2").toggleClass("shift-danger", true);
				}else{
					$("#tueFirstVol2").toggleClass("shift-success", true);
					$("#tueFirstVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.tueShifts.secondShift.volunteer1Name === ''){
					$("#tueSecondVol1").toggleClass("shift-success", false);
					$("#tueSecondVol1").toggleClass("shift-danger", true);
				}else{
					$("#tueSecondVol1").toggleClass("shift-success", true);
					$("#tueSecondVol1").toggleClass("shift-danger", false);
				}
				if($scope.tueShifts.secondShift.volunteer2Name === ''){
					$("#tueSecondVol2").toggleClass("shift-success", false);
					$("#tueSecondVol2").toggleClass("shift-danger", true);
				}else{
					$("#tueSecondVol2").toggleClass("shift-success", true);
					$("#tueSecondVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.tueShifts.thirdShift.volunteer1Name === ''){
					$("#tueThirdVol1").toggleClass("shift-success", false);
					$("#tueThirdVol1").toggleClass("shift-danger", true);
				}else{
					$("#tueThirdVol1").toggleClass("shift-success", true);
					$("#tueThirdVol1").toggleClass("shift-danger", false);
				}
				if($scope.tueShifts.thirdShift.volunteer2Name === ''){
					$("#tueThirdVol2").toggleClass("shift-success", false);
					$("#tueThirdVol2").toggleClass("shift-danger", true);
				}else{
					$("#tueThirdVol2").toggleClass("shift-success", true);
					$("#tueThirdVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.tueShifts.fourthShift.volunteer1Name === ''){
					$("#tueFourthVol1").toggleClass("shift-success", false);
					$("#tueFourthVol1").toggleClass("shift-danger", true);
				}else{
					$("#tueFourthVol1").toggleClass("shift-success", true);
					$("#tueFourthVol1").toggleClass("shift-danger", false);
				}
				if($scope.tueShifts.fourthShift.volunteer2Name === ''){
					$("#tueFourthVol2").toggleClass("shift-success", false);
					$("#tueFourthVol2").toggleClass("shift-danger", true);
				}else{
					$("#tueFourthVol2").toggleClass("shift-success", true);
					$("#tueFourthVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.tueShifts.fifthShift.volunteer1Name === ''){
					$("#tueFifthVol1").toggleClass("shift-success", false);
					$("#tueFifthVol1").toggleClass("shift-danger", true);
				}else{
					$("#tueFifthVol1").toggleClass("shift-success", true);
					$("#tueFifthVol1").toggleClass("shift-danger", false);
				}
				if($scope.tueShifts.fifthShift.volunteer2Name === ''){
					$("#tueFifthVol2").toggleClass("shift-success", false);
					$("#tueFifthVol2").toggleClass("shift-danger", true);
				}else{
					$("#tueFifthVol2").toggleClass("shift-success", true);
					$("#tueFifthVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.tueShifts.sixthShift.volunteer1Name === ''){
					$("#tueSixthVol1").toggleClass("shift-success", false);
					$("#tueSixthVol1").toggleClass("shift-danger", true);
				}else{
					$("#tueSixthVol1").toggleClass("shift-success", true);
					$("#tueSixthVol1").toggleClass("shift-danger", false);
				}
				if($scope.tueShifts.sixthShift.volunteer2Name === ''){
					$("#tueSixthVol2").toggleClass("shift-success", false);
					$("#tueSixthVol2").toggleClass("shift-danger", true);
				}else{
					$("#tueSixthVol2").toggleClass("shift-success", true);
					$("#tueSixthVol2").toggleClass("shift-danger", false);
				}
				break;
			case 4:
				if($scope.wedShifts.firstShift.volunteer1Name === ''){
					$("#wedFirstVol1").toggleClass("shift-success", false);
					$("#wedFirstVol1").toggleClass("shift-danger", true);
				}else{
					$("#wedFirstVol1").toggleClass("shift-success", true);
					$("#wedFirstVol1").toggleClass("shift-danger", false);
				}
				if($scope.wedShifts.firstShift.volunteer2Name === ''){
					$("#wedFirstVol2").toggleClass("shift-success", false);
					$("#wedFirstVol2").toggleClass("shift-danger", true);
				}else{
					$("#wedFirstVol2").toggleClass("shift-success", true);
					$("#wedFirstVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.wedShifts.secondShift.volunteer1Name === ''){
					$("#wedSecondVol1").toggleClass("shift-success", false);
					$("#wedSecondVol1").toggleClass("shift-danger", true);
				}else{
					$("#wedSecondVol1").toggleClass("shift-success", true);
					$("#wedSecondVol1").toggleClass("shift-danger", false);
				}
				if($scope.wedShifts.secondShift.volunteer2Name === ''){
					$("#wedSecondVol2").toggleClass("shift-success", false);
					$("#wedSecondVol2").toggleClass("shift-danger", true);
				}else{
					$("#wedSecondVol2").toggleClass("shift-success", true);
					$("#wedSecondVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.wedShifts.thirdShift.volunteer1Name === ''){
					$("#wedThirdVol1").toggleClass("shift-success", false);
					$("#wedThirdVol1").toggleClass("shift-danger", true);
				}else{
					$("#wedThirdVol1").toggleClass("shift-success", true);
					$("#wedThirdVol1").toggleClass("shift-danger", false);
				}
				if($scope.wedShifts.thirdShift.volunteer2Name === ''){
					$("#wedThirdVol2").toggleClass("shift-success", false);
					$("#wedThirdVol2").toggleClass("shift-danger", true);
				}else{
					$("#wedThirdVol2").toggleClass("shift-success", true);
					$("#wedThirdVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.wedShifts.fourthShift.volunteer1Name === ''){
					$("#wedFourthVol1").toggleClass("shift-success", false);
					$("#wedFourthVol1").toggleClass("shift-danger", true);
				}else{
					$("#wedFourthVol1").toggleClass("shift-success", true);
					$("#wedFourthVol1").toggleClass("shift-danger", false);
				}
				if($scope.wedShifts.fourthShift.volunteer2Name === ''){
					$("#wedFourthVol2").toggleClass("shift-success", false);
					$("#wedFourthVol2").toggleClass("shift-danger", true);
				}else{
					$("#wedFourthVol2").toggleClass("shift-success", true);
					$("#wedFourthVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.wedShifts.fifthShift.volunteer1Name === ''){
					$("#wedFifthVol1").toggleClass("shift-success", false);
					$("#wedFifthVol1").toggleClass("shift-danger", true);
				}else{
					$("#wedFifthVol1").toggleClass("shift-success", true);
					$("#wedFifthVol1").toggleClass("shift-danger", false);
				}
				if($scope.wedShifts.fifthShift.volunteer2Name === ''){
					$("#wedFifthVol2").toggleClass("shift-success", false);
					$("#wedFifthVol2").toggleClass("shift-danger", true);
				}else{
					$("#wedFifthVol2").toggleClass("shift-success", true);
					$("#wedFifthVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.wedShifts.sixthShift.volunteer1Name === ''){
					$("#wedSixthVol1").toggleClass("shift-success", false);
					$("#wedSixthVol1").toggleClass("shift-danger", true);
				}else{
					$("#wedSixthVol1").toggleClass("shift-success", true);
					$("#wedSixthVol1").toggleClass("shift-danger", false);
				}
				if($scope.wedShifts.sixthShift.volunteer2Name === ''){
					$("#wedSixthVol2").toggleClass("shift-success", false);
					$("#wedSixthVol2").toggleClass("shift-danger", true);
				}else{
					$("#wedSixthVol2").toggleClass("shift-success", true);
					$("#wedSixthVol2").toggleClass("shift-danger", false);
				}
				break;
			case 5:
				if($scope.thuShifts.firstShift.volunteer1Name === ''){
					$("#thuFirstVol1").toggleClass("shift-success", false);
					$("#thuFirstVol1").toggleClass("shift-danger", true);
				}else{
					$("#thuFirstVol1").toggleClass("shift-success", true);
					$("#thuFirstVol1").toggleClass("shift-danger", false);
				}
				if($scope.thuShifts.firstShift.volunteer2Name === ''){
					$("#thuFirstVol2").toggleClass("shift-success", false);
					$("#thuFirstVol2").toggleClass("shift-danger", true);
				}else{
					$("#thuFirstVol2").toggleClass("shift-success", true);
					$("#thuFirstVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.thuShifts.secondShift.volunteer1Name === ''){
					$("#thuSecondVol1").toggleClass("shift-success", false);
					$("#thuSecondVol1").toggleClass("shift-danger", true);
				}else{
					$("#thuSecondVol1").toggleClass("shift-success", true);
					$("#thuSecondVol1").toggleClass("shift-danger", false);
				}
				if($scope.thuShifts.secondShift.volunteer2Name === ''){
					$("#thuSecondVol2").toggleClass("shift-success", false);
					$("#thuSecondVol2").toggleClass("shift-danger", true);
				}else{
					$("#thuSecondVol2").toggleClass("shift-success", true);
					$("#thuSecondVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.thuShifts.thirdShift.volunteer1Name === ''){
					$("#thuThirdVol1").toggleClass("shift-success", false);
					$("#thuThirdVol1").toggleClass("shift-danger", true);
				}else{
					$("#thuThirdVol1").toggleClass("shift-success", true);
					$("#thuThirdVol1").toggleClass("shift-danger", false);
				}
				if($scope.thuShifts.thirdShift.volunteer2Name === ''){
					$("#thuThirdVol2").toggleClass("shift-success", false);
					$("#thuThirdVol2").toggleClass("shift-danger", true);
				}else{
					$("#thuThirdVol2").toggleClass("shift-success", true);
					$("#thuThirdVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.thuShifts.fourthShift.volunteer1Name === ''){
					$("#thuFourthVol1").toggleClass("shift-success", false);
					$("#thuFourthVol1").toggleClass("shift-danger", true);
				}else{
					$("#thuFourthVol1").toggleClass("shift-success", true);
					$("#thuFourthVol1").toggleClass("shift-danger", false);
				}
				if($scope.thuShifts.fourthShift.volunteer2Name === ''){
					$("#thuFourthVol2").toggleClass("shift-success", false);
					$("#thuFourthVol2").toggleClass("shift-danger", true);
				}else{
					$("#thuFourthVol2").toggleClass("shift-success", true);
					$("#thuFourthVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.thuShifts.fifthShift.volunteer1Name === ''){
					$("#thuFifthVol1").toggleClass("shift-success", false);
					$("#thuFifthVol1").toggleClass("shift-danger", true);
				}else{
					$("#thuFifthVol1").toggleClass("shift-success", true);
					$("#thuFifthVol1").toggleClass("shift-danger", false);
				}
				if($scope.thuShifts.fifthShift.volunteer2Name === ''){
					$("#thuFifthVol2").toggleClass("shift-success", false);
					$("#thuFifthVol2").toggleClass("shift-danger", true);
				}else{
					$("#thuFifthVol2").toggleClass("shift-success", true);
					$("#thuFifthVol2").toggleClass("shift-danger", false);
				}
				
				if($scope.thuShifts.sixthShift.volunteer1Name === ''){
					$("#thuSixthVol1").toggleClass("shift-success", false);
					$("#thuSixthVol1").toggleClass("shift-danger", true);
				}else{
					$("#thuSixthVol1").toggleClass("shift-success", true);
					$("#thuSixthVol1").toggleClass("shift-danger", false);
				}
				if($scope.thuShifts.sixthShift.volunteer2Name === ''){
					$("#thuSixthVol2").toggleClass("shift-success", false);
					$("#thuSixthVol2").toggleClass("shift-danger", true);
				}else{
					$("#thuSixthVol2").toggleClass("shift-success", true);
					$("#thuSixthVol2").toggleClass("shift-danger", false);
				}
				break;
		}
	};
	
	$scope.saveShiftsDay = function(dayNum){
		var updateShifts = {
		};
		
		switch (dayNum) {
			case 1:
				updateShifts.currentDay = "Sun";
				updateShifts.currentDayShifts = $scope.sunShifts;
				break;
			case 2:
				updateShifts.currentDay = "Mon";
				updateShifts.currentDayShifts = $scope.monShifts;
				break;
			case 3:
				updateShifts.currentDay = "Tue";
				updateShifts.currentDayShifts = $scope.tueShifts;
				break;
			case 4:
				updateShifts.currentDay = "Wed";
				updateShifts.currentDayShifts = $scope.wedShifts;
				break;
			case 5:
				updateShifts.currentDay = "Thu";
				updateShifts.currentDayShifts = $scope.thuShifts;
				break;
		}
		
		$scope.editShift(updateShifts);
	};
	
	$scope.addCake = function(updateCakes){
		if(updateCakes.currentNewCake){
			if(!updateCakes.currentNewCake.cake){
				updateCakes.currentNewCake.cake = "";
			}
			
			if(!updateCakes.currentNewCake.bakerName){
				updateCakes.currentNewCake.bakerName = "";
			}
			
			
			if (updateCakes.currentNewCake.bakerName !== ""){
				$http.put('/addCake/' + updateCakes.currentDay, updateCakes).success(function(response) {
					$scope.resetFields(updateCakes.currentDay);
					$scope.loadCakesDB();
				});
			}
		}
	};
	
	$scope.resetFields = function(currentDay){
		switch (currentDay) {
			case "Sun":
				$scope.newCake.sunCakes.cake = "";
				$scope.newCake.sunCakes.bakerName = "";
				break;
			case "Mon":
				$scope.newCake.monCakes.cake = "";
				$scope.newCake.monCakes.bakerName = "";
				break;
			case "Tue":
				$scope.newCake.tueCakes.cake = "";
				$scope.newCake.tueCakes.bakerName = "";
				break;
			case "Wed":
				$scope.newCake.wedCakes.cake = "";
				$scope.newCake.wedCakes.bakerName = "";
				break;
			case "Thu":
				$scope.newCake.thuCakes.cake = "";
				$scope.newCake.thuCakes.bakerName = "";
				break;
		}
	};
	
	$scope.addBaker = function(dayNum){
		var updateCakes = {
		};
		if($scope.newCake){
			switch (dayNum) {
				case 1:
					updateCakes.currentDay = "Sun";
					updateCakes.currentNewCake = $scope.newCake.sunCakes;
					break;
				case 2:
					updateCakes.currentDay = "Mon";
					updateCakes.currentNewCake = $scope.newCake.monCakes;
					break;
				case 3:
					updateCakes.currentDay = "Tue";
					updateCakes.currentNewCake = $scope.newCake.tueCakes;
					break;
				case 4:
					updateCakes.currentDay = "Wed";
					updateCakes.currentNewCake = $scope.newCake.wedCakes;
					break;
				case 5:
					updateCakes.currentDay = "Thu";
					updateCakes.currentNewCake = $scope.newCake.thuCakes;
					break;
			}
			
			$scope.addCake(updateCakes);
		}
	};
	
	$scope.removeShiftRequest = function(id) {
		swal({
			title: "מחיקת בקשה למשמרת",
			text: "האם אתה בטוח שברצונך למחוק בקשה זו?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "כן, מחק!",
			closeOnConfirm: false,
			html: false
		}, function(){
			$http.delete('/shiftRequest/' + id).success(function(response) {
				$scope.loadShiftsRequestsDB();
			});
			swal("הבקשה נמחקה!",
			"בקשה זו הוסרה מרשימת הבקשות",
			"success");
		});
	};
	
	$scope.removeBaker = function(id) {
		swal({
			title: "מחיקת אופה",
			text: "האם אתה בטוח שברצונך למחוק אופה זה?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "כן, מחק!",
			closeOnConfirm: false,
			html: false
		}, function(){
			$http.delete('/baker/' + id).success(function(response) {
				$scope.loadCakesDB();
			});
			swal("נמחק!",
			"אופה זה הוסר מרשימת האופים",
			"success");
		});
	};
	
	$scope.removeCakeRequest = function(id) {
		swal({
			title: "מחיקת בקשה לסיפוק עוגה",
			text: "האם אתה בטוח שברצונך למחוק בקשה זו?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "כן, מחק!",
			closeOnConfirm: false,
			html: false
		}, function(){
			$http.delete('/cakeRequest/' + id).success(function(response) {
				$scope.loadCakesDB();
			});
			swal("הבקשה נמחקה!",
			"בקשה זו הוסרה מרשימת הבקשות",
			"success");
		});
	};
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
		.otherwise({
		redirectTo: '/main'
	});

});