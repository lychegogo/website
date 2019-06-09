'use strict';
angular
    .module('navbar')
    .directive("navbar",navbar);

function navbar(){
    return{
        restrict: 'EA',
        replace: true,
        templateUrl: 'navbar/navbar.html'
        //@单向文本绑定，=双向绑定，&在父scope中执行函数
       
    }
};
