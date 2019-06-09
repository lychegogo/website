(function(){
    'use strict';
    angular
        .module('monitor')
        .controller('liveCtrl',['$scope','$http',liveCtrl]);

    function liveCtrl($scope,$http){
        var myChart1 = echarts.init(document.getElementById('cpu_live_chart'));
        var myChart2 = echarts.init(document.getElementById('memory_live_chart'));
        var myChart3 = echarts.init(document.getElementById('disk_live_chart'));
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
        $scope.init = function(){
            $http.get('/get_cpu_use_info')
            .success(function(data){
                var cpu_use_percent = angular.fromJson(data)
                option.series[0].data[0].value =  cpu_use_percent;           
                myChart1.setOption(option);
            });
            $http.get('/get_memory_use_info')
            .success(function(data){
                var memory_use_percent = angular.fromJson(data)
                option.series[0].data[0].value =  memory_use_percent;
                myChart2.setOption(option); 
            });            
            $http.get('/get_disk_use_info')
            .success(function(data){
                var disk_use_percent = angular.fromJson(data)
                option.series[0].data[0].value =  disk_use_percent;
                myChart3.setOption(option); 
            });
        };
        $scope.refresh = function(){
            setInterval(function(){
                $scope.init();
            },10000); 
        }
        $scope.refresh();
    }
})();