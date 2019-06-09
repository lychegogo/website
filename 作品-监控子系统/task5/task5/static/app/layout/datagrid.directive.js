'use strict';
//数据分页
angular.module('monitor')
    .directive("pagination", function() {
        return {
            restrict: "E",
            // templateUrl: "../static/partials/pagination.html",
            template: ['<div>',
                '<!--<datalist dataset="pageData" template-url="plugins/templates/datalist.html"></datalist>-->',
                '<ul class="pagination pagination-sm" style="margin-top: 5px;margin-bottom: 0px;">',
                '<li ng-class="{\'disabled\':pageData.pageIndex===1}"><a href="javascript:;" ng-click="jumpToFirstpage()" title="第一页"><i class="fa fa-angle-double-left"></i></a></li>',
                '<li ng-class="{\'disabled\':pageData.pageIndex===1}"><a href="javascript:;" ng-click="prevPage()" title="上一页"><i class="fa fa-angle-left"></i></a></li>',
                '<li ng-repeat="x in pages" ng-class="{\'active\':x==pageData.pageIndex,\'disabled\': x<0}" ng-click="jumpToPage(x)"><a href="javascript:;">[[filterPagination(x)]]</a></li>',
                '<li ng-class="{\'disabled\':pageData.pageIndex===pageData.totalPages}"><a href="javascript:;" ng-click="nextPage()" title="下一页"><i class="fa fa-angle-right"></i></a></li>',
                '<li ng-class="{\'disabled\':pageData.pageIndex===pageData.totalPages}"><a href="javascript:;" ng-click="jumpToLastpage()" title="最末页"><i class="fa fa-angle-double-right"></i></a></li>',
                '</ul>',
                '<div style="display:inline-block;vertical-align:top;margin-top: 8px;">',
                '&nbsp;&nbsp;',
                '<input type="text" ng-model="pageIndexTemp" style="width: 30px;height: 23px;"/><span style="height:23px;line-height:23px;">/</span><span ng-bind="pageData.totalPages"></span>',
                '<button ng-click="jumpToPage(pageIndexTemp)" class="btn btn-default btn-sm" style="height: 23px;padding-top: 1px;padding-bottom: 1px;padding-left: 5px;padding-right: 5px;">跳转</button>',
                '<span style="height:23px;line-height:23px;">&nbsp;&nbsp;每页</span>',
                '<select ng-model="pageData.pageSize" ng-options="m for m in pageData.pageSizeOptions" ng-change="changePageSize()" style="height: 23px;"></select>',
                '<span style="height:23px;line-height:23px;">共[[pageData.totalCount]]条</span>',
                '</div>',
                '</div>'
            ].join(''),
            replace: true,
            //@单向文本绑定，=双向绑定，&在父scope中执行函数
            scope: {
                pageData: "=datapage",
                pageIndexTemp: '='
            },
            link: function(scope, elem, attrs) {
                scope.generate = function(start, end) {
                    //生成一个从start到end数组
                    var arrayData = [],
                        i;
                    for (i = start; i <= end; i++)
                        arrayData.push(i);
                    return arrayData;
                };
                scope.getPages = function(pageIndex, totalPages) {
                    //形参分别为当前页页码和总页数
                    //总共显示的有效按钮的个数
                    var c = 9, //有效按钮的开始和结束
                        start = 0,
                        end = 0,
                        pages = []; //空的数组
                    //分两种情况： 最大页数小于c和大于c；
                    if (totalPages <= c) {
                        start = 1;
                        end = totalPages;
                        pages = pages.concat(scope.generate(start, end));
                    } else {
                        if (pageIndex > c / 2 + 1) {
                            pages.push(-1999);
                            if (totalPages - pageIndex < c / 2) {
                                start = totalPages - c + 1;
                                end = totalPages;
                                pages = pages.concat(scope.generate(start, end));
                            } else {
                                start = pageIndex - (c - 1) / 2;
                                end = pageIndex + (c - 1) / 2;
                                pages = pages.concat(scope.generate(start, end));
                                pages.push(-2999);
                            }
                        } else {
                            start = 1;
                            end = c;
                            pages = pages.concat(scope.generate(start, end));
                            pages.push(-2999);
                        }
                    }
                    return pages;
                };
                // prevPage
                scope.prevPage = function() {
                    if (scope.pageData.pageIndex > 1) {
                        scope.pageData.pageIndex -= 1;
                    } else {
                        return;
                    }
                    scope.refresh();
                };
                // nextPage
                scope.nextPage = function() {
                    if (scope.pageData.pageIndex < scope.pageData.totalPages) {
                        scope.pageData.pageIndex += 1;
                    } else {
                        return;
                    }
                    scope.refresh();
                };
                scope.jumpToFirstpage = function() {
                    if (scope.pageData.pageIndex === 1) {
                        return;
                    }
                    scope.jumpToPage(1);
                };
                scope.jumpToLastpage = function() {
                    if (scope.pageData.pageIndex === scope.pageData.totalPages) {
                        return;
                    }
                    scope.jumpToPage(scope.pageData.totalPages);
                };
                // 跳转页
                scope.jumpToPage = function(pageIndex) {
                    //if (pageIndex < 0) {
                    //  return;
                    //}
                    //判断实参pageIndex是不是数字
                    //如果不是，则将pageIndexTemp清空，并直接返回
                    if (pageIndex == null || pageIndex === "" || isNaN(pageIndex)) {
                        scope.pageIndexTemp = null;
                        return;
                    }
                    pageIndex=parseInt(pageIndex);
                    if (pageIndex > scope.pageData.totalPages) {
                        pageIndex = scope.pageData.totalPages;
                    }
                    if (pageIndex < 1) {
                        if (pageIndex === -1999 || pageIndex === -2999) {
                            return;
                        }
                        pageIndex = 1;
                    }
                    scope.pageData.pageIndex = pageIndex;
                    scope.refresh();
                };
                scope.refresh = function() {
                    scope.pageIndexTemp = scope.pageData.pageIndex;
                    scope.pageData.refresh();
                };
                scope.changePageSize = function() {
                    scope.pageData.pageIndex = 1;
                    scope.refresh();
                };
                scope.filterPagination = function(x) {
                    if (x < 0) {
                        return "..."
                    }
                    return x;
                };
                //监听totalPages的变化
                scope.watchPages = function() {
                    scope.$watch("pageData.pageIndex", function(newValue, oldValue, scope) {
                        scope.pageData.pageIndex = newValue;
                        scope.pageIndexTemp = scope.pageData.pageIndex;
                        scope.pages = scope.getPages(scope.pageData.pageIndex, scope.pageData.totalPages);
                    });
                    scope.$watch("pageData.totalPages", function(newValue, oldValue, scope) {
                        scope.pageData.totalPages = newValue;
                        scope.pages = scope.getPages(scope.pageData.pageIndex, scope.pageData.totalPages);
                    });
                    //list变化的时候，表明数据重新加载过,这里主要是解决，当前页数据删除完毕后，仍停留在当前页的用户不友好现象
                    scope.$watch("pageData.totalCount", function(newValue, oldValue, scope) {
                        if (scope.pageData.pageIndex > 1 && newValue > 1) {
                            //先计算实际应该有多少页数据，如果该数字小于实际返回的页码（说明前端发送了一个不合理的页码请求），
                            //此时则强制使用正确的页码重新发起一次请求
                            var realIndex = Math.ceil(newValue / scope.pageData.pageSize);
                            if (realIndex < scope.pageData.pageIndex) {
                                scope.pageData.pageIndex = realIndex;
                                scope.refresh();
                            }
                        }
                    });
                };
                //启动监听
                scope.watchPages();
                if (attrs.autoTrigger !== 'false') {
                    scope.refresh();
                };
            }
        };
    })
    .directive("datagrid", function() {
        return {
            restrict: "E",
            template: function(elem, attrs) {
                if (attrs.pagingLocation === 'top') {
                    return ['<div>',
                        '<pagination datapage="conf" page-index-temp="pageIndexTemp"></pagination>',
                        '<div ng-transclude></div>',
                        '</div>'
                    ].join('');
                }
                if (attrs.pagingLocation === 'bottom') {
                    return ['<div>',
                        '<div ng-transclude></div>',
                        '<pagination datapage="conf" page-index-temp="pageIndexTemp"></pagination>',
                        '</div>'
                    ].join('');
                }
                //其它所有情况均返回上下双分页栏(null,'' and any other string)
                return ['<div>',
                    '<pagination datapage="conf" page-index-temp="pageIndexTemp"></pagination>',
                    '<div ng-transclude></div>',
                    '<pagination datapage="conf" page-index-temp="pageIndexTemp" auto-trigger="false"></pagination>',
                    '</div>'
                ].join('');
            },
            replace: true,
            transclude: true,
            scope: {
                conf: "=conf"
            },
            link: function(scope, elem, attrs, controllerInstance) {
                //the fourth argument is the controller instance you require
                scope.pageIndexTemp = 1;

            }
        };
    });
