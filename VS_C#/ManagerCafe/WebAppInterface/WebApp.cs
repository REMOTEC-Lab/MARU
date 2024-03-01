using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Runtime.CompilerServices;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Nodes;
using Newtonsoft.Json.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml.Linq;
using CefSharp;
using CefSharp.Web;
using CefSharp.WinForms;
using ManagerCafe.WebAppInterface;
using ManagerCafe.ClassBundle;
using System.Collections.Specialized;
using System.Net;
using System.Text;

namespace ManagerCafe.WebAppInterface
{
    public class WebApp
    {
        public static ActiveForm mActive = null;
        public ChromiumWebBrowser browser = null;

        private WApp_login wa_login = null;
        private WApp_manage wa_manage = null;

        private static bool m_isProgStart = false;
        public string _PageName;
        public bool isHTMLLoaded = false;
        private String mCssName = "style.css";
        //private String mCssName = "admin.css";

        Thread readFileTH;
        private static String sFileName = String.Empty;


        //[DllImport("KERNEL32.DLL")]
        //extern public static void Beep(int freq, int dur);

        public WebApp(ActiveForm _form)
        {
            mActive = _form;
        }

        public void MaruSet(ChromiumWebBrowser _WebBrowser, string _uri)
        {
            browser = _WebBrowser;

            //아래 경로를 위해, 빌드 속성에서 출력경로를 지운다.
            string page = Application.StartupPath + @"\assets\form\" + _uri;
            int start = _WebBrowser.Address.LastIndexOf('\\') + 1;
            int length = _WebBrowser.Address.LastIndexOf(".html") - start;
            if (start > 0 && length > 0)
            {
                _PageName = _WebBrowser.Address.Substring(start, length);
                //Debug.WriteLine("Page : " + _WebBrowser.Address + ", " + _WebBrowser.Address.Substring(start, length));
                //Debug.WriteLine("Page : " + _WebBrowser.Address + ", " + _PageName);
            }
            if (_uri != null && !File.Exists(page))
            {
                MessageBox.Show(new Form { TopMost = true }, "Error The html file doesn't exists : " + page);
                mActive.MyExit(true);
            }

            browser.KeyboardHandler = new KeyboardHandler(this);
            browser.LoadingStateChanged += OnLoadingStateChanged;

            browser.Dock = DockStyle.Fill;
            mActive.Controls.Add(browser);


            //BrowserSettings browserSettings = new BrowserSettings();
            //browserSettings.FileAccessFromFileUrls = CefState.Enabled;
            //browserSettings.UniversalAccessFromFileUrls = CefState.Enabled;
            //browserSettings.JavascriptDomPaste = CefState.Enabled;
            //browserSettings.ApplicationCache = CefState.Enabled;
            BrowserSettings browserSettings = new BrowserSettings
            {
                //ApplicationCache = CefState.Enabled,
                //DefaultEncoding = "UTF-8",
                LocalStorage = CefState.Enabled,
                JavascriptDomPaste = CefState.Enabled
            };
            browser.BrowserSettings = browserSettings;

            if (_uri != null)
            {
                browser.Load(page);
                //browser.LoadUrlWithPostData()
                //browser.LoadHtml(page, null, Encoding.UTF8);
            }
            //CefSharpSettings.LegacyJavascriptBindingEnabled = true;
            //After
            browser.JavascriptObjectRepository.Settings.LegacyBindingEnabled = true;

            wa_login = new WApp_login(this, mActive);
            wa_manage = new WApp_manage(this, mActive);
            browser.JavascriptObjectRepository.Register("Maru_app", this, false);
            browser.JavascriptObjectRepository.Register("Maru_login", wa_login, false);
            browser.JavascriptObjectRepository.Register("Maru_manage", wa_manage, false);

            //browser.JavascriptObjectRepository.Register("Maru_start", new startWebApp(this, mActive), false);
        }

        ~WebApp()
        {
            //if (browser != null)
            //{
            //    try
            //    {
            //        //browser.Load("about:blank");
            //        if(browser.Disposing)
            //            browser.Dispose();
            //    }
            //    catch (ObjectDisposedException) { }
            //    catch (NullReferenceException) { }

            //    browser = null;
            //}
        }

        //public void OnMyPreviewKeyDown(int windowsKeyCode, CefEventFlags modifiers){
        //}
        bool isKeyDown = false;
        public void OnMyKeyDown(int windowsKeyCode, CefEventFlags modifiers, KeyType type)
        {
            if (isKeyDown) //등록된 Key가 눌러 졌다, 떨어졌을때
            {
                if (type == KeyType.KeyUp)
                {
                    isKeyDown = false;
                }
            }
            else
            {
                if (modifiers == CefEventFlags.ControlDown) //Ctrl + Key 
                {
                    if ((Keys)windowsKeyCode == Keys.F12)
                    {
                        browser.ShowDevTools();
                    }
                    else if ((Keys)windowsKeyCode == Keys.F2)
                    {
                        mActive.MyExit(true);
                    }
                    else
                    {
                        return;
                    }
                }
                else if (modifiers == CefEventFlags.AltDown) //Alt + Key 
                {
                }
                else
                {
                    if ((Keys)windowsKeyCode == Keys.F5)
                    {
                        OnGoHome();
                    }
                    else if ((Keys)windowsKeyCode == Keys.F4)
                    {
                        mActive.mMsgBox.Show("TEST Time Box", 3000);
                    }
                    else
                    {
                        return;
                    }
                }
                if (type == KeyType.RawKeyDown) //등록된 Key가 눌러 졌을 때
                {
                    isKeyDown = true;
                }
                //MessageBox.Show(new Form { TopMost = true },"KeyDown");
            }
        }

        // KeyboardHandle
        public class KeyboardHandler : IKeyboardHandler
        {
            private WebApp _frm;

            public KeyboardHandler(WebApp frm)
            {
                _frm = frm;
            }

            public bool OnKeyEvent(IWebBrowser browserControl, IBrowser browser, KeyType type, int windowsKeyCode, int nativeKeyCode, CefEventFlags modifiers, bool isSystemKey)
            {
                _frm.OnMyKeyDown(windowsKeyCode, modifiers, type);
                return false;
            }

            public bool OnPreKeyEvent(IWebBrowser browserControl, IBrowser browser, KeyType type, int windowsKeyCode, int nativeKeyCode, CefEventFlags modifiers, bool isSystemKey, ref bool isKeyboardShortcut)
            {
                //_frm.OnMyPreviewKeyDown(windowsKeyCode, modifiers);
                return false;
            }
        }

        private void OnLoadingStateChanged(object sender, LoadingStateChangedEventArgs args)
        {
            if (!args.IsLoading)
            {
                if (!isHTMLLoaded)
                {
                    //

                    // Page has finished loading, do whatever you want here
                    isHTMLLoaded = true;
                    //Console.Write("HTMLLoaded\r\n");

                    //// 현재 경로 가져오기
                    //String currentPath = Environment.CurrentDirectory;
                    //// JavaScript로 경로 전달
                    //browser.ExecuteScriptAsync($"window.location.origin = '{currentPath}'");
                }
            }
        }

        public void sendPushover(String _sMsg)
        {
            var parameters = new NameValueCollection {
                { "token", "ayvxx8zp3x5de78v17jtedwcxf6jsz" },
                { "user", "umudk4n1pdj2uebwtjtrhvcg3du4mm" },
                //{ "user", "uh8kx4jfh3z7ye3h1jk2pgyzc35p3h" },      //마이키 박현웅          
                { "title", "마이키 키오스크 시스템" },
                //{ "priority", "Emergency"},
                { "message", _sMsg }
            };

            using (var client = new WebClient())
            {
                byte[] reg = client.UploadValues("https://api.pushover.net/1/messages.json", parameters);
                //var act = new NameValueCollection()
                Debug.WriteLine(Encoding.Default.GetString(reg));
                //Debug.WriteLine(Encoding.UTF8.GetString(reg));
            }
        }

        public String JsonOneData(String _node, String _value)
        {
            JsonObject jObject = new JsonObject();//배열 내에 들어갈 json
            jObject.Add(_node, _value);

            //return jObject.ToString();
            return JsonSerializer.Serialize(jObject, options);
        }

        JsonArray m_jArray = null;
        public void JsonArrayAdd(JsonObject _jobject)
        {

            if (m_jArray == null)
                m_jArray = new JsonArray();//배열 내에 들어갈 json
            m_jArray.Add(_jobject);

        }

        public JsonArray JsonArrayGetData()
        {
            if (m_jArray == null)
                return null;

            JsonArray rJArray = m_jArray;
            m_jArray = null;
            return m_jArray;
        }

        //TextEncoderSettings encoderSettings = new TextEncoderSettings();

        JsonSerializerOptions options = new JsonSerializerOptions()
        {
            //WriteIndented = true,
            //AllowTrailingCommas = true,
            //Encoder = JavaScriptEncoder.Default
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            //Encoder = JavaScriptEncoder.Create(UnicodeRanges.BasicLatin, UnicodeRanges.HangulSyllables)
            //Encoder = JavaScriptEncoder.Create(UnicodeRanges.All)
        };

        public String JsonArrayGetString()
        {
            if (m_jArray == null)
                return null;

            String jsonReturn = JsonSerializer.Serialize(m_jArray, options);
            //byte[] utf8Bytes = JsonSerializer.SerializeToUtf8Bytes(m_jArray, options);
            //String jsonReturn = Encoding.UTF8.GetString(utf8Bytes);
            //jsonReturn = jsonReturn.Replace(" ", String.Empty);
            //jsonReturn = jsonReturn.Replace("\r\n", String.Empty);
            //Debug.WriteLine(jsonReturn);
            m_jArray = null;
            return jsonReturn;
        }

        public String JsonArrayGetStrRemaind()
        {
            //Console.WriteLine(m_jArray.ToString());
            if (m_jArray == null)
                return null;

            String jsonReturn = JsonSerializer.Serialize(m_jArray, options);
            //UTF8 한글 지원으로 스트링을 변환
            //jsonReturn = Encoding.Default.GetString(UTF8Encoding.UTF8.GetBytes(jsonReturn));
            return jsonReturn;
        }

        JsonObject m_jObject = null;
        public void JsonMultiAdd(String _node, String _value)
        {
            if (m_jObject == null)
                m_jObject = new JsonObject();//배열 내에 들어갈 json

            m_jObject.Add(_node, _value);
        }

        public String JsonMultiGetData(String _node, String _value)
        {
            String jsonReturn = null;
            if (m_jObject == null)
                m_jObject = new JsonObject();//배열 내에 들어갈 json

            m_jObject.Add(_node, _value);
            //jsonReturn = m_jObject.ToString();
            jsonReturn = JsonSerializer.Serialize(m_jObject, options);
            //UTF8 한글 지원으로 스트링을 변환
            //jsonReturn = Encoding.Default.GetString(UTF8Encoding.UTF8.GetBytes(jsonReturn));

            m_jObject = null;
            return jsonReturn;
        }

        public String JsonMultiGetString()
        {
            if (m_jObject == null)
                return null;

            //String jsonReturn = null;
            //jsonReturn = m_jObject.ToString();
            String jsonReturn = JsonSerializer.Serialize(m_jObject, options);
            //UTF8 한글 지원으로 스트링을 변환
            //jsonReturn = Encoding.Default.GetString(UTF8Encoding.UTF8.GetBytes(jsonReturn));

            m_jObject = null;
            return jsonReturn;
        }

        public String JsonMultiGetStrRemaind()
        {
            if (m_jObject == null)
                return null;

            //String jsonReturn = null;
            //jsonReturn = m_jObject.ToString();
            String jsonReturn = JsonSerializer.Serialize(m_jObject, options);

            //UTF8 한글 지원으로 스트링을 변환
            //jsonReturn = Encoding.Default.GetString(UTF8Encoding.UTF8.GetBytes(jsonReturn));

            return jsonReturn;
        }

        public JsonObject JsonMultiGetObject()
        {
            if (m_jObject == null)
                return null;
            JsonObject rObject = m_jObject;
            m_jObject = null;
            return rObject;
        }

        public void JsonDelObjArray()
        {
            m_jObject = null;
            m_jArray = null;
        }

        JObject m_jElement = null;
        public void JsonElementAdd(String _elemnt, String _sJsonArray)
        {

            if (m_jElement == null)
                m_jElement = new JObject();
            m_jElement.Add(_elemnt, _sJsonArray);
        }

        public JObject JsonElementGetObject()
        {
            if (m_jElement == null)
                return null;
            JObject rObject = m_jElement;
            m_jElement = null;
            return rObject;
        }

        public void btn_Sound_BEEP()
        {
            //Beep(512, 300);
            //Console.Beep();
            //System.Media.SystemSounds.Beep.Play();
            //System.Media.SystemSounds.Asterisk.Play();
            System.Media.SystemSounds.Hand.Play();
            //System.Media.SystemSounds.Exclamation.Play();
        }

        public ChromiumWebBrowser getChromiumWebBrowserHandle()
        {
            return browser;
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void WebCss_Change(String _newCss)
        {
            String Other;
            if (mCssName == _newCss)
                return;
            Other = "Css_Change('" + _newCss + "');";
            browser.ExecuteScriptAsync("javascript:" + Other);
            mCssName = _newCss;
        }
        [MethodImpl(MethodImplOptions.Synchronized)]
        public void WebCss_DelOrAdd(int isAdd, String _newCss)
        {
            String Other;
            Other = "Css_DelOrAdd('" + isAdd + "','" + _newCss + "');";
            browser.ExecuteScriptAsync("javascript:" + Other);
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void WebViewJS_EXEC(string _sFunc)
        {
            //Debug.WriteLine("javascript:" + _sFunc);
            browser.ExecuteScriptAsync("javascript:" + _sFunc);
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void TEXT_PUT(string _json)
        {
            String Other = "Text_put('" + _json + "');";
            browser.ExecuteScriptAsync("javascript:" + Other);
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void TEXT_To_DB(JObject _json)
        {
            updateDbEvaluateScript(browser, _json);
        }

        public async void updateDbEvaluateScript(ChromiumWebBrowser _browser, JObject _json)
        {
            String sTable, sFild;
            String sKey;
            String[] asTemp;
            try
            {
                foreach (var obj in _json)
                {
                    asTemp = obj.Key.Split(new char[] { ',' }); ;
                    sTable = asTemp[0];
                    sFild = asTemp[1];
                    var jsonObj = JObject.Parse(_json[obj.Key].ToString());
                    foreach (var unit in jsonObj)
                    {
                        sKey = unit.Key;

                        var task = _browser.EvaluateScriptAsync("javascript:Text_get('" + jsonObj[sKey].ToString() + "');"); //GetMainFrame().
                        await task.ContinueWith(x =>
                        {
                            if (!x.IsFaulted)
                            {
                                var response = x.Result;
                                //Console.WriteLine("EvaluateScript 1 : " + response.Result.ToString());
                                if (response.Success == true)
                                {
                                    var final = response.Result; //final.ToString()
                                    //mActive.db_manager.commandDB(0, $"UPDATE {sTable} SET {sFild} = '{final}' WHERE id = '{sKey}';");
                                    //Debug.WriteLine($"UPDATE {sTable} SET {sFild} = '{final}' WHERE id = '{sKey}';");
                                }
                            }
                        });
                    }
                }
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.Message);
            }
        }

        //public JavascriptResponse EvaluateScript(ChromiumWebBrowser _browser, string script)
        //{
        //    var response = Task.Run(() => EvaluateScriptAsync(_browser, script)).GetAwaiter().GetResult();
        //    if (response.Success)
        //        return response;

        //    return null;
        //}
        //private async Task<JavascriptResponse> EvaluateScriptAsync(ChromiumWebBrowser _browser, string script)
        //{
        //    // 브라우저 메인 프레임 객체 생성
        //    var frame = _browser.GetMainFrame();
        //    var response = await frame.EvaluateScriptAsync(script);
        //    return response;
        //}

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void setTableBlock(String _name, int _index, String _data)
        {
            String Other = "text_string_array('" + _name + "', '" + _index + "', '" + _data + "');";
            //Debug.WriteLine(Other);
            //Log.w("WebViewJS", Other);
            browser.ExecuteScriptAsync("javascript:" + Other);
        }

        //public void EditAppend(String _id, String _str)
        //{
        //    String sTemp = _str.Replace("\r\n", "<br />");
        //    sTemp = sTemp.Replace("\n", "<br />");
        //    String Other = "edit_append('" + _id + "', '" + sTemp + "');";
        //    //Debug.WriteLine(Other);
        //    browser.ExecuteScriptAsync("javascript:" + Other);
        //}
        [MethodImpl(MethodImplOptions.Synchronized)]
        public void Move_BAR(String _sID, int _nPersent, int _kinds)
        { //
            String Other = $"move_bar('{_sID}', '{_nPersent}', {_kinds});";
            browser.ExecuteScriptAsync("javascript:" + Other);
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void Action_Activate(String _dPage, String _sMethod, String _sJson)
        { //
            String Other = $"action_Activate('{_dPage}', '{_sMethod}', '{_sJson}');";
            //Debug.WriteLine("Action_Activate : " + Other);
            browser.ExecuteScriptAsync("javascript:" + Other);
        }


        public void Group_Select(String _sID, int _sel, int _num)
        {
            Group_Select(_sID, _sel, _num, null);
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void Group_Select(String _sID, int _sel, int _num, String _sColor)
        { //
            String Other = "Group_Select('" + _sID + "', '" + _sel + "', '" + _num + "', '" + _sColor + "');";
            Debug.WriteLine(Other);
            //Log.w("WebViewJS", Other);
            browser.ExecuteScriptAsync("javascript:" + Other);
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void Table_Line(int[,] a_data, int _start, int _length, String sID, int _line_size, String _sColor)
        { //
            String Other = null;
            for (int i = 0; i < _length; i++) //i < 999
            {
                Other = "Table_Line('" + sID + String.Format("{0:0#}", i) + "', '" + a_data[i + _start, 0] + "', '" + a_data[i + _start, 1] + "', '" + _line_size + "', '" + ((a_data[i + _start, 0] == 0) ? "" : _sColor) + "');";
                Debug.WriteLine("i = " + i + ", " + (i + _start) + " / start : " + _start + " , Lng : " + _length + " => " + Other);
                //Log.w("WebViewJS", Other);

            }
            if (Other != null)
            {
                browser.ExecuteScriptAsync("javascript:" + Other);
            }
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void PutGoods_Action(String _sID, String _sData)
        {
            String Other = $"Put_Anchor('{_sID}','{_sData}');";
            Debug.WriteLine(Other);
            browser.BrowserCore.ExecuteScriptAsync("javascript:" + Other);
            //browser.ExecuteScriptAsync("javascript:" + Other);
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void PutSelectGoods_Action(String _sID, String _sData)
        {
            String Other = $"Put_Select_Goods('{_sID}','{_sData}');";
            browser.BrowserCore.ExecuteScriptAsync("javascript:" + Other);
            //browser.ExecuteScriptAsync("javascript:" + Other);
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void PutCoffeeAnchor(String _sID, String _sData)
        {
            String Other = $"Put_CoffeeAnchor('{_sID}','{_sData}');";
            //Debug.WriteLine(Other);
            browser.BrowserCore.ExecuteScriptAsync("javascript:" + Other);
            //browser.ExecuteScriptAsync("javascript:" + Other);
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void PutRefundAnchor(String _sID, String _sData)
        {
            String Other = $"Put_RefundAnchor('{_sID}','{_sData}');";
            //Debug.WriteLine(Other);
            browser.BrowserCore.ExecuteScriptAsync("javascript:" + Other);
            //browser.ExecuteScriptAsync("javascript:" + Other);
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void OnGoHome()
        {
            Debug.WriteLine($"Change Page : {mActive.m_sPage} to start");
            if (mActive.m_sPage.IndexOf("start") >= 0)
                return;
            String sFunc = "Evnt.btn.GO_START.Response();";
            WebViewJS_EXEC(sFunc);
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void OnGoGoods()
        {
            Debug.WriteLine($"Change Page : {mActive.m_sPage} to goods");
            if (mActive.m_sPage.IndexOf("goods") >= 0)
                return;
            String sFunc = "Evnt.btn.GO_GOODS.Response();";
            WebViewJS_EXEC(sFunc);
        }

        private bool IsVisualDlg = false;
        public void OpenModal(String _sModal, String _sName)
        { //
            OpenModal(_sModal, _sName, "null");
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void OpenModal(String _sModal, String _sName, String _sMessage)
        { //
            if (IsVisualDlg)
                return;
            String sModal = _sModal.ToLower();
            String Other;
            if (sModal.IndexOf("confirm") >= 0)
            {
                Other = $"ConfirmModal.{sModal}Box('show', '{_sName}', '{_sMessage}');";
            }
            else if (sModal.IndexOf("menu") >= 0)
            {
                Other = $"MenuModal.{sModal}Box('show', '{_sName}', '{_sMessage}');";
            }
            else
            {
                Other = $"Modal.{sModal}Box('show', '{_sName}', '{_sMessage}');";
            }
            //Debug.WriteLine(Other);
            browser.ExecuteScriptAsync("javascript:" + Other);
            //IsVisualDlg = true;
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void drawImgFile(String _name, String _file)
        {
            String Other = "drawImgFile('" + _name + "', '" + _file + "');";
            browser.ExecuteScriptAsync("javascript:" + Other);
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void drawCanvasImg(String _canvas_id, String _filename)
        {
            String Other = "drawCanvasImg('" + _canvas_id + "', '" + _filename + "');";
            //Debug.WriteLine(Other);
            //Log.w("WebViewJS", Other);
            browser.ExecuteScriptAsync("javascript:" + Other);
        }

        [Obsolete]
        public void btn_LOAD_IMG()
        {
            Debug.WriteLine($"page({mActive.m_sPage}) : btn_LOAD_IMG");
            readFileTH = new Thread(new System.Threading.ThreadStart(ChooseFile))
            {
                ApartmentState = ApartmentState.STA
            };
            readFileTH.Start();
        }

        private async void ChooseFile()
        {
            OpenFileDialog openFileDialog = new OpenFileDialog
            {
                InitialDirectory = @"D:\",
                Title = "Select Image File",

                CheckFileExists = true,
                CheckPathExists = true,

                //DefaultExt = "PNG",
                Filter = "Images (*.BMP;*.JPG;*.GIF,*.PNG,*.TIFF)|*.BMP;*.JPG;*.GIF;*.PNG;*.TIFF|All files (*.*)|*.*",
                FilterIndex = 1,
                RestoreDirectory = true,

                ReadOnlyChecked = true,
                ShowReadOnly = true
            };

            //if (mActive.db_manager.isConnected()){}

            readFileTH.Abort();
        }

        public void btn_MsgBoxShow(String _msg, int _time)
        {
            mActive.mMsgBox.Show(_msg, _time);
        }

        public async Task CopyFileAsync(string sourcePath, string destinationPath)
        {
            using (Stream source = File.OpenRead(sourcePath))
            {
                using (Stream destination = File.Create(destinationPath))
                {
                    await source.CopyToAsync(destination);
                }
            }
        }

        public void ProgramStart()
        {
            m_isProgStart = true;
        }
        public bool IsProgStart()
        {
            return m_isProgStart;
        }
        public void setPageName(string _name)
        {
            _PageName = _name;
        }
    }
}

