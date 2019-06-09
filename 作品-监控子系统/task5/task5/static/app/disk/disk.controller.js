(function(){
    'use strict';
    angular
        .module('monitor')
        .controller('diskCtrl',['$scope','$http',diskCtrl]);
    function diskCtrl($scope,$http){
        var myChart = echarts.init(document.getElementById('disk_chart'));
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
                    name:'磁盘使用百分比',
                    type:'gauge',
                    detail : {formatter:'{value}%'},
                    data:[{value: 50, name: '百分比'}]
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
                $http.get('/get_disk_content',{
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
        $scope.get_disk_use_info = function () {
            $http.get('/get_disk_use_info')
            .success(function(data){
                var disk_use_percent = angular.fromJson(data)
                option.series[0].data[0].value =  disk_use_percent;
                myChart.setOption(option, true); 
            });
        }
        $scope.get_top5_disk = function(){
            $scope.top5_List = []
            $http.get('/get_top5_disk')
            .success(function(data){
                $scope.top5_List = data;
            });
        }
        $scope.init = function(){
            $scope.get_disk_use_info();
            $scope.get_top5_disk();
        };
        $scope.refresh = function(){
            setInterval(function(){
                $scope.get_disk_use_info();
                $scope.get_top5_disk();
            },10000); 
        }
        
        $scope.auto_refresh = function(){
            var is_checked = $("#checkbox_refresh").is(':checked');
            if(is_checked)
                $scope.refresh();
            else
                clearInterval($scope.refresh);
        }   
    }
})();