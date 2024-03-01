using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManagerCafe.WebAppInterface
{
    class WApp_login
    {
        WebApp mMaruApp = null;
        ActiveForm mActive = null;
        String WApp_name;

        String TAG = "WApp_login";

        public WApp_login(WebApp _pApp, ActiveForm _pActive)
        {
            mMaruApp = _pApp;
            mActive = _pActive;

            WApp_name = this.GetType().Name;
        }

        public void pageLoaded(string _page)
        {
            mActive.PAGE = 2;
            mActive.m_sPage = _page;
        }

        public void pageEnd(string _page)
        {
            mActive.PAGE = 0;
            mMaruApp.JsonMultiAdd("USER_ID", "");
            mMaruApp.TEXT_PUT(mMaruApp.JsonMultiGetData("USER_PW", ""));
        }

        public void btn_Login()
        {
            String sFunc = "Evnt.btn.LOGIN.Response();";
            mMaruApp.WebViewJS_EXEC(sFunc);
        }
    }
}
