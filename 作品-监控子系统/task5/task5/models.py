#coding:utf-8
from __future__ import unicode_literals

from django.db import models
import psutil
import logging
import json
import time
import pdb
import psycopg2
import operator

import sys 
reload(sys) # Python2.5 初始化后会删除 sys.setdefaultencoding 这个方法，我们需要重新载入 
sys.setdefaultencoding('utf-8')
# from util import SqlOperate
# 获取当前CPU使用信息
# dbConfig = dict()
# dbConfig = {
#     'database': "postgres",
#     'user': "postgres",
#     'password': "1234567",
#     'host': "127.0.0.1",
#     'port': "5432"
# }
# opp = SqlOperate(dbConfig)
# # opp = SqlOperate(_database="postgres", _user="postgres", _password="1234567", _host="127.0.0.1", _port="5432")
# # sql = "INSERT INTO cpu(id,cpu_percent,time) values(%f,%f,'%s')"%(1,0.5,'2013')
# sql = "SELECT * FROM cpu"
# print opp.execute(sql)

def get_all_cpu_info():
    try:
        cpuList = []
        all_processes = list(psutil.process_iter()) 
        for proc in all_processes: 
            proc.cpu_percent(interval=0) 
        #此处sleep1秒是取正确取出CPU使用率的重点
        time.sleep(1) 
        for proc in all_processes:
            process = dict()
            try:
                # process['path'] = proc.exe()
                # print("-----------")
                # print proc.exe()
                # print(type(proc.exe()))
                process['percent'] = round(proc.cpu_percent(interval=0),2)
                # print(type(process['percent']))
                process['name'] = proc.name()
                process['pid'] = proc.pid
                process['create_time'] = proc.create_time()
                process['status'] = proc.status()
                process['num_threads'] = proc.num_threads()
                #if  process['percent']> 0:
                    #print(getProcessInfo(proc)[2])
                    
            except psutil.AccessDenied:
                pass
            if process:
                cpuList.append(process)
                # print("-----------")
                # print(json.dumps(process,ensure_ascii=False))
                # print("-----------")
        # print(cpuList)
    except Exception, e:
        # logging.error(str(e))
        raise e
    return cpuList
get_all_cpu_info()

def get_all_memory_info():
    try:
        memoryList = []
        
        for pid in psutil.pids():
            process = dict()
            try:
                process['name'] = psutil.Process(pid).name()
                process['pid'] = pid
                process['rss'] = psutil.Process(pid).memory_info().rss
                process['vms'] = psutil.Process(pid).memory_info().vms
                process['percent'] = round(psutil.Process(pid).memory_percent(),2)
            except psutil.AccessDenied:
                pass
            memoryList.append(process)
    except Exception, e:
        logging.error(str(e))
    return memoryList

def get_all_disk_info():
    try:
        diskList = []        
        for pid in psutil.pids():
            process = dict()
            try:
                process['name'] = psutil.Process(pid).name()
                process['pid'] = pid
                process['read_bytes'] = psutil.Process(pid).io_counters().read_bytes
                process['write_bytes'] = psutil.Process(pid).io_counters().write_bytes
                process['total_bytes'] = process['read_bytes'] + process['write_bytes']
            except psutil.AccessDenied:
                pass
            diskList.append(process)
    except Exception, e:
        logging.error(str(e))
    return diskList

def get_cpu_content(page,size):
    total_info = {}
    info_list = []
    cpuList = get_all_cpu_info()
    try:
        page = int(page)
        size = int(size)                
        total_count = len(cpuList)
        info_list = cpuList[(page-1)*size : page*size]
        total_info['data'] = info_list
        total_info['totalCount'] = total_count
    except Exception, e:
        logging.error(str(e))
    return total_info

def get_disk_content(page,size):
    total_info = {}
    info_list = []
    diskList = get_all_disk_info()
    try:
        page = int(page)
        size = int(size)                
        total_count = len(diskList)
        info_list = diskList[(page-1)*size : page*size]
        total_info['data'] = info_list
        total_info['totalCount'] = total_count
    except Exception, e:
        logging.error(str(e))
    return total_info

def get_memory_content(page,size):
    total_info = {}
    info_list = []
    memoryList = get_all_memory_info()
    try:
        page = int(page)
        size = int(size)                
        total_count = len(memoryList)
        info_list = memoryList[(page-1)*size : page*size]
        total_info['data'] = info_list
        total_info['totalCount'] = total_count
    except Exception, e:
        logging.error(str(e))
    return total_info
#获取cpu使用百分比top5   
def get_top5_cpu():
    top5_list = []
    try:
        cpuList = get_all_cpu_info()
        sorted_c = sorted(cpuList, key=operator.itemgetter('percent'), reverse=True)
        top5_list = sorted_c[0 : 5]  

    except Exception, e:
        logging.error(str(e))
    return top5_list

def get_top5_memory():
    top5_list = []
    try:
        memoryList = get_all_memory_info()
        sorted_m = sorted(memoryList, key=operator.itemgetter('percent'), reverse=True)
        top5_list = sorted_m[0 : 5]  
    except Exception, e:
        logging.error(str(e))
    return top5_list

def get_top5_disk():
    top5_list = []
    try:
        diskList = get_all_disk_info()
        sorted_d = sorted(diskList, key=operator.itemgetter('total_bytes'), reverse=True)
        top5_list = sorted_d[0 : 5]  
        print(top5_list)
    except Exception, e:
        logging.error(str(e))
    return top5_list



#获取CPU使用百分比
def get_cpu_use_info():
    try:
        cpu_use_percent = psutil.cpu_percent(interval=1)
    except Exception, e:
        logging.error(str(e))
    return cpu_use_percent

def get_disk_use_info():
    try:
        disk_use_percent = psutil.disk_usage('/').percent
    except Exception, e:
        logging.error(str(e))
    return disk_use_percent

def get_memory_use_info():
    try:
        memory_use_percent = psutil.virtual_memory().percent
    except Exception, e:
        logging.error(str(e))
    return memory_use_percent


def get_chart():
    try:
        chart_info = dict()
        cpu_info = dict()
        disk_info = dict()
        memory_info = dict()
        conn = psycopg2.connect(database="postgres", user="postgres", password="1234567", host="127.0.0.1", port="5432") 
        cur = conn.cursor()
        cur.execute("SELECT cpu_percent,time FROM cpu LIMIT 7")
        row1 = cur.fetchall()
        cur.execute("SELECT disk_percent,time FROM disk LIMIT 7")
        row2 = cur.fetchall()
        cur.execute("SELECT memory_percent,time FROM memory LIMIT 7")
        row3 = cur.fetchall()
        percent_list = []
        time_list = []
        for item in row1 :
            percent_list.append(item[0])
            time_list.append(item[1])
        cpu_info['percent'] = percent_list
        cpu_info['time'] = time_list
        for item in row2 :
            percent_list.append(item[0])
            time_list.append(item[1])
        disk_info['percent'] = item[0]
        disk_info['time'] = item[1]
        for item in row3 :
            percent_list.append(item[0])
            time_list.append(item[1])
        memory_info['memory_percent'] = item[0]
        memory_info['time'] = item[1]

        chart_info['cpu_info'] = cpu_info
        chart_info['memory_info'] = memory_info
        chart_info['disk_info'] = disk_info
        #print("*********")
        #print(chart_info)
        #print("*********")
    except Exception, e:
        logging.error(str(e))
    return chart_info

def get_cpu():
    cpu_info = dict()
    conn = psycopg2.connect(database="postgres", user="postgres", password="1234567", host="127.0.0.1", port="5432") 
    cur = conn.cursor()
    cur.execute("SELECT cpu_percent,time FROM cpu LIMIT 7")
    row1 = cur.fetchall()
    #row1 = json.loads(cur.execute("SELECT cpu_percent,time FROM cpu LIMIT 2"))
    for item in row1 :
        cpu_info['cpu_percent'] = item[0]
        cpu_info['time'] = item[1]
    print("*********")
    print(cpu_info)
    print("*********")
    return 1

