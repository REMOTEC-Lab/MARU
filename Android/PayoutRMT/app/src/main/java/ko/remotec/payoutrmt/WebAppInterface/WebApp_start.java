package ko.remotec.payoutrmt.WebAppInterface;

import android.content.Intent;
import android.util.Log;
import android.webkit.JavascriptInterface;

import java.text.SimpleDateFormat;
import java.util.Date;

import ko.remotec.payoutrmt.ClassBundle.SharedData;
import ko.remotec.payoutrmt.MainActivity;

public class WebApp_start {
    MainActivity mActive  ;
    WebApp mMaruApp = null ;
    //String WebApp_name = this.getClass().getSimpleName();

    String TAG = "WebApp_start";
    String m_sPage = "";
    private SharedData mSHARE = new SharedData();
    private int m_nKinds = 0;

    public WebApp_start(WebApp app) {
        //mContext = my.getBaseContext();
        mMaruApp = app;;
        //mActive = my;
        mActive = ((MainActivity)MainActivity.mContext) ;

        //m_WebView = WebView ;
        //Log.w(TAG, mActive.getClass().getSimpleName()) ;
    }

    /**
     * 페이지 로딩완료후 바로 실행
     */
    @JavascriptInterface
    public void pageLoaded(String page) {
        mActive.PAGE = MainActivity.PageType.START;
        mActive.m_sPage = m_sPage = page;
        mMaruApp.setPageName(m_sPage);
        SimpleDateFormat sdFmt = new SimpleDateFormat("yyyy년 MM월 dd일 (E) a hh시 mm분");

        mActive.m_touch = false;
    }
    @JavascriptInterface
    public void pageEnd(String page){
        mActive.OldPAGE = mActive.PAGE;
        mActive.PAGE = MainActivity.PageType.NoPage;
    }

    @JavascriptInterface
    public void btn_IsMEMBER() {
        //Log.w(TAG, "btn_IsMEMBER");
        String sFunc = "Evnt.btn.IS_MEMBER.Response();";
        mMaruApp.WebViewJS_EXEC(sFunc);

    }
}