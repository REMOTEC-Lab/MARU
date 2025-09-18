import sys
import os
import json
import datetime

from PyQt6.QtWidgets import QApplication, QMainWindow
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtWebEngineCore import QWebEngineProfile, QWebEngineSettings
from PyQt6.QtWebChannel import QWebChannel
from PyQt6.QtCore import pyqtSlot, QUrl, Qt, pyqtSignal, QTimer

from WebAppInterface.WebApp_start import WebApp_start

# 디버깅 포트 설정
# PyQt5 애플리케이션 생성 전에 설정해야 함
os.environ["QTWEBENGINE_REMOTE_DEBUGGING"] = "9222" # 원하는 포트 번호 (일반적으로 9222를 사용)

class MainWindow(QMainWindow):
    js_signal = pyqtSignal(datetime.datetime)
    def __init__(self):
        super().__init__()
        self.jObject = {}
        self.jArray = []

        self.setWindowTitle("HTML만으로 Python 함수 실행")
        self.setGeometry(100, 100, 800, 600)
        self.channel_ready = False

        self.browser = QWebEngineView()
        self.setCentralWidget(self.browser)
        # Make the window fullscreen
        self.showFullScreen()

        s = QWebEngineProfile.defaultProfile().settings()
        s.setAttribute(QWebEngineSettings.WebAttribute.FullScreenSupportEnabled, True)
        s.setAttribute(QWebEngineSettings.WebAttribute.AllowRunningInsecureContent, True)
        #s.setAttribute(QWebEngineSettings.WebAttribute.PluginsEnabled, True)
        #s.setAttribute(QWebEngineSettings.WebAttribute.DnsPrefetchEnabled, True)
        #s.setAttribute(QWebEngineSettings.WebAttribute.ScreenCaptureEnabled, True)

        # QWebChannel과 Python 객체 연결
        self.channel = QWebChannel()
        self.wa_start = WebApp_start(self, self.browser)

        # HTML 파일 로드 후, 로드 완료 시그널에 함수 연결
        self.browser.loadFinished.connect(self.onLoadFinished)

        # "Maru_start"라는 이름으로 등으로 Python 객체를 등록합니다.
        self.channel.registerObject("Maru_app", self)
        self.channel.registerObject("Maru_start", self.wa_start)
        self.browser.page().setWebChannel(self.channel)

        # HTML 파일 경로 설정
        #html_file_path = os.path.abspath("web_channel.html")
        html_file_path = os.path.abspath("./assets/form/html/start.html")
        # 웹 페이지를 엽니다.
        #self.browser.setUrl(QUrl("./web_channel.html"))  # [4]
        try:
            with open(html_file_path, "r", encoding="utf-8") as f:
                html_content = f.read()

            # setHtml()을 사용하여 HTML 문자열을 로드
            self.browser.setHtml(html_content, baseUrl=QUrl.fromLocalFile(html_file_path))

        except FileNotFoundError:
            print(f"오류: '{html_file_path}' 파일을 찾을 수 없습니다.")

    def keyPressEvent(self, event):
        """
        키보드 이벤트를 처리하는 메서드.
        ESC 키를 누르면 애플리케이션을 종료합니다.
        """
        # Ctrl + X가 안먹어, Ctrl + Z로 종료
        if event.key() == Qt.Key.Key_Z and event.modifiers() & Qt.KeyboardModifier.ControlModifier:
            self.program_close()

        # 다른 키 이벤트는 기본 동작을 수행하도록 부모 클래스의 메서드를 호출
        super().keyPressEvent(event)

    def program_close(self):
        self.wa_start.th_close()
        self.close()

    def onLoadFinished(self, ok):
        print("{0} {1}".format(ok, self.channel_ready))
        if ok and not self.channel_ready:
            print("웹페이지 로드 완료. QWebChannel 초기화 시도...")
            self.channel_ready = True

    def time_slot(self, _time:datetime.datetime):
        # 시그널에 연결된 슬롯 함수
        # 이 함수는 GUI 스레드에서 실행됨
        #print(f"시간 : {_time.strftime('%Y년 %m월 %d일 %H시 %M분 %S초')}")
        self.JsonMultiAdd("TIMER_CLOCK", _time.strftime('%Y.%m.%d'))
        #print(self.JsonMultiGetData("TIMER_DAY", _time.strftime('%H시 %M분 %S초')))
        self.text_put(self.JsonMultiGetData("TIMER_DAY", _time.strftime('%H시 %M분 %S초')))

    @pyqtSlot(str)
    def callPyApp(self, message):
        print(f"HTML에서 호출된 MainWindow의 함수: {message}")
        self.browser.page().runJavaScript("setPythonFunction('this is a test')")

    def JsonOneData(self, _node:str, _value:str):
        self.jObject.update({_node: _value})
        return json.dumps(self.jObject, ensure_ascii=False)

    def JsonMultiAdd(self, _node:str, _value:str):
        self.jObject.update({_node: _value})

    def JsonArrayAdd(self, _jobject):
        self.jArray.append(_jobject)

    def JsonArrayGetStrRemaind(self):
        if not self.jArray:
            return None
        jsonReturn = json.dumps(self.jArray, ensure_ascii=False)
        return jsonReturn

    def JsonArrayGetString(self):
        if not self.jArray:
            return None
        jsonReturn = json.dumps(self.jArray, ensure_ascii=False)
        self.jArray.clear()
        return jsonReturn

    def JsonMultiGetData(self, _node:str, _value:str):
        self.jObject.update({_node: _value})
        jsonReturn = json.dumps(self.jObject, ensure_ascii=False)
        self.jObject.clear()
        return jsonReturn

    def drawChartJS(self, _sID:str, _sData:str):
        #print('drawChartJS',f"drawChartJS('{_sID}', '{_sData}');")
        self.browser.page().runJavaScript(f"drawChartJS('{_sID}', '{_sData}');",self.js_result)

    def text_put(self, _sjson:str):
        js_code = f"""Text_put('{_sjson}');"""
        #print(js_code)
        self.browser.page().runJavaScript(js_code, self.js_result)

    @pyqtSlot(object)
    def js_result(self, result):
        """
        JavaScript 실행이 완료된 후 호출되는 콜백 함수
        result는 JavaScript의 반환값
        """
        if isinstance(result, str):
            print(f"JavaScript 실행 결과: {result}")
        # else:
        #     print(f"JavaScript 실행 결과 (타입: {type(result)}): {result}")

if __name__ == "__main__":
    # -----------------
    # exception handler
    # -----------------
    def exception_hook(exc_type, exc_value, tb):
        sys.__excepthook__(exc_type, exc_value, tb)
        #print("exception_hook:{0},{1}".format(exc_type, exc_value))
        window.close()
        sys.exit(1)

    sys.excepthook = exception_hook
    app = QApplication(sys.argv)
    #app.setWindowIcon(QIcon(":AppLogoColor.png"))
    window = MainWindow()
    window.show()
    sys.exit(app.exec())