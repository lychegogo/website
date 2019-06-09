(function(){
	var eyeCtrl=angular.module('eyeviewControllers',[]);
		eyeCtrl.controller('workListCtrl',['$scope','$http',workListCtrl]);
		eyeCtrl.controller('workListCtrl',['$scope','$http',workDetailCtrl]);
	function workListCtrl($scope, Work){
		$scope.works=Work.query();
	};
	function workDetailCtrl($scope,$routeParams,Work){
		$scope.work=Phone.get({workId:$routeParams.workId});
	};
})();
