using System;
using System.Drawing.Drawing2D;
using System.Drawing;
using System.Windows.Forms;

using ManagerCafe.WebAppInterface;

namespace ManagerCafe.ClassBundle
{
    public partial class RMessageBox : Form
    {
        WebApp mMaruApp;
        ActiveForm mActive;

        static Object m_obj;

        private bool isFirst = true;
        private static System.Threading.Timer Tmr;

        public int padding = 3;
        public int radius = 10;
        public bool isBorder = true;
        public Color borderColor = System.Drawing.Color.LightSkyBlue;
        //Color.FromArgb(128, 51, 94, 129);
        public int borderWidth = 5;
        //public bool isFill = false;
        //public Color fillColor = Color.FromArgb(128, 243, 246, 251);

        public RMessageBox(WebApp _pApp, ActiveForm _pActive)
        {
            mMaruApp = _pApp;
            mActive = _pActive;

            //this.Paint += new PaintEventHandler(MyPaint);
            //this.Load += new EventHandler(LoadEvent);
            //this.Shown += new EventHandler(ShownEvent);
        }

        public void Show(string text, int timeout)
        {
            if (mActive == null)
                return;

            Form Parent = (Form)mActive;

            Form m_form = this;
            Label LblMessage;

            #region InitializeComponent
            m_form.Size = new System.Drawing.Size(600, 100);
            m_form.MaximizeBox = false;
            m_form.MinimizeBox = false;
            m_form.ShowIcon = false;
            m_form.ShowInTaskbar = false;
            m_form.ControlBox = false;
            m_form.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            m_form.FormBorderStyle = FormBorderStyle.None;
            m_form.StartPosition = FormStartPosition.CenterScreen;

            #region Center on Parent StartPosition
            if (Parent != null)
            {
                //m_form.BackColor = Parent.BackColor;
                m_form.BackColor = System.Drawing.Color.White;
                m_form.StartPosition = FormStartPosition.Manual;
                int X = Parent.Location.X + ((Parent.Width - m_form.Width) / 2);
                int Y = Parent.Location.Y + ((Parent.Height - m_form.Height) / 2);
                m_form.Location = new System.Drawing.Point(X, Y);
            }
            #endregion

            //
            //LblMessage
            //
            if (m_form.Controls.Count > 0)
            {
                LblMessage = (Label)m_form.Controls[0];
            }
            else
            {
                LblMessage = new Label();
                LblMessage.AutoSize = false;
                LblMessage.Location = new System.Drawing.Point(15, 15);
                LblMessage.Size = new System.Drawing.Size(m_form.Width - 30, m_form.Height - 30);
                LblMessage.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
                LblMessage.Font = new System.Drawing.Font("Microsoft Sans Serif", 20F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(162)));
                LblMessage.ForeColor = System.Drawing.Color.Red;
                LblMessage.BackColor = m_form.BackColor;
                //LblMessage.ForeColor = mbx.BackColor.ToInvert();
                LblMessage.BorderStyle = BorderStyle.None;
                LblMessage.Dock = DockStyle.None;
                m_form.Controls.Add(LblMessage);
            }
            LblMessage.Text = text;
            #endregion

            m_obj = m_form;
            if (timeout <= 0)
            {
                Parent.BeginInvoke((System.Action)(() =>
                {
                    m_form.ShowDialog();
                }));
            }
            else
            {
                Tmr = new System.Threading.Timer(new System.Threading.TimerCallback(Tmr_Tick), m_form, timeout, 0);
                //Parent.BeginInvoke(new MethodInvoker(delegate{
                //Parent.Invoke((MethodInvoker)delegate{
                Parent.BeginInvoke((System.Action)(() =>
                {
                    //Parent.Invoke((MethodInvoker)delegate{
                    m_form.ShowDialog();
                }));
            }
        }

        private static void Tmr_Tick(object obj)
        {
            Tmr.Dispose();
            if (obj is Form)
            {
                if (((Form)obj).InvokeRequired)
                {
                    ((Form)obj).Invoke(new System.Action<Form>(InvokeMbx), new object[] { ((Form)obj) });
                }
                else InvokeMbx((Form)obj);
            }
        }

        private static void InvokeMbx(Form mbx)
        {
            mbx.Close();
            Tmr = null;
            m_obj = null;
        }

        public void HideDialog()
        {
            if (m_obj != null)
            {
                InvokeHDlG((Form)m_obj);
            }
        }

        private static void InvokeHDlG(Form obj)
        {
            if (((Form)obj).InvokeRequired)
            {
                ((Form)obj).Invoke(new System.Action<Form>(InvokeMbx), new object[] { ((Form)obj) });
            }
            else InvokeMbx((Form)obj);
        }

        private void LoadEvent(object sender, EventArgs e)
        {
            var form = sender as Form;
            form.Refresh();
        }

        private void ShownEvent(object sender, EventArgs e)
        {
            var form = sender as Form;
            //form.Invalidate();
            //form.Refresh();
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            if (isFirst)
            {
                isFirst = false;
                return;
            }
            // Call the OnPaint method of the base class.  
            base.OnPaint(e);
            // Call methods of the System.Drawing.Graphics object.  
            //Debug.WriteLine("RMessageBox OnPaint handle : " + this.Handle.ToString());
            Graphics g = e.Graphics;
            Rectangle rect = e.ClipRectangle;
            //Debug.WriteLine("RMessageBox OnPaint recnt : " + rect.ToString());
            g.SmoothingMode = SmoothingMode.AntiAlias;
            //if (isFill)
            //{
            //    g.FillRoundedRectangle(new SolidBrush(fillColor), padding, padding, rect.Width - padding * 2, rect.Height - padding * 2, radius);
            //}
            if (isBorder)
            {
                g.DrawRoundedRectangle(new Pen(borderColor, borderWidth), padding, padding, rect.Width - padding * 2, rect.Height - padding * 2, radius);
            }
        }

        //패널윈도우에 투명속성 추가
        const int WS_EX_TRANSPARENT = 0x20;
        protected override CreateParams CreateParams
        {
            get
            {
                var cp = base.CreateParams;
                cp.ExStyle |= WS_EX_TRANSPARENT;
                return cp;
            }
        }
    }

    static class GraphicsExtension
    {
        private static GraphicsPath GenerateRoundedRectangle(
            this Graphics graphics,
            RectangleF rectangle,
            float radius)
        {
            float diameter;
            GraphicsPath path = new GraphicsPath();
            if (radius <= 0.0F)
            {
                path.AddRectangle(rectangle);
                path.CloseFigure();
                return path;
            }
            else
            {
                if (radius >= (Math.Min(rectangle.Width, rectangle.Height)) / 2.0)
                    return graphics.GenerateCapsule(rectangle);
                diameter = radius * 2.0F;
                SizeF sizeF = new SizeF(diameter, diameter);
                RectangleF arc = new RectangleF(rectangle.Location, sizeF);
                path.AddArc(arc, 180, 90);
                arc.X = rectangle.Right - diameter;
                path.AddArc(arc, 270, 90);
                arc.Y = rectangle.Bottom - diameter;
                path.AddArc(arc, 0, 90);
                arc.X = rectangle.Left;
                path.AddArc(arc, 90, 90);
                path.CloseFigure();
            }
            return path;
        }
        private static GraphicsPath GenerateCapsule(
            this Graphics graphics,
            RectangleF baseRect)
        {
            float diameter;
            RectangleF arc;
            GraphicsPath path = new GraphicsPath();
            try
            {
                if (baseRect.Width > baseRect.Height)
                {
                    diameter = baseRect.Height;
                    SizeF sizeF = new SizeF(diameter, diameter);
                    arc = new RectangleF(baseRect.Location, sizeF);
                    path.AddArc(arc, 90, 180);
                    arc.X = baseRect.Right - diameter;
                    path.AddArc(arc, 270, 180);
                }
                else if (baseRect.Width < baseRect.Height)
                {
                    diameter = baseRect.Width;
                    SizeF sizeF = new SizeF(diameter, diameter);
                    arc = new RectangleF(baseRect.Location, sizeF);
                    path.AddArc(arc, 180, 180);
                    arc.Y = baseRect.Bottom - diameter;
                    path.AddArc(arc, 0, 180);
                }
                else path.AddEllipse(baseRect);
            }
            catch { path.AddEllipse(baseRect); }
            finally { path.CloseFigure(); }
            return path;
        }

        public static void DrawRoundedRectangle(
            this Graphics graphics,
            Pen pen,
            float x,
            float y,
            float width,
            float height,
            float radius)
        {
            RectangleF rectangle = new RectangleF(x, y, width, height);
            GraphicsPath path = graphics.GenerateRoundedRectangle(rectangle, radius);
            SmoothingMode old = graphics.SmoothingMode;
            graphics.SmoothingMode = SmoothingMode.AntiAlias;
            graphics.DrawPath(pen, path);
            graphics.SmoothingMode = old;
        }

        public static void DrawRoundedRectangle(
            this Graphics graphics,
            Pen pen,
            int x,
            int y,
            int width,
            int height,
            int radius)
        {
            graphics.DrawRoundedRectangle(
                pen,
                Convert.ToSingle(x),
                Convert.ToSingle(y),
                Convert.ToSingle(width),
                Convert.ToSingle(height),
                Convert.ToSingle(radius));
        }

        public static void FillRoundedRectangle(
            this Graphics graphics,
            Brush brush,
            float x,
            float y,
            float width,
            float height,
            float radius)
        {
            RectangleF rectangle = new RectangleF(x, y, width, height);
            GraphicsPath path = graphics.GenerateRoundedRectangle(rectangle, radius);
            SmoothingMode old = graphics.SmoothingMode;
            graphics.SmoothingMode = SmoothingMode.AntiAlias;
            graphics.FillPath(brush, path);
            graphics.SmoothingMode = old;
        }

        public static void FillRoundedRectangle(
            this Graphics graphics,
            Brush brush,
            int x,
            int y,
            int width,
            int height,
            int radius)
        {
            graphics.FillRoundedRectangle(
                brush,
                Convert.ToSingle(x),
                Convert.ToSingle(y),
                Convert.ToSingle(width),
                Convert.ToSingle(height),
                Convert.ToSingle(radius));
        }
    }
}
