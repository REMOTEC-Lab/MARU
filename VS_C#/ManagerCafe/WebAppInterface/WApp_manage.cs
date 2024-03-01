using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManagerCafe.WebAppInterface
{
    class WApp_manage
    {
        WebApp mMaruApp = null;
        ActiveForm mActive = null;
        String WApp_name;

        String TAG = "WApp_manage";

        public WApp_manage(WebApp _pApp, ActiveForm _pActive)
        {
            mMaruApp = _pApp;
            mActive = _pActive;

            WApp_name = this.GetType().Name;
        }

        public void pageLoaded(string _page)
        {
            mActive.PAGE = 3;
            mActive.m_sPage = _page;
        }

        public void pageEnd(string _page)
        {
            mActive.PAGE = 0;
        }

        public void btn_goLogout()
        {
            String sFunc = "Evnt.btn.LOGOUT.Response();";
            mMaruApp.WebViewJS_EXEC(sFunc);
        }

        public void btn_Confirm()
        {
            mMaruApp.OpenModal("confirm", "CONFIRM", "웹 모달 테스트 입니다.");
        }

        public void btn_Append()
        {
            mActive.mMsgBox.Show("'추가하기'버튼 누름, 3초  후 사라짐(C# Dialog)", 3000);
        }
    }
}
