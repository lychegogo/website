'use strict';
(function(){
    angular
        .module('monitor',[
            'ui.router',
            'sidebar'
        ])
        .config(['$stateProvider', '$urlRouterProvider',urlProvider])
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        })
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.xsrfCookieName = 'csrftoken';
            $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        }]);
    function urlProvider($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/overview');
        $urlRouterProvider.when('/overview', '/overview/live');
        $stateProvider
        .state('cpu',{
            url:'/cpu',
            templateUrl:'/static/app/cpu/cpu.html',
            controller:'cpuCtrl'
        })
        .state('memory',{
            url:'/memory',
            templateUrl:'/static/app/memory/memory.html',
            controller:'memoryCtrl'
        })
        .state('disk',{
            url:'/disk',
            templateUrl:'/static/app/disk/disk.html',
            controller:'diskCtrl'
        })
        .state('overview',{
            url:'/overview',
            templateUrl:'/static/app/overview/index.html',
        })
        .state('overview.history',{
            url:'/history',
            templateUrl:'/static/app/overview/history.html',
            controller:'historyCtrl'
        })
        .state('overview.live',{
            url:'/live',
            templateUrl:'/static/app/overview/live.html',
            controller:'liveCtrl'
        })

    }
})();