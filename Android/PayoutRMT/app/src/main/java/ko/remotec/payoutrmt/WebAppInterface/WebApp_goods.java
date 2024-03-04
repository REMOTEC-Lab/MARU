package ko.remotec.payoutrmt.WebAppInterface;

import android.content.Intent;
import android.util.Log;
import android.webkit.JavascriptInterface;

import java.text.SimpleDateFormat;
import java.util.Date;

import ko.remotec.payoutrmt.ClassBundle.SharedData;
import ko.remotec.payoutrmt.MainActivity;
import ko.remotec.payoutrmt.WebAppInterface.WebApp;

public class WebApp_goods {
    MainActivity mActive  ;
    WebApp mMaruApp = null ;
    String WApp_name;
    String TAG = "WebApp_goods";
    String m_sPage = "";
    private SharedData mSHARE = new SharedData();
    private int m_nKinds = 0;

    public WebApp_goods(WebApp app) {
        mMaruApp = app;
        mActive = ((MainActivity)MainActivity.mContext) ;
    }

    /**
     * 페이지 로딩완료후 바로 실행
     */
    @JavascriptInterface
    public void pageLoaded(String page) {
        mActive.PAGE = MainActivity.PageType.GOODS;
        mActive.m_sPage = m_sPage = page;
        mMaruApp.setPageName(m_sPage);
        SimpleDateFormat sdFmt = new SimpleDateFormat("yyyy년 MM월 dd일 (E) a hh시 mm분");
        //mMaruApp.TEXT_Put(mMaruApp.JsonOneData(m_sPage.split("_",0)[0].toUpperCase() + "_TIMER", sdFmt.format(new Date())));

        mActive.m_touch = false;
    }
    @JavascriptInterface
    public void pageEnd(String page){
        mActive.OldPAGE = mActive.PAGE;
        mActive.PAGE = MainActivity.PageType.NoPage;
    }

    @JavascriptInterface
    public void btn_goHOME() {
        //Log.w(TAG, "btn_goHOME");
        String sFunc = "Evnt.btn.GO_HOME.Response();";
        mMaruApp.WebViewJS_EXEC(sFunc);
    }

    @JavascriptInterface
    public void btn_changeChildPage(String page) {
        Log.w(TAG, "btn_changeChildPage : " + page);

//        mMaruApp.JsonMultiAdd("MDRINK", "deactive");
//        mMaruApp.Action_Activate(page, "BTN", mMaruApp.JsonMultiGetData("MSIDE", "deactive"));
    }

    @JavascriptInterface
    public void btn_Payment() {
        mMaruApp.OpenModal("confirm", "CONFIRM", "웹 모달 테스트 입니다.");
    }
}
