(function () {
    var app = angular.module('guestsApp', ['ngRoute']);
    
    app.controller('navContreoller', function(){
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
    });
    app.controller('mainController', function($scope) {
        
    });
    app.controller('guestBookController', function($scope) {
        
    });
    app.controller('donationsController', function($scope) {
        
    });
    
    
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
})();