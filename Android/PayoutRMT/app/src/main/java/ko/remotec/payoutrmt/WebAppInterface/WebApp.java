package ko.remotec.payoutrmt.WebAppInterface;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.net.Uri;
import android.os.Build;
import android.os.Message;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.HttpAuthHandler;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.ConcurrentModificationException;
import java.util.HashMap;

import ko.remotec.payoutrmt.ClassBundle.SharedData;
import ko.remotec.payoutrmt.MainActivity;

/**
 * WebView 설정 및 관련 함수정의
 */
public class WebApp {
    static String TAG = "WebApp";
    public static boolean m_isProgramStart = false;

    WebView m_WebView = null;
    public boolean isPageFinished = false;
    MainActivity mActive = null ;
    private SharedData mSHARE = new SharedData();
    static String Alert_title = "" ; // 알럿창 타이틀명
    public static HashMap<String, String> Return_data ; // javascript로부터 반환(Return)된 값 저장

    private WebApp_start m_webStart = null;
    private WebApp_goods m_webGoods = null;
    //private WebApp_refund m_webRefund = null;
    private ToneGenerator TONE = new ToneGenerator(AudioManager.STREAM_MUSIC, ToneGenerator.MAX_VOLUME);

    AlertDialog alert;
    AlertDialog.Builder builder;

    private String m_PageName;

    private Uri mCapturedImageURI = null;

    /**
     * Instantiate the interface and set the context
     */
    public WebApp(WebView _web_view) {
        //mContext = my.getBaseContext();
        mActive = ((MainActivity)MainActivity.mContext) ;
        m_WebView = _web_view;
        Log.w(TAG, "Class 생성") ;
    }
    /**
     * 웹뷰 설정
     * @param File html파일
     */
    public void WebViewSet(String File){
        //m_WebView = (WebView) findViewById(R.id.WebView);
        WebSettings webSettings = m_WebView.getSettings();
        webSettings.setCacheMode(webSettings.LOAD_CACHE_ELSE_NETWORK);
        webSettings.setJavaScriptEnabled(true);

        webSettings.setPluginState(WebSettings.PluginState.ON);

        /*webSettings.setAllowContentAccess(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);
        */
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true); // 기기내의 html호출시
        webSettings.setAllowUniversalAccessFromFileURLs(true); // 기기내의 html호출시
        webSettings.setDomStorageEnabled(true);

        //화면의 폭이 조절 될수 있도록 한다.
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setAllowFileAccess(true);


        // 웹 디버깅 가능하도록 설정(chrome://inspect)
        m_WebView.setWebContentsDebuggingEnabled(true);
        //웹뷰내 Bitmap을 그릴 수 있도록... 권한을 부여함
        m_WebView.setDrawingCacheEnabled(true);

        //페이지전환시 흰화면 안나오게 하기(바로 아래2줄)
        m_WebView.setBackgroundColor(0x00000000);

        // 하드웨어 가속을 활성화 / 비활성화
        m_WebView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        //m_WebView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);


        m_webStart = new WebApp_start(this);
        m_webGoods = new WebApp_goods(this);
        //m_WebView.addJavascriptInterface(this, "Maru_app");
        m_WebView.addJavascriptInterface(m_webStart, "Maru_start");
        m_WebView.addJavascriptInterface(m_webGoods, "Maru_goods");

        m_WebView.refreshDrawableState();


        m_WebView.setWebViewClient(new CustomWebViewClient()); // WEBVIEW 설정
        //m_WebView.setWebViewClient(new Loadinsame()); // WEBVIEW 설정
        m_WebView.setOnTouchListener(new View.OnTouchListener() {
            int oldX = -1; int oldY = -1;
            @Override
            public boolean onTouch(View view, MotionEvent event) {
               //if(event.getAction() == 0)
                //Log.w(TAG,"setOnTouchListener : " + event.getAction());
//                int x = (int) event.getX();
//                int y = (int) event.getY();
//
//                //Log.i("debug_log", "moving: (" + x + ", " + y + ")");
//
//                switch (event.getAction()) {
//                    case MotionEvent.ACTION_DOWN:
//                        //Log.w("MotionEvent", "touched down");
//                        //m_isDown = true;
//                        break;
//                    case MotionEvent.ACTION_MOVE:
//                        //Log.i("debug_log", "moving: (" + x + ", " + y + ")");
//                        break;
//                    case MotionEvent.ACTION_UP:
//                        //Log.w("MotionEvent", "touched up");
//                        //m_isDown = false;
//                        break;
//                }
                return false;
            }
        });

        //m_WebView.setWebChromeClient(new WebChromeClientSet(mActive)); // Chrome 설정
        m_WebView.setWebChromeClient(new WebChromeClientSet()); // Chrome 설정
        //m_WebView.loadUrl("file:///android_asset/" + File);
        m_WebView.loadUrl("file:///android_asset/" + File);
        Log.w("WEBAPP","####### WebView : " + File);
    }

    public  void StopView(){
        if (m_WebView != null) {
            m_WebView.loadUrl("about:blank");
            m_WebView.loadDataWithBaseURL(null, "", "text/html", "utf-8", null);
            m_WebView = null;
        }
    }

    private class CustomWebViewClient extends WebViewClient {
        /** ↓↓ WebView에서 처음 한 번만 호출되는 메쏘드 ↓↓
         * 페이지 로딩이 시작된 것을 알립니다. 이 메쏘드가 각각의 main frame이 iframe에
         * 페이지를 로드하기 위해 한번 호출되거나  frameset이 main frame에 대해 이 메쏘드를
         * 한번 호출할 것 입니다. 이 메쏘드가 임베디드 프레임 내용이 변경되었을 때 호출되지
         * 않는다는 것도 뜻합니다. 예를 들면, iframe이 있는 대상 링크를 클릭한 것 입니다.
         */

        ProgressDialog progressDialog;
        public void onPageStarted(WebView view, String url, Bitmap favicon) {

            // Then show progress  Dialog
            // in standard case YourActivity.this
//            if (progressDialog == null) {
//                progressDialog = new ProgressDialog(((MainActivity)MainActivity.mContext));
//                progressDialog.setMessage("Loading...");
//                progressDialog.hide();
//            }
        }

        @Override
        public void onPageFinished(final WebView view, final String url) {
            //OS의 파일메니져 종료 후 파일 메니져를 뛰운 ''android-app'을 안보이게 한다.
            //m_WebView.loadUrl("javascript:(function(){document.getElementById('android-app').style.display='none';})()");
            //view.loadUrl("javascript:(function(){document.getElementById('android-app').style.display='none';})()");
//            view.loadUrl("javascript:your javascript");
//            try {
//                // Close progressDialog
//                if (progressDialog != null && progressDialog.isShowing()) {
//                    progressDialog.dismiss();
//                    progressDialog = null;
//                }
//            } catch (Exception exception) {
//                exception.printStackTrace();
//            }

            if(! isPageFinished) {
                 isPageFinished = true;
            }
            /*
             * 화면꽉찬 WebView로 바꾸기
             *
             * invalidate를 안해주게 되면
             * webview에 스크롤바만 생기게 되서 화면이 보기 안좋게 되어 버린다.
             * 그러므로 꼭 invalidate를 해줘야 한다.
             */
            //view.invalidate();
            //MyAsyncTask myAsyncTask = new MyAsyncTask(view);
            //myAsyncTask.execute();

            super.onPageFinished(view, url);
        }

//        @SuppressWarnings("deprecation")
//        @Override
//        public boolean shouldOverrideUrlLoading(WebView view, String url) {
//            Log.w("WebView ", "deprecation: " + url );
//            return false;
//        }
//
//        @TargetApi(Build.VERSION_CODES.N)
//        @Override
//        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
//            view.loadUrl(request.getUrl().toString());
//            Log.w("WebView", "History: " + request.getUrl().toString() );
//            return true;
//        }
         /**
          * WebView가 주어진 URL로 지정된 리소스를 로드할 것이라고 알립니다.
          * 페이지 로딩이 완료될 때까지 여러번 호출됩니다. 페이지가 나뉘어서 로딩되나 봅니다.
          */
         @Override
         public void onLoadResource(WebView view, String url) {
             super.onLoadResource(view, url);
         }
         /**
          * 방문한 링크를 데이터베이스에 업데이트한다고 알립니다.
          */
//         @Override
//         public void doUpdateVisitedHistory(WebView view, String url, boolean isReload) {
//             Log.i("WebView", "History: " + url );
//             super.doUpdateVisitedHistory(view, url, isReload);
//         }
        /**
         * As the host application if the browser should resend data as the requested page
         * was a result of a POST. 기본적으론 데이터를 재발송하지 않는 것입니다.
         */
        @Override
        public void onFormResubmission(WebView view, Message dontResend, Message resend) {
            Log.w(TAG,"onFormResubmission");
            super.onFormResubmission(view, dontResend, resend);
        }

         /**
          * 호스트 응용 프로그램에게 오류를 보고합니다. 이러한 오류는 복구할 수 없습니다.
          * (예, main resource를 사용할 수 없는 상태) errorCode 매개 변수는
          * WebViewClient.ERROR_* 상수 중 하나에 해당합니다.
          */
         @Override
         public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
             super.onReceivedError(view, errorCode, description, failingUrl);

             switch(errorCode) {
                 case ERROR_AUTHENTICATION: break;               // 서버에서 사용자 인증 실패
                 case ERROR_BAD_URL: break;                           // 잘못된 URL
                 case ERROR_CONNECT: break;                          // 서버로 연결 실패
                 case ERROR_FAILED_SSL_HANDSHAKE: break;    // SSL handshake 수행 실패
                 case ERROR_FILE: break;                                  // 일반 파일 오류
                 case ERROR_FILE_NOT_FOUND: break;               // 파일을 찾을 수 없습니다
                 case ERROR_HOST_LOOKUP: break;           // 서버 또는 프록시 호스트 이름 조회 실패
                 case ERROR_IO: break;                              // 서버에서 읽거나 서버로 쓰기 실패
                 case ERROR_PROXY_AUTHENTICATION: break;   // 프록시에서 사용자 인증 실패
                 case ERROR_REDIRECT_LOOP: break;               // 너무 많은 리디렉션
                 case ERROR_TIMEOUT: break;                          // 연결 시간 초과
                 case ERROR_TOO_MANY_REQUESTS: break;     // 페이지 로드중 너무 많은 요청 발생
                 case ERROR_UNKNOWN: break;                        // 일반 오류
                 case ERROR_UNSUPPORTED_AUTH_SCHEME: break; // 지원되지 않는 인증 체계
                 case ERROR_UNSUPPORTED_SCHEME: break;          // URI가 지원되지 않는 방식
             }
             Log.w(TAG,"error : " + errorCode);
         }

         /**
          * 인증 요청을 처리한다고 알립니다. 기본 동작은 요청을 취소하는 것입니다.
          */
         @Override
         public void onReceivedHttpAuthRequest(WebView view, HttpAuthHandler handler, String host, String realm) {
             Log.w(TAG,"onReceivedHttpAuthRequest");
             super.onReceivedHttpAuthRequest(view, handler, host, realm);
         }

         /** ↓↓ 잘못된 키 입력이 있을 경우 호출되는 메쏘드 ↓↓
          * 키가 WebView에 의해 처리되지 않았음을 호스트 응용 프로그램에게 알림.
          * 시스템 키를 제외하고, WebView는 shouldOverrideKeyEvent가 true를 반환하는 경우나
          * 일반적인 flow에서 항상 키 이벤트를 처리합니다. 키 이벤트가 발생된 곳으로 부터
          * 비동기적으로 호출됩니다. 호스트 응용 프로그램에게 처리되지 않은 키 이벤트를 처리할
          * 기회를 제공합니다.
          */
         @Override
         public void onUnhandledKeyEvent(WebView view, KeyEvent event) {
             Log.w(TAG,"onUnhandledKeyEvent");
             super.onUnhandledKeyEvent(view, event);
         }

         /** ↓↓ 잘못된 키 입력이 있을 경우 호출되는 메쏘드 ↓↓
          * 호스트 응용 프로그램에게 동기적으로 키 이벤트를 처리할 기회를 줍니다. 예: 메뉴 바로
          * 가기 키 이벤트를 이런식으로 필터링해야합니다. true를 반환할 경우, WebView는 키 이벤트를
          * 처리하지 않습니다. false를 반환할 경우, WebView 항상 키 이벤트를 처리합니다. So none
          * of the super in the view chain will see the key event. 기본 동작은 false를 반환합니다.
          */
         @Override
         public boolean shouldOverrideKeyEvent(WebView view, KeyEvent event) {
             Log.w(TAG,"shouldOverrideKeyEvent");
             return super.shouldOverrideKeyEvent(view, event);
         }

        @Override
        public void onReceivedError(final WebView webview, WebResourceRequest request, WebResourceError error) {
            Log.w(TAG,"error : " + error);
            super.onReceivedError(webview, request, error);
            //pro_dialog.dismiss();
            // dialog_Show(webview, "Error Occur, Do you want to Reload?", true);
        }
    }

    public static class WebChromeClientSet extends WebChromeClient {
//        @Override
//        public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
//            //Log.i("WEB-Console-log", consoleMessage.message() + '\n' + consoleMessage.messageLevel() + '\n' + consoleMessage.sourceId());
//            Log.e("WEBVIEW-CONSOLE", consoleMessage.message() + " -- From line "
//                    + consoleMessage.lineNumber() + " of "
//                    + consoleMessage.sourceId() );
//            return super.onConsoleMessage(consoleMessage);
//        }

//        private ValueCallback<Uri[]> mFilePathCallback;
        MainActivity mActive;
//
        public WebChromeClientSet(){
            mActive = ((MainActivity)MainActivity.mContext) ;
        }

//        public void onProgressChanged(WebView view, int progress) {
//            // Activities and WebViews measure progress with different scales.
//            // The progress meter will automatically disappear when we reach 100%
//            m_Active.setProgress(progress * 1000);
//        }

        //Logcat에서 javascript의 console.log를 보려면
        @Override
        public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
            Log.w(TAG, consoleMessage.message() + '/' + consoleMessage.messageLevel() + '/' + consoleMessage.sourceId());
            return super.onConsoleMessage(consoleMessage);
        }

        @Override
        public boolean onJsAlert(WebView view, String url, String message, final JsResult result) {
            // TODO Auto-generated method stub
            //return super.onJsAlert(view, url, message, result);
            Log.w(TAG, "onJsAlert(!" + view + ", " + url + ", " + message + ", " + result + ")");
            new AlertDialog.Builder(view.getContext())
                    //.setTitle("알림")
                    .setTitle(Alert_title)
                    .setMessage(message)
                    .setPositiveButton(android.R.string.ok,
                            new AlertDialog.OnClickListener(){
                                public void onClick(DialogInterface dialog, int which) {
                                    result.confirm();
                                }
                            })
                    .setCancelable(false)
                    .create()
                    .show();
            return true;
        }

        @Override
        public boolean onJsConfirm(WebView view, String url, String message, final JsResult result) {
            // TODO Auto-generated method stub
            //return super.onJsConfirm(view, url, message, result);
            Log.w(TAG, "onJsConfirm(!" + view + ", " + url + ", " + message + ", " + result + ")");
            new AlertDialog.Builder(view.getContext())
                    //.setTitle("알림")
                    .setTitle(Alert_title)

                    .setMessage(message)
                    .setPositiveButton("네",
                            new AlertDialog.OnClickListener(){
                                public void onClick(DialogInterface dialog, int which) {
                                    result.confirm();
                                }
                            })
                    .setNegativeButton("아니오",
                            new AlertDialog.OnClickListener(){
                                public void onClick(DialogInterface dialog, int which) {
                                    result.cancel();
                                }
                            })
                    .setCancelable(false)
                    .create()
                    .show();
            return true;
        }
    }

    //json-------------------------------------------------------------
    public String JsonOneData(String _node, String _value) {
        JSONObject jObject = new JSONObject();//배열 내에 들어갈 json
        try {
            jObject.put(_node, _value);
        } catch (JSONException e) {
            Log.e("jsonError", "Exception ERROR");
            e.printStackTrace();
        }
        return jObject.toString();
    }

    JSONArray m_jArray = null;
    //JSONObject m_jFinal = null;
    public void JsonArrayAdd(JSONObject _jobject){
        if (m_jArray == null)
            m_jArray = new JSONArray();//배열 내에 들어갈 json
        m_jArray.put(_jobject);
    }

    public String JsonArrayGetString(){
        if (m_jArray == null)
            return null;

        String jsonReturn = null;
        try {
            jsonReturn = m_jArray.toString();
            jsonReturn = new String(jsonReturn.getBytes());
        }catch(ConcurrentModificationException conEx){
            jsonReturn = null;

        }
        m_jArray = null;
        return jsonReturn;
    }
    public String JsonArrayGetStrRemaind(){
        if (m_jArray == null)
            return null;

        String jsonReturn = null;
        try {
            jsonReturn = m_jArray.toString();
            jsonReturn = new String(jsonReturn.getBytes());
        }catch(ConcurrentModificationException conEx){
            jsonReturn = null;
        }
        return jsonReturn;
    }

    public JSONArray JsonArrayGetData(){
        if (m_jArray == null)
            return null;

        JSONArray rJArray = m_jArray;
        m_jArray = null;
        return m_jArray;
    }

    JSONObject m_jObject = null;
    public void JsonMultiAdd(String _node, String _value) {
        if (m_jObject == null)
            m_jObject = new JSONObject();//배열 내에 들어갈 json
        try {
            m_jObject.put(_node, _value);
        } catch (JSONException e) {
            Log.e("jsonError", "Exception ERROR");
            e.printStackTrace();
        }
    }

    public String JsonMultiGetData(String _node, String _value) {
        String jsonReturn = null;
        if(m_jObject == null)
            m_jObject = new JSONObject();//배열 내에 들어갈 json
        try {
            m_jObject.put(_node, _value);
            jsonReturn = m_jObject.toString();
            jsonReturn = new String(jsonReturn.getBytes());
        } catch (JSONException e) {
        } catch (ConcurrentModificationException conEx) {
        } catch (NullPointerException nEx) {
        }
        m_jObject = null;
        return jsonReturn;
    }

    public String JsonMultiGetString() {
        if (m_jObject == null)
            return null;

        String jsonReturn = null;
        try {
            jsonReturn = m_jObject.toString();
            jsonReturn = new String(jsonReturn.getBytes());
        }catch(ConcurrentModificationException conEx){
            jsonReturn = null;
        }
        m_jObject = null;
        return jsonReturn;
    }
    public String JsonMultiGetStrRemaind() {
        if (m_jObject == null)
            return null;

        String jsonReturn = null;
        try {
            jsonReturn = m_jObject.toString();
            jsonReturn = new String(jsonReturn.getBytes());
        }catch(ConcurrentModificationException conEx){
            jsonReturn = null;
        }
        return jsonReturn;
    }
    public JSONObject JsonMultiGetObject() {
        if (m_jObject == null)
            return null;
        JSONObject rObject = m_jObject;
        m_jObject = null;
        return rObject;
    }
    public void jsonDelObjArray() {
        m_jObject = null;
        m_jArray = null;
    }

    @JavascriptInterface
    public void btn_Sound_Beep(){
        //Log.w(TAG, "Beep Test");
        TONE.startTone(ToneGenerator.TONE_DTMF_S, 90);
    }
    //------------------------------------------------------------------

    //------------------------------------------------------------------
    @JavascriptInterface
    public void callback(String value) {
        if(value != null && !value.isEmpty()) {
            Return_FromJavascript(value);
        }
        Log.w("callback", value.toString());
    }

//    /**
//     * WebView javascript 실행
//     * @param sFunc
//     **/

    public void IconChange(final int nBtn, final int nName){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other = "Icon_Change(" + String.format("'%02d','%03d'", nBtn, nName) + ");";
                    //Log.w("WebApp 228", Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s != null && !s.isEmpty()) {
                                Return_FromJavascript(s);
                            }
                        }
                    });
                }
            });
        }
    }

    public void ErrorToJS_EXEC(final String _sJson, final String _sID){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other = "Put_list('" + _sJson + "','" + _sID + "');";
                    Log.w("WebApp 228", Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s != null && !s.isEmpty()) {
                                Return_FromJavascript(s);
                            }
                        }
                    });
                }
            });
        }
    }

    public void CheckToJS_EXEC(final String _sJson, final String _sID){
        CheckToJS_EXEC(_sJson, _sID, null);
    }

    public void CheckToJS_EXEC(final String _sJson, final String _sID, final String _sTID){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other;
                    if (_sTID == null) {
                        Other = "checkbox_Activate('" + _sJson + "','" + _sID + "');";
                    } else {
                        Other = "checkbox_Activate('" + _sJson + "','" + _sID + "','" + _sTID + "');";
                    }
                    Log.w("WebApp 256", Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {

                        @Override
                        public void onReceiveValue(String s) {
                            if (s != null && !s.isEmpty()) {
                                Return_FromJavascript(s);
                            }
                        }
                    });
                }
            });
        }
    }

    public void FileToJS_EXEC(final String _sJson, final String _sID){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    //m_WebView.loadUrl(sFunc);
                    String Other = "Put_Document_list('" + _sJson + "','" + _sID + "');";
                    //Log.w("WepApp", "Put_Document_list : " + Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {

                        @Override
                        public void onReceiveValue(String s) {
                            if (s != null && !s.isEmpty()) {
                                Return_FromJavascript(s);
                            }
                        }
                    });
                }
            });
        }
    }

    public void MainToJS_EXEC(final String _sFunc, final String _sParameter){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    //m_WebView.loadUrl(sFunc);
                    String Other = _sFunc + "('" + _sParameter + "');";
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {

                        @Override
                        public void onReceiveValue(String s) {
                            if (s != null && !s.isEmpty()) {
                                Return_FromJavascript(s);
                            }
                        }
                    });
                }
            });
        }
    }

    public void MainToJS_EXEC(final String _sFunc, final String _sMethod, final String _sJson){
        //Log.w("WebViewJS", "set_class_element('" + _sFunc + "', '" + _sJson);
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    //m_WebView.loadUrl(sFunc);
                    //String Other = _sFuncName + "(" + _sCommand + ")";
                    String Other = _sFunc + "('" + _sMethod + "', '" + _sJson + "');";
//                Log.w("WebViewJS", Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                //Return_FromJavascript(s);
                                Log.w("ValueCallback 1: ", s);
                            }

                        }
                    });
                }
            });
        }
    }

    public void Action_Activate(final String _dPage, final String _sMethod, final String _sJson){ //
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    //m_WebView.loadUrl(sFunc);
                    //String Other = _sFuncName + "(" + _sCommand + ")";
                    String Other = "action_Activate('" + _dPage + "', '" + _sMethod + "', '" + _sJson + "');";
                    //Log.w("Action_Activate", Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            //Log.w("WebViewJS", s);
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                //Return_FromJavascript(s);
                                Log.w("ValueCallback 2: ", s);
                            }
                        }
                    });
                }
            });
        }
    }

    public void File_List(final String _sID, final String _sJson){ //
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other = "check_flist_put('" + _sJson + "', '" + _sID + "');";
                    //Log.w("WebViewJS", Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                //Return_FromJavascript(s);
                                Log.w("Table => list_put : ", s);
                            }
                        }
                    });
                }
            });
        }
    }

    public void Table_Action(final String _sID, final String _sJson){
        Table_Action(_sID, _sJson, null);
    }

//list_put = function(json, id){
    public void Table_Action(final String _sID, final String _sJson, final String _char){ //
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other;
                    if(_char == null) {
                        Other = "list_put('" + _sJson + "', '" + _sID + "');";
                    }else{
                        Other = "list_put('" + _sJson + "', '" + _sID + "', '" + _char + "');";
                    }
                    //Log.w("WebViewJS", Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                //Return_FromJavascript(s);
                                Log.w("Table => list_put : ", s);
                            }
                        }
                    });
                }
            });
        }
    }

    public void Group_Select(final String _sID, final int _sel, final int _num){
        Group_Select(_sID, _sel, _num, null);
    }

    public void Group_Select(final String _sID, final int _sel, final int _num, final String _sColor){ //
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other = "Group_Select('" + _sID + "', '" + _sel + "', '" + _num + "', '" + _sColor + "');";
                    //Log.w("WebViewJS", Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                //Return_FromJavascript(s);
                                Log.w("Table => list_put : ", s);
                            }
                        }
                    });
                }
            });
        }
    }

    public void Table_Line(int[][] a_data, int _start, int _length, String sID, int _line_size, String _sColor)
    {
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other;
                    for (int i = 0; i < _length; i++) //i < 999
                    {
                        //Log.w(TAG, "Table_Line : " + sID + ", " + i + ", " + _start + ", " + _line_size);
                        Other = "Table_Line('" + sID + String.format("%02d", i) + "', '" + a_data[i + _start][0] + "', '" + a_data[i + _start][1] + "', '" + _line_size + "', '" + ((a_data[i + _start][1] == 0) ? _sColor:mSHARE.CellColor[a_data[i + _start][1]-1]) + "');";
                        //Log.w(TAG, "Table_Line : " + Other);
                        m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                            @Override
                            public void onReceiveValue(String s) {
                                if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                    //Return_FromJavascript(s);
                                    Log.w("Table_Line : ", s);
                                }
                            }
                        });
                    }
                }
            });
        }
    }

    //private boolean IsVisualDlg = false;
    public void OpenModal(String _sModal, String _sName)
    { //
        OpenModal(_sModal, _sName, "null");
    }

    public void OpenModal(String _sModal, String _sName, String _sMessage)
    {
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                String sModal = _sModal.toLowerCase();
                String Other;
                @Override
                public void run() {
                    if (sModal.indexOf("confirm") >= 0)
                    {
                        Other = "ConfirmModal." + sModal + "Box('show', '" + _sName +"', '" + _sMessage + "');";
                    }
                    else if (sModal.indexOf("menu") >= 0)
                    {
                        Other = "MenuModal." + sModal + "Box('show', '" + _sName +"', '" + _sMessage + "');";
                    }
                    else
                    {
                        Other = "Modal." + sModal + "Box('show', '" + _sName +"', '" + _sMessage + "');";
                    }
                    //Log.w("WebApp", "SelectBtnToJS " + Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                Log.w("selectBtn : ", s);
                            }
                        }
                    });
                }
            });
        }
        //IsVisualDlg = true;
    }

    public void SelectBtnToJS(final String _sID, final String _pageName, final boolean _isAct){ //
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other = "select_red('" + _sID + "', '" + _pageName + "', " + _isAct + ");";
                    //Log.w("WebApp", "SelectBtnToJS " + Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                Log.w("selectBtn : ", s);
                            }
                        }
                    });
                }
            });
        }
    }

    public void SetElementToJS(final String _dPage, final String _sJson){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other = "set_class_element('" + _dPage + "', '" + _sJson + "');";
                    //Log.w("WebViewJS", Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                //Return_FromJavascript(s);
                                Log.w("ValueCallback 2: ", s);
                            }

                        }
                    });
                }
            });
        }
    }

    public void SetProgressToJS(final String _name, final String _sJson){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other = "progress('" + _name + "', '" + _sJson + "');";
                    //Log.w(TAG, "SetProgressToJS : " + Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                //Return_FromJavascript(s);
                                Log.w("ValueCallback 2: ", s);
                            }
                        }
                    });
                }
            });
        }
    }

    public void WebViewJS_EXEC(final String WebApp_kind, final String sFunc){
        synchronized(mActive.m_ObjSyn) {
            try {
                m_WebView.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        //m_WebView.loadUrl(sFunc);
                        if (Build.VERSION.SDK_INT >= 19) {

                            m_WebView.evaluateJavascript("javascript:" + sFunc, new ValueCallback<String>() {

                                @Override
                                public void onReceiveValue(String s) {
                                    if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                        Return_FromJavascript(s);
                                        Log.e("ValueCallback 3: ", s);
                                    }
                                }
                            });
                        } else {
                            //m_WebView.loadUrl("javascript:" + sFunc);
                            m_WebView.loadUrl("javascript:window." + WebApp_kind + ".callback(" + sFunc + ")");
                        }
                    }
                }, 30);
            } catch (NullPointerException nullEx) {
            }
        }
    }

    public void WebViewJS_EXEC(final String sFunc){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    //Log.w(TAG, "WebViewJS_EXEC : " + "javascript:" + sFunc);
                    m_WebView.evaluateJavascript("javascript:" + sFunc, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                Return_FromJavascript(s);
                                Log.e("ValueCallback 3: ", s);
                            }
                        }
                    });
                }
            });
        }
    }

    //기계 좌표등 텍스트가 빠르게 표시 되어야 하는 부분 표시
    public void TEXTtoJS_EXEX(final String WebApp_kind, final String sFunc){
        synchronized(mActive.m_ObjSyn) {
            try {
                m_WebView.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        if (Build.VERSION.SDK_INT >= 19) {
                            m_WebView.evaluateJavascript("javascript:" + sFunc, new ValueCallback<String>() {
                                @Override
                                public void onReceiveValue(String s) {
                                    if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                        Return_FromJavascript(s);
                                        Log.e("ValueCallback 4: ", s);
                                    }
                                }
                            });
                        } else {
                            m_WebView.loadUrl("javascript:window." + WebApp_kind + ".callback(" + sFunc + ")");
                        }
                    }
                }, 1);
            } catch (NullPointerException nullEx) {
            }
        }
    }
    public void TEXTtoJS_EXEX(final String sFunc){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    m_WebView.evaluateJavascript("javascript:" + sFunc, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                Return_FromJavascript(s);
                                Log.e("ValueCallback 4: ", s);
                            }
                        }
                    });
                }
            });
        }
    }

    public void ScrollListToJS(final String _block_id, final String _target_id, final String _max_id){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other = "targetScrollMove('" + _block_id + "', '" + _target_id + "', '" + _max_id + "');";
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                //Return_FromJavascript(s);
                                Log.w("ValueCallback 2: ", s);
                            }
                        }
                    });
                }
            });
        }
    }

    /**
     * WebView의 자바스크립트로부터 리턴 받은값
     * @param Str
     * @return
     */
    public void Return_FromJavascript(String Str)
    {
        Gson gson = new Gson();
        Type listType = new TypeToken<HashMap<String, String>>() { }. getType();
        Return_data = gson.fromJson(Str, listType);

        Log.e("Return Values : ", String.valueOf(Return_data)) ;
    }

    /**
     * 요청시 콜백 응답처리
     * @param callback 콜백함수
     * @param data 전달값
     * @return String
     */
    public String javascript_Callback(String callback, String data){
        String sFunc = "" ;
        if(callback != null && !callback.isEmpty()) {
            //Log.i("callback", callback);
            sFunc = "(function() { "
                    + "var callback = " + callback + ";"
                    + "callback('" + data + "');"
                    + "})()";
        }
        Log.w("callback", callback);

        return sFunc ;
    }

    /*
     * 텍스트 가져오기, 출력하기
     * @param  //WebApp_kind 예제)WebApp_home or WebApp_desing ...
     * @param Method GET(가져오기), PUT(출력하기)
     * @param //Json
     */

    public void TEXT_Put(String _json)
    {
        //Log.w("TEXT_Put", Json);
        //Log.w("WebApp", "TEXT_Group : " + _json + ", page : " + m_PageName);
        TEXTtoJS_EXEX(m_PageName, "Text_put('" + _json + "');"); ;
    }

    public void TEXT_Group(String _name, String _json)
    {
        //Log.e("TEXT_Group", Json);
        WebViewJS_EXEC(m_PageName, "Text_Group('" + _name + "', '" + _json + "');");
    }

    public void TEXT_Group(String _name, String _json, int _radix)
    {
        //Log.w("WebApp", "TEXT_Group : " + _json + "', '" + _radix);
        WebViewJS_EXEC(m_PageName, "Text_Group('" + _name + "', '" + _json + "', '" + _radix + "');");
    }

    public void OneList_Put(String _name, String _comma){
        TEXTtoJS_EXEX(m_PageName, "oneList_put('" + _name + "', '" + _comma + "');"); ;
    }

    public void Refund_Put(String _name, String _comma){
        TEXTtoJS_EXEX(m_PageName, "refund_put('" + _name + "', '" + _comma + "');"); ;
    }

    public void OnGoPage(String _name)
    {
        String sFunc = "Evnt.btn." + _name  + ".Response();";
        WebViewJS_EXEC(sFunc);
    }

    public void setTableBlock(final String _name, final int _index, final String _data){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other = "text_string_array('" + _name + "', '" + _index +  "', '" + _data + "');";
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                Log.w(TAG, "  setTableBlock : NULL or Empth");
                            }
                        }
                    });
                }
            });
        }
    }

    public void EditAppend(final String _id, final String _str){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String sTemp = _str.replace("\r\n", "<br />");
                    sTemp = sTemp.replace("\n", "<br />");
                    String Other = "edit_append('" + _id + "', '" + sTemp + "');";
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                Log.w(TAG,"EditAppend : NULL");
                            }
                        }
                    });
                }
            });
        }
    }



    public void VertcalSliderCtrl(final String _id, final int _nowPage, final int _sizeOneTable, final int _sizeLine){
        int _pageNum = _sizeLine / _sizeOneTable;
        if(_sizeLine % _sizeOneTable == 0)
            _pageNum -= 1;
        final int _pageMax = _pageNum;
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other = "vertcal_slider_ctrl('" + _id + "', '" + _nowPage + "', '" + _pageMax + "');";
                    //Log.w(TAG, "VertcalSliderCtrl : " + Other);
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                Log.w(TAG,"EditAppend : NULL");
                            }
                        }
                    });
                }
            });
        }
    }

    public void freshSel(final String _id, final String _json){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other = "freshSel('" + _id + "', '" + _json + "');";
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                //Return_FromJavascript(s);
                                Log.w("ValueCallback 2: ", s);
                            }
                        }
                    });
                }
            });
        }
    }

    public void setSelIndex(final String _id, final int _index){
        synchronized(mActive.m_ObjSyn) {
            m_WebView.post(new Runnable() {
                @Override
                public void run() {
                    String Other = "setSelIndex('" + _id + "', '" + _index + "');";
                    m_WebView.evaluateJavascript("javascript:" + Other, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if (s == null || s.isEmpty() || s.indexOf("null") < 0) {
                                //Return_FromJavascript(s);
                                Log.w("ValueCallback 2: ", s);
                            }
                        }
                    });
                }
            });
        }
    }

    @JavascriptInterface
    public void ProgramStart(){
        Log.w("WEBAPP", "## ProgramStart");
        m_isProgramStart = true;
    }

    public boolean isProgramStart() {
        return m_isProgramStart;
    }

    public void setPageName(String _name){
        m_PageName = _name;
    }
    public String getPageName(){
        return m_PageName;
    }
}