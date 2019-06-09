#coding:utf-8
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import JsonResponse,HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
import os
import psutil
import logging
import json
# import sys
# reload(sys)
# sys.setdefaultencoding('utf-8')

from task5 import models as MonitorModel


# Create your views here.
def index(request):
    #return HttpResponse("Hello world ! ")
    return render_to_response('index.html',context_instance=RequestContext(request))

#获取CPU进程使用信息
def get_cpu_content(request):
    rtnDict = {
        'list' : [], 
        'pageIndex' : 1, 
        'pageSize' : 10, 
        'totalCount' : 0, 
        'totalPages' : 1
    }
    try:
        datas = request.GET.dict()
        pageIndex = int(datas['pageIndex'])
        pageSize = int(datas['pageSize'])
        cpu_info = MonitorModel.get_cpu_content(pageIndex,pageSize)
        
        rtnDict['list'] = cpu_info['data']

        rtnDict['pageIndex'] = pageIndex
        rtnDict['pageSize'] = pageSize
        rtnDict['totalCount'] = cpu_info['totalCount']
        if cpu_info['totalCount'] % pageSize:
            rtnDict['totalPages'] = cpu_info['totalCount'] / pageSize + 1
        else:
            rtnDict['totalPages'] = cpu_info['totalCount'] / pageSize
        return HttpResponse(json.dumps(rtnDict,ensure_ascii=False))
        #diskList = MonitorModel.get_disk_content()
    except Exception, e:
        logging.error(str(e))
        return HttpResponse(0)
    # return JsonResponse(json.dumps(diskList))
    
    # return HttpResponse(1)
#获取内存进程使用信息
def get_memory_content(request):
    rtnDict = {
        'list' : [], 
        'pageIndex' : 1, 
        'pageSize' : 10, 
        'totalCount' : 0, 
        'totalPages' : 1
    }
    try:
        datas = request.GET.dict()
        pageIndex = int(datas['pageIndex'])
        pageSize = int(datas['pageSize'])
        memory_info = MonitorModel.get_memory_content(pageIndex,pageSize)
        
        rtnDict['list'] = memory_info['data']
        rtnDict['pageIndex'] = pageIndex
        rtnDict['pageSize'] = pageSize
        rtnDict['totalCount'] = memory_info['totalCount']
        if memory_info['totalCount'] % pageSize:
            rtnDict['totalPages'] = memory_info['totalCount'] / pageSize + 1
        else:
            rtnDict['totalPages'] = memory_info['totalCount'] / pageSize
        return HttpResponse(json.dumps(rtnDict))
    except Exception, e:
        logging.error(str(e))
        return HttpResponse(0)

#获取磁盘进程使用信息

def get_disk_content(request):
    rtnDict = {
        'list' : [], 
        'pageIndex' : 1, 
        'pageSize' : 10, 
        'totalCount' : 0, 
        'totalPages' : 1
    }
    try:
        datas = request.GET.dict()
        pageIndex = int(datas['pageIndex'])
        pageSize = int(datas['pageSize'])
        disk_info = MonitorModel.get_disk_content(pageIndex,pageSize)
        
        rtnDict['list'] = disk_info['data']
        rtnDict['pageIndex'] = pageIndex
        rtnDict['pageSize'] = pageSize
        rtnDict['totalCount'] = disk_info['totalCount']
        if disk_info['totalCount'] % pageSize:
            rtnDict['totalPages'] = disk_info['totalCount'] / pageSize + 1
        else:
            rtnDict['totalPages'] = disk_info['totalCount'] / pageSize
        return HttpResponse(json.dumps(rtnDict))
    except Exception, e:
        logging.error(str(e))
        return HttpResponse(0)

#获取CPU使用百分比
def get_cpu_use_info(request):
    try:
        cpu_use_percent = MonitorModel.get_cpu_use_info()
        return HttpResponse(json.dumps(cpu_use_percent))
    except Exception, e:
        logging.error(str(e))
        return HttpResponse(0)

#获取内存使用百分比
def get_memory_use_info(request):
    try:
        memory_use_percent = MonitorModel.get_memory_use_info()
        return HttpResponse(json.dumps(memory_use_percent))
    except Exception, e:
        logging.error(str(e))
        return HttpResponse(0)

#获取磁盘使用百分比
def get_disk_use_info(request):
    try:
        disk_use_percent = MonitorModel.get_disk_use_info()
        return HttpResponse(json.dumps(disk_use_percent))
    except Exception, e:
        logging.error(str(e))
        return HttpResponse(json.dumps(0)

#获取CPU占用进程TOP5
def get_top5_cpu(request):
    try:
        top5_cpu_list = MonitorModel.get_top5_cpu()
        return HttpResponse(json.dumps(top5_cpu_list))
    except Exception, e:
        logging.error(str(e))
        return HttpResponse(json.dumps(0)

#获取内存占用进程TOP5
def get_top5_memory(request):
    try:
        top5_memory_list = MonitorModel.get_top5_memory()
        return HttpResponse(json.dumps(top5_memory_list))
    except Exception, e:
        logging.error(str(e))
        return HttpResponse(json.dumps(0)

#获取磁盘占用进程TOP5
def get_top5_disk(request):
    try:
        top5_disk_list = MonitorModel.get_top5_disk()
        return HttpResponse(0)
    except Exception, e:
        logging.error(str(e))
        return HttpResponse(json.dumps(top5_disk_list))
              
#获取历史纪录图表数据
def get_chart(request):
    try:
        chart_info = MonitorModel.get_chart()
        return HttpResponse(json.dumps(chart_info))
    except Exception, e:
        logging.error(str(e))
        return HttpResponse(0)
