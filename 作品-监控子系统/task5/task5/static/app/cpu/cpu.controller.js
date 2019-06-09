(function(){
    'use strict';
    angular
        .module('monitor')
        .controller('cpuCtrl',['$scope','$http', '$interval',cpuCtrl]);
    function cpuCtrl($scope,$http,$interval){
        // $scope.loading = true;
        var myChart = echarts.init(document.getElementById('cpu_chart'));
        var option = {
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series : [
                {
                    name:'CPU使用百分比',
                    type:'gauge',
                    detail : {formatter:'{value}%'},
                    data:[{value: 50, name: 'CPU'}]
                }
            ]
        };
        $scope.gridData = {
            pageIndex: 1,
            pageSize: 10,
            totalPages: 0,
            list: [],
            pageSizeOptions: [10,20],
            refresh: function(){
                $http.get('/get_cpu_content',{
                    'params': {
                        'pageIndex': $scope.gridData.pageIndex,
                        'pageSize': $scope.gridData.pageSize
                    }
                })
                .success(function(response){
                    $scope.loading = false;
                    console.log($scope.loading)
                    $scope.gridData.list = response.list;
                    $scope.gridData.pageIndex = response.pageIndex;
                    $scope.gridData.pageSize = response.pageSize;
                    $scope.gridData.totalCount = response.totalCount;
                    $scope.gridData.totalPages = response.totalPages;
                    if($scope.gridData.totalCount == 0){
                        $scope.nodata = true;
                    }else{
                        $scope.nodata = false;
                    }
                });
            }
        }

        $scope.get_cpu_use_info = function(){
            $http.get('/get_cpu_use_info')
            .success(function(data){
                // $scope.loading = false;
                // console.log($scope.loading)
                var cpu_use_percent = angular.fromJson(data)
                option.series[0].data[0].value =  cpu_use_percent;
                myChart.setOption(option); 
            });
        }
        $scope.get_cpu_content = function(){
            $scope.cpuList = []
            $http.get('/get_cpu_content')
            .success(function(data){
                $scope.cpuList = data;
            });
        }
        $scope.get_top5_cpu = function(){
            $scope.top5_List= []
            $http.get('/get_top5_cpu')
            .success(function(data){
                $scope.top5_List = data;
            });
        }
                
        $scope.init = function(){
            $scope.get_cpu_use_info()
            $scope.get_top5_cpu();
            $scope.get_cpu_content();
        };
        if(angular.isDefined(timer)){
            $interval.cancel(timer);
        }
        var timer = $interval(function(){
            $scope.get_cpu_use_info()
        },30000);        
        $scope.auto_refresh = function(){
            var is_checked = $("#checkbox_refresh").is(':checked');
            if(is_checked){
                console.log("open----")
                var timer = $interval(function(){
                    $scope.get_cpu_use_info()
                },10000);                
            }
            else{
                console.log("close----")
                $interval.cancel(timer);
                // timer = undefined;
                console.log(angular.isDefined(timer))
            }

        }    
                           
    }
})();
