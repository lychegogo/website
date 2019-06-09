#coding:utf-8
import psutil
import logging
import json
import time
import psycopg2
import os
from util import SqlOperate

BASE_PATH = os.path.normpath(os.path.split(os.path.realpath(__file__))[0])
LOG_FILE = os.path.join(BASE_PATH,'logs','task5.log')

logging.basicConfig(level=logging.INFO,
        format='%(asctime)s %(name)-12s %(levelname)-8s %(message)s',
        datefmt='%m-%d %H:%M',
        filename=LOG_FILE,
        filemode='w')

class InitData(object):
    """
    初始化数据库表，插入系统信息
    """
    def __init__(self):
        self.dbConfig = dict()
        self.dbConfig = {
            'database': "postgres",
            'user': "postgres",
            'password': "1234567",
            'host': "127.0.0.1",
            'port': "5432"
        }
        self.db = SqlOperate(self.dbConfig)

    def insertRecord(self):
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            disk_percent = psutil.disk_usage('/').percent
            memory_percent = psutil.virtual_memory().percent
            timeNow = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
            self.db.executeQuery("INSERT INTO cpu(cpu_percent,time) values(%f,'%s')"%(cpu_percent,timeNow))
            self.db.executeQuery("INSERT INTO disk(disk_percent,time) values(%f,'%s')"%(disk_percent,timeNow))
            self.db.executeQuery("INSERT INTO memory(memory_percent,time) values(%f,'%s')"%(memory_percent,timeNow))
            return 1
        except Exception, e:
            logging.error(str(e))
            return 0
    def deleteRecord(self):
        try:
            timeNow = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()-30*24*60*60))
            self.db.executeQuery("DELETE FROM cpu WHERE time<timeNow")
            self.db.executeQuery("DELETE FROM disk WHERE time<timeNow")
            self.db.executeQuery("DELETE FROM memory WHERE time<timeNow")
            return 1
        except Exception, e:
            logging.error(str(e))
            return 0


if __name__ == '__main__':

    # InitData().insertRecord()
    # BASE_PATH = os.path.normpath(os.path.split(os.path.realpath(__file__))[0])
    # print os.path.realpath(__file__)
    #print self.db.execute("SELECT * FROM cpu WHERE id=1")


# def  insertRecord():
#     try:
#         conn = psycopg2.connect(database="postgres", user="postgres", password="1234567", host="127.0.0.1", port="5432")
#         cur = conn.cursor()
#         #"insert into tb_menu(fmenu_id,menuname,menuurl,menuregx,isdefault) values(%d,'%s','%s','%s',%d)"%(fmenu_id,menuname,menuurl,menuregx,isdefault,)        
#         cpu_percent = psutil.cpu_percent(interval=1)
#         disk_percent = psutil.disk_usage('/').percent
#         memory_percent = psutil.virtual_memory().percent
#         timeNow = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
#         cur.execute("INSERT INTO cpu(cpu_percent,time) values(%f,'%s')"%(cpu_percent,timeNow))
#         cur.execute("INSERT INTO disk(disk_percent,time) values(%f,'%s')"%(disk_percent,timeNow))
#         cur.execute("INSERT INTO memory(memory_percent,time) values(%f,'%s')"%(memory_percent,timeNow))
#         conn.commit()
#         cur.close()
#         conn.close()
#     except Exception, e:
#         logging.error(str(e))
#     return 1

# def deleteRecord():
#     try:
#         conn = psycopg2.connect(database="postgres", user="postgres", password="1234567", host="127.0.0.1", port="5432")
#         cur = conn.cursor()
#         timeNow = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()-30*24*60*60))
#         cur.execute("DELETE FROM cpu WHERE time<timeNow")
#         cur.execute("DELETE FROM disk WHERE time<timeNow")
#         cur.execute("DELETE FROM memory WHERE time<timeNow")
#         conn.commit()
#         cur.close()
#         conn.close()
#     except Exception, e:
#         logging.error(str(e))
#     return 1


# InitData().insertRecord()