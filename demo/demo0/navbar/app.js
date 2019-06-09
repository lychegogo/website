'use strict';
(function(){
    angular
        .module('navbar',['ui.router'])
        .config(['$stateProvider', '$urlRouterProvider',urlProvider])
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        });
    function urlProvider($stateProvider,$urlRouterProvider){
        $stateProvider
        .state('index',{
            url:'/index',
            templateUrl:'index.html'
        })
        .state('login',{
            url:'/login',
            templateUrl:'works/partials/shilog.html'
        })
        .state('registion',{
            url:'/registion',
            templateUrl:'works/partials/shires.html'
        })
    }
        
})();