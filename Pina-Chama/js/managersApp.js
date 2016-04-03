(function () {
    var app = angular.module('managersApp', ['ngRoute']);
    
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
    });
    app.controller('mainController', function($scope) {
        
    });
    app.controller('guidesController', function($scope) {
        
    });
    app.controller('stockController', function($scope) {
        
    });
    app.controller('databaseController', function($scope) {
        
    });
    app.controller('arrangementController', function($scope) {
        
    });
    app.controller('guestBookController', function($scope) {
        
    });
    
    app.config(function ($routeProvider) {
        $routeProvider
            .when('/guestBook', {
            templateUrl: 'guestBook.html',
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
})();