from PyQt6.QtCore import pyqtSlot, QObject, pyqtSignal
import random
import datetime
import time
import threading

from ClassBundle.ShareData import ShareData

class WebApp_start(QObject):
    def __init__(self, main, view):
        super().__init__()
        self.mMaruApp = main
        self.view = view
        self.data_list = []
        self.m_sPage = None
        self.time_thread = None
        self.th_is_running = False
        self.count = 0

    @pyqtSlot(str)
    def pageLoaded(self, page):
        ShareData.PAGE = ShareData.PageType.START
        self.m_sPage = page
        #print('pageLoaded : ', page)
        # 시그널과 슬롯 연결
        self.mMaruApp.js_signal.connect(self.mMaruApp.time_slot)
        # 스레드 생성 및 시작
        self.time_thread = threading.Thread(target=self.print_time)
        self.time_thread.start()

    @pyqtSlot(str)
    def pageEnd(self, page):
        ShareData.OldPAGE = ShareData.PAGE
        ShareData.PAGE = ShareData.PageType.NoPage
        # 스레드 종료
        self.th_is_running = False
        self.time_thread.join()
        print("WebApp_start 종료")

    def print_time(self):
        """
        지정된 딜레이마다 현재 시간을 출력하는 함수
        """
        self.th_is_running = True
        while self.th_is_running:
            time.sleep(1)
            now = datetime.datetime.now()
            self.mMaruApp.js_signal.emit(now)

    def th_close(self):
        self.th_is_running = False

    @pyqtSlot(str)
    def btn_Data(self, message):
        """
        HTML/JavaScript에서 호출될 Python 함수
        """
        value0 = int(datetime.datetime.now().timestamp() * 10)
        value1 = random.randint(1, 100)
        value2 = random.randint(1, 100)

        self.data_list.append([value0, value1, value2])
        nSize = len(self.data_list)
        if nSize > ShareData.nDataSize :
            nSize -= ShareData.nDataSize
            for i in range(nSize):
                del self.data_list[0]

        if 2 <= len(self.data_list):
            sGDATA = self.data_list[0]
            lStart = sGDATA[0]
            chartData = [str(0),str(sGDATA[1]),str(sGDATA[2])]
            for i in range(1, len(self.data_list)):
                sGDATA = self.data_list[i]
                chartData[0] += "," + str(sGDATA[0] - lStart)
                chartData[1] += "," + str(sGDATA[1])
                chartData[2] += "," + str(sGDATA[2])
                #print('list : ', i)

            self.mMaruApp.JsonMultiAdd("x", chartData[0])
            self.mMaruApp.JsonMultiAdd("y", chartData[1])
            #print('list dat : ' + self.mMaruApp.JsonMultiGetData("y1", chartData[2]))
            self.mMaruApp.drawChartJS("remoChart", self.mMaruApp.JsonMultiGetData("y1", chartData[2]))

        print(f"HTML에서 호출됨: {message} <= {self.count}")
        self.count += 1
