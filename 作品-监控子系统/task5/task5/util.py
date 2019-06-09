import psutil
import logging
import json
import time
import psycopg2

class SqlOperate(object):
    def __init__(self,dbConfig):
        self.config = dbConfig
        # print("------")
        # print(**self.config)
        # self.config = {
        #     self.database: _database,
        #     self.user: _user,
        #     self.password: _password,
        #     self.host: _host,
        #     self.port: _port
        # }
        # self.database = _database
        # self.user = _user
        # self.password = _password
        # self.host = _host
        # self.port = _port


    def connect(self):
        if not self.config['database']:
            rasie("not set database info")
        self.conn = psycopg2.connect(**self.config)
        # self.conn = psycopg2.connect(database = self.database, user = self.user, password = self.password, host = self.host, port = self.port)
        cur = self.conn.cursor()
        if not cur:
            raise("connect error")
        else:
            return cur

    def execute(self,sql):
        cur = self.connect()
        try:
            # print cur.execute("SELECT * FROM cpu")
            cur.execute(sql)
            # print "2----------"
            rtn = cur.fetchall()
            self.conn.close()
            return rtn
        except Exception, e:
            logging.error("excute error")
            return None

    def executeQuery(self,sql):
        cur = self.connect()
        try:
            cur.execute(sql)
            self.conn.commit()
            self.conn.close()
        except Exception, e:
            logging.error("executeQuery error")