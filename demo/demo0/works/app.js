'use strict';
(function(){
	angular
		.module('eyeview',[
			'ngRoute',
			'eyeviewControllers',
			'eyeviewServices',
			'navbar'
		])
		.config(['$routeProvider',routeProvider])
		.config(function($interpolateProvider) {
		    $interpolateProvider.startSymbol('[[');
		    $interpolateProvider.endSymbol(']]');
		});
	function routeProvider($routeProvider){
		$routeProvider.
		when('/works',{
			templateUrl:'works/partials/work-list.html',
			controller:'workListCtrl'
		}).
		when('/works/:workId',{
			templateUrl:'works/partials/work-detail.html',
			controller:'workDetailCtrl'
		}).
		otherwise({
			redirectTo:'/works'
		});		
	}
})();