(function(){
    'use strict';
    angular
        .module('monitor')
        .controller('memoryCtrl',['$scope','$http',memoryCtrl]);
    function memoryCtrl($scope,$http){
        var myChart = echarts.init(document.getElementById('memory_chart'));
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
                $http.get('/get_memory_content',{
                    'params': {
                        'pageIndex': $scope.gridData.pageIndex,
                        'pageSize': $scope.gridData.pageSize
                    }
                })
                .success(function(response){
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
        $scope.get_top5_memory = function(){
            $scope.top5_List = []
            $http.get('/get_top5_memory')
            .success(function(data){
                $scope.top5_List = data;
            });
        }
        $scope.get_memory_use_info = function(){
            $http.get('/get_memory_use_info')
            .success(function(data){
                var memory_use_percent = angular.fromJson(data)
                option.series[0].data[0].value =  memory_use_percent;
                myChart.setOption(option); 
            });
        }
        $scope.init = function(){
            $scope.get_memory_use_info(); 
            $scope.get_top5_memory();           
        };
    }
})();