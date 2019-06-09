(function(){
    'use strict';
    angular
        .module('monitor')
        .controller('historyCtrl',['$scope','$http',historyCtrl]);

    function historyCtrl($scope,$http){
        var myChart1 = echarts.init(document.getElementById('cpu_history_chart'));
        var myChart2 = echarts.init(document.getElementById('memory_history_chart'));
        var myChart3 = echarts.init(document.getElementById('disk_history_chart'));
        var option = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['使用百分比(%)']
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['周一','周二','周三','周四','周五','周六','周日']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'使用百分比(%)',
                    type:'line',
                    stack: '总量',
                    data:[120, 132, 101, 134, 90, 230, 210]
                }
            ]
        };
        
        $scope.init = function(){
            var time = new Date();
            var h = time.getHours();
            var m = time.getMinutes();
            var ff=Date.parse( (h<10 ? "0"+ h : h).toString()+":"+(m<10 ? "0" + m : m).toString())
            //console.log(ff);
            $http.get('/get_chart')
            .success(function(data){
                console.log(data)
                var cpu_info = data.cpu_info;
                var memory_info = data.memory_info;
                var disk_info = data.disk_info;
                option.xAxis[0].data = cpu_info.time;
                option.series[0].data = cpu_info.percent;
                myChart1.setOption(option);
            });

            //optionCpuChart.xAxis[0].data[5] = ()
            //optionCpuChart.xAxis[0].data[6] = (h<10 ? "0"+ h : h).toString()+":"+(m<10 ? "0" + m : m).toString();

            myChart2.setOption(option);
            myChart3.setOption(option); 
        };
    }
})();