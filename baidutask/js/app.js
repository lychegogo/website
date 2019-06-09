'use strict';
(function(){
	angular
		.module('eyeview',[
			'ngRoute',
			'eyeviewControllers',
			'eyeviewServices'
		])
		.config(['$routeProvider',routeProvider]);
	function routeProvider($routeProvider){
		$routeProvider.
		when('/works',{
			templateUrl:'partials/work-list.html',
			controller:'eyeviewListCtrl'
		}).
		when('/works/:workId',{
			templateUrl:'partials/work-detail.html',
			controller:'eyeviewDetailCtrl'
		}).
		otherwise({
			redirectTo:'/works'
		});		
	}
})();