(function(){
	var eyeCtrl=angular.module('eyeviewControllers',[]);
        eyeCtrl.controller('indexCtrl',['$scope',indexCtrl]);
		eyeCtrl.controller('workListCtrl',['$scope','Work',workListCtrl]);
		eyeCtrl.controller('workDetailCtrl',['$scope','$routeParams','Work',workDetailCtrl]);
    function indexCtrl($scope){
        $scope.top = true;
        if(window.location.href.indexOf("works/") != -1){
            $scope.top = false;
        }
        console.log(window.location.href.indexOf("works/")); 
        
        $scope.$on('enterDetail',function(e,data){
            $scope.top = false;
        });
        
    }

	function workListCtrl($scope, Work){
		$scope.works=Work.query();
	};
	function workDetailCtrl($scope,$routeParams,Work){
		$scope.work=Work.get({workId:$routeParams.workId});
        $scope.$emit('enterDetail', 'false');
        /*$scope.type_list = {
            1: 'CPU',
            2: 'DISK'
        };*/
        

        // cd /d e:\task9
        // python -m SimpleHTTPServer 8088
	};
})();
