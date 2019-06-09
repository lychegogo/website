'use strict';
angular
    .module('sidebar', [])
    .directive('sidebar',sidebar)
    .directive('menuList',menuList)
    .controller('sidebarCtrl',['$scope','$state',sidebarCtrl]);

function sidebar(){
    return{
        restrict: 'EA',
        replace: true,
        templateUrl: '/static/app/layout/sidebar.html',
        controller:'sidebarCtrl',
        scope: {},
        link: function($scope){
        }
       
    }
};

function menuList(){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: '/static/app/layout/menu.html'
    }
}

function sidebarCtrl($scope,$state){
    $scope.state = $state;

}