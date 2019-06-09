(function(){
	angular
		.module('eyeviewServices',['ngResource'])
		.factory('Work',['$resource',Work]);
	function Work($resource){
		return	$resource('works/:workId.json',{},{
			query:{method:''GET,params:{workId:'works',isArray:true}
		});
	};
})();