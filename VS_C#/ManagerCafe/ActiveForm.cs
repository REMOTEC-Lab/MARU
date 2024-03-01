using CefSharp.WinForms;
using CefSharp;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Diagnostics;
using ManagerCafe.ClassBundle;
using ManagerCafe.WebAppInterface;


namespace ManagerCafe
{
    public partial class ActiveForm : Form
    {
        public ChromiumWebBrowser browser = new ChromiumWebBrowser();
        public static WebApp mMaruApp = null;
        public int PAGE = 1;
        public string m_sPage = "";

        public RMessageBox mMsgBox;

        public ActiveForm()
        {
            InitializeComponent();

            //키보드 관련이벤트가 현재 Form에서 일어나도록 한다.
            //this.KeyPreview = true;

            //CheckForIllegalCrossThreadCalls = false;
            //SetStyle(ControlStyles.AllPaintingInWmPaint, true);
            SetStyle(ControlStyles.UserPaint, true); //MDI 또는 Dialog의 OnPaint를 활성화 한다.


            this.FormBorderStyle = FormBorderStyle.None;//윈도우테두리제거방법 사용
            /*
                handCard = (IntPtr)FindWindow(null, "다우데이타 가상결제 시스템");
                while (handCard == IntPtr.Zero)
                {
                    System.Threading.Thread.Sleep(50);
                    handCard = (IntPtr)FindWindow(null, "다우데이타 가상결제 시스템");
                }
                ShowWindow((int)handCard, 0); //HIDE모드로 윈도우를 보여줌 -> 최소화
            */
            ClientSize = new System.Drawing.Size(1920, 1080);
            //ClientSize = new System.Drawing.Size(1082, 1928);
            //ShowWindow(FindWindow("Shell_TrayWnd", string.Empty), 0);

            //this.FormClosing += Activity_FormClosing;

            mMaruApp = new WebApp(this);

            //CefSettings "disable-web-security" 옵션처리 해야, Page를 전환(바꿀수)있다.
            CefSettings settings = new CefSettings();
            //settings.Locale = "ko-KR";
            settings.CefCommandLineArgs.Add("disable-web-security", "true");
            //settings.CefCommandLineArgs.Add("allow-running-insecure-content");
            //settings.CefCommandLineArgs.Add("disable-oor-cors", "true");
            Cef.Initialize(settings);
            //CefSettings

            string page = Application.StartupPath + @"\assets\form\html\" + "login.html";
            browser.Load(page);
            mMaruApp.MaruSet(browser, null);

            mMsgBox = new RMessageBox(mMaruApp, this);
        }

        private void ActiveForm_Load(object sender, EventArgs e)
        {
            Screen[] sc;
            sc = Screen.AllScreens;
    
            this.Left = sc[0].Bounds.Left; //0: 첫화면, 1: 둘째 화면
            this.Top = sc[0].Bounds.Top;

            if (sc.Length > 1)
            {
                Location = sc[1].Bounds.Location;
                FormBorderStyle = FormBorderStyle.None;
                //WindowState = FormWindowState.Maximized;

                int i = 1;
                for (; i < sc.Length; i++)
                {
                    if (sc[i].Bounds.Width ==  1920 && sc[i].Bounds.Height == 1080)
                    {
                        this.Left = sc[i].Bounds.Left; //0: 첫화면, 1: 둘째 화면, 2: 셋째 화면
                        this.Top = sc[i].Bounds.Top;
                        break;
                    }
                }
            }
        }

        public void MyExit(bool _isExit)
        {
            if (_isExit)
            {
                Debug.WriteLine("MyExit");
                //Application.Exit();
                Environment.Exit(0);
            }
            else
            {
                //프로그램 재 부팅
                //Application.Restart();
                System.Diagnostics.Process.Start(Application.ExecutablePath);
            }
        }
    }
}
