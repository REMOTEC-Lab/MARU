package ko.remotec.payoutrmt;

import androidx.appcompat.app.AppCompatActivity;

import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.text.SpannableString;
import android.text.style.RelativeSizeSpan;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebView;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

import ko.remotec.payoutrmt.ClassBundle.SharedData;
import ko.remotec.payoutrmt.WebAppInterface.WebApp;

public class MainActivity extends AppCompatActivity {
    public static Object m_ObjSyn = new Object();
    public final int DLGPointX = 620;
    public final int DLGPointY = 350;
    static String TAG = "MainActivity";

    public int START =       1;
    public enum PageType{
        NoPage, START, GOODS
    }
    public static PageType PAGE = PageType.NoPage;
    public static PageType OldPAGE = PageType.NoPage;

    public Connection DbConn = null;
    BackWorker mBackWork = new BackWorker();
    SimpleDateFormat format2 = new SimpleDateFormat("HHmmss");
    SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");

    //-DB connector --------------------------^

    private static WebApp mMaruApp = null;
    public static Context mContext;
    public static WebView m_WebView = null;
    public static String m_sPage = null;
    public static boolean m_touch = true;
    //private Intent mIntent;
    private SharedData mSHARE = new SharedData();

    private ProgressDialog m_ProgressDialog;
    private Handler m_progressHandler;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //화면 꺼짐 방지
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        //상태바 제거
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        //하단바 제거
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LOW_PROFILE
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);
        setContentView(R.layout.activity_main);

//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
//            if (!Settings.canDrawOverlays(this)) {
//                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + getPackageName()));
//                startActivityForResult(intent, 0);
//            }
//        }
        m_WebView = findViewById(R.id.WebView);
        getWindowManager().getDefaultDisplay().getSize(mSHARE.DisplaySize);
        //Log.w(TAG,"Display size : " + mSHARE.DisplaySize.x + ", " + mSHARE.DisplaySize.y);

        mMaruApp = new WebApp(m_WebView);
        m_progressHandler = new Handler();
        mMaruApp.WebViewSet("form/html/start.html");

        //mBackWork.execute();
    }
    public void App_close(){
        moveTaskToBack(true);						// 태스크를 백그라운드로 이동
        finishAndRemoveTask();						// 액티비티 종료 + 태스크 리스트에서 지우기
        android.os.Process.killProcess(android.os.Process.myPid());	// 앱 프로세스 종료
    }

    public void WaitProgress(String _sMessage, int _nDelay){
        final String sMessage = _sMessage;
        final int nDelay = _nDelay;
        runOnUiThread(new Runnable(){
            @Override
            public void run(){
                //m_ProgressDialog = ProgressDialog.show(MainActivity.this,"",sMessage,true);
                m_ProgressDialog = new ProgressDialog(MainActivity.this);
                m_ProgressDialog.getWindow().setFlags(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE, WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE);

                SpannableString ss=  new SpannableString(sMessage);
                ss.setSpan(new RelativeSizeSpan(1.5f), 0, ss.length(), 0);
                m_ProgressDialog.setMessage(ss);
                m_ProgressDialog.setCancelable(false);
                m_ProgressDialog.show();
                //Set the dialog to immersive
                m_ProgressDialog.getWindow().getDecorView().setSystemUiVisibility(MainActivity.this.getWindow().getDecorView().getSystemUiVisibility());
                //Clear the not focusable flag from the window
                m_ProgressDialog.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE);
                //Log.w("MainActivity","dismiss :1 " +  sMessage + ", " + nDelay);
                //Log.w("MainActivity","dismiss :1 " + m_ProgressDialog.isShowing());
                m_progressHandler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            if (m_ProgressDialog != null && m_ProgressDialog.isShowing()) {
                                //Log.w("MainActivity","dismiss :2 " +  sMessage + ", " + nDelay);
                                m_ProgressDialog.dismiss();
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        //Log.w("MainActivity","dismiss :2 " + m_ProgressDialog.isShowing());
                        m_ProgressDialog = null;
                    }
                }, nDelay);
            }
        } );
    }
    public void KillProgress(){
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    if (m_ProgressDialog != null && m_ProgressDialog.isShowing()) {
                        m_ProgressDialog.dismiss();
                        m_progressHandler.removeMessages(0);
                        m_ProgressDialog = null;
                        //Log.w("Main 668", "dismiss :3");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public boolean StateProgress(){
        if(m_ProgressDialog == null)
            return false;
        return m_ProgressDialog.isShowing();
    }

    class BackWorker extends AsyncTask<String,Void,String> {
        public String result;
        MainActivity mActive = ((MainActivity)MainActivity.mContext);
        boolean isAct = true;
        int nCnt = 0;
        String user = "motec";
        String pass = "motec01";
        String jdbc_url = "jdbc:mysql://localhost:3306/rmt";

        @Override
        protected String doInBackground(String... params) {
            //Log.w("MAIN -> DBConnect", "doInBackground");
            try{
//                if(DbConn != null){
//                    DbConn.close();
//                    DbConn =  null;
//                };
                Class.forName("com.mysql.jdbc.Driver").newInstance();
                Properties props = new Properties();
                props.setProperty("user", user);
                props.setProperty("password", pass);
                props.setProperty("useSSL", "false");
                props.setProperty("useUnicode", "true");
                props.setProperty("characterEncoding", "UTF-8");
                DbConn = DriverManager.getConnection(jdbc_url, props);
            }catch (ClassNotFoundException | IllegalAccessException | InstantiationException |
                    SQLException e){
                Log.e(TAG, "Error reading DB : " + e);
            }

            while(isAct){
                //background funtion
                BackGroundActive();
                //화면의 현재 시계를 구동한다.
                if((nCnt % 10) == 0) {
                    displayTimer();
                }
                if(20 <= nCnt++) {
                    nCnt = 0;
                }
                try{
                    Thread.sleep(3000);
                }catch (InterruptedException nEx){}
            }

            return result;
        }

        @Override
        protected void onProgressUpdate(Void... values) {
            super.onProgressUpdate(values);
        }
        @Override
        protected void onPostExecute(String s) {
            Log.w(TAG, "BackWorker onPostExecute : " + s);
            super.onPostExecute(s);
        }
        public void kill(){
            isAct = false;
        }
        public void displayTimer(){
            if(m_sPage != null) {
                SimpleDateFormat sdFmt = new SimpleDateFormat("yyyy년 MM월 dd일 (E) a hh시 mm분");
                mMaruApp.TEXT_Put(mMaruApp.JsonOneData(m_sPage.split("_",0)[0].toUpperCase() + "_TIMER", sdFmt.format(new Date())));
                //Log.w(TAG, "Timer : " + sdFmt.format(new Date()) + " : " + m_sPage.split("_",0)[0].toUpperCase() + "_TIMER");
            }
        }

        int nGate = 0;
        int nOldErr = -1, nNewErr = 0;
        int nOldWNum = 0, nWaitNum = 0;
        String sOldData = "000", sPrepare = "", sComplete = "", sRefund = "";
        public void BackGroundActive(){
            //항상 데이터 베니스에 핑을 손다.
            //new Thread(ping).start();

            if(DbConn == null) {
            //if(DbConn == null || !mMaruApp.isPageFinished) {
                Log.e(TAG, "backWorker error");
                return;
            }
            Statement st0 = null;
            ResultSet rs0 = null;
            try{
                st0 = DbConn.createStatement();
//                rs0 = st0.executeQuery("SELECT _cup_err FROM option WHERE id = 2;");
//
//                if(rs0.next()){
//                    nNewErr = rs0.getInt("_cup_err");
//                }
//                if(nNewErr != nOldErr){
//                    sOldData = "000";  //준비중인 웨이트 넘버오 환불 넘버가 같을 수 있어 있을 수 없는 수로 초기화가 필요함
//                    if(nNewErr == 1){
//                        //mMaruApp.OnGoPage("BOARD_CHANGE");
//                    }
//                    //Log.w(TAG, "_cup_err => " + nOldErr + " / " + nNewErr + " / " + m_sPage);
//                    nOldErr = nNewErr;
//                    return;
//                }
//
//                Date date =  new Date();
            }catch(SQLException e){
                Log.e(TAG, "SQL connection error: " + e.getMessage());
            } finally {
                try {
                    if(rs0 != null) rs0.close();
                    if(st0 != null) st0.close();
                } catch (SQLException e) {
                }
            }
        }
    }
}

