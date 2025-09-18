from enum import Enum

class ShareData:
    # 내부 클래스로 상태(State) Enum 정의
    class PageType(Enum):
        NoPage = 0
        START = 1
        GOODS = 2

    PAGE = PageType.NoPage
    OldPAGE = PageType.NoPage

    nDataSize = 20
