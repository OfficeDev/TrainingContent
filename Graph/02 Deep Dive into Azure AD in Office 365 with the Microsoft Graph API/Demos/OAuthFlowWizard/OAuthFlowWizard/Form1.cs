using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Configuration;

namespace OAuthFlowWizard
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }
        private void Form1_Load(object sender, EventArgs e)
        {
            clientId.Text = ConfigurationSettings.AppSettings["ClientId"];
            redirectUri.Text = ConfigurationSettings.AppSettings["RedirectUri"];

            //This is the friendly error message when error occurred missing ClientID and RedirectUri in the App.config.
            if (string.IsNullOrEmpty(clientId.Text) || string.IsNullOrEmpty(redirectUri.Text))
            {
                MessageBox.Show("The Client ID and Redirect Uri values are missing. Please add the Client ID to the 'ClientId' setting and the Redirect Uri to the 'RedirectUri' setting in App.config.");
            }

        }
        private void button1_Click(object sender, EventArgs e)
        {
            string resource = ConfigurationSettings.AppSettings["Resource"];
            logInUrl.Text = String.Format("https://login.windows.net/common/oauth2/authorize?resource={0}&redirect_uri={1}&response_type=code&client_id={2}", resource, redirectUri.Text, clientId.Text);
            Clipboard.SetText(logInUrl.Text);
            MessageBox.Show("Log in URL copied to clipboard");
        }

        private void button2_Click_1(object sender, EventArgs e)
        {
            string resource = ConfigurationSettings.AppSettings["Resource"];
            string redircetUri = ConfigurationSettings.AppSettings["RedirectUri"];
            string clientId = ConfigurationSettings.AppSettings["ClientId"];
            string clientSecret = System.Web.HttpUtility.UrlEncode(ConfigurationSettings.AppSettings["ClientSecret"]);
            string code = authCode.Text;

            accessPost.Text = String.Format("POST https://login.windows.net/common/oauth2/token HTTP/1.1\r\nUser-Agent: Fiddler\r\nContent-Type: application/x-www-form-urlencoded\r\nHost: login.windows.net\r\n\r\ngrant_type=authorization_code&resource={0}&redirect_uri={1}&client_id={2}&client_secret={3}&code={4}",resource,redircetUri,clientId,clientSecret,code);
            Clipboard.SetText(accessPost.Text);
            MessageBox.Show("Fiddler composition copied to clipboard");
        }

        private void button3_Click(object sender, EventArgs e)
        {
            string personalSite = ConfigurationSettings.AppSettings["PersonalSite"];
            string token = accessToken.Text;
            string host = ConfigurationSettings.AppSettings["Host"];


            filesGET.Text = String.Format("GET {0}/_api/web HTTP/1.1\r\nUser-Agent: Fiddler\r\nAccept: application/json\r\nAuthorization: Bearer {1}\r\nHost: {2}", personalSite, token, host);
            Clipboard.SetText(filesGET.Text);
            MessageBox.Show("Fiddler composition copied to clipboard");
        }

        private void button4_Click(object sender, EventArgs e)
        {
            string tenantId = ConfigurationSettings.AppSettings["TenantId"];
            string token = refreshToken.Text;
            string clientId = ConfigurationSettings.AppSettings["ClientId"];
            string clientSecret = System.Web.HttpUtility.UrlEncode(ConfigurationSettings.AppSettings["ClientSecret"]);
            string resource = System.Web.HttpUtility.UrlEncode(ConfigurationSettings.AppSettings["Resource"]);

            refreshPost.Text = String.Format("POST https://login.windows.net/{0}/oauth2/token HTTP/1.1\r\nContent-Type: application/x-www-form-urlencoded\r\nclient-request-id: beb937d6-8ad9-411e-a88f-f8102030d616\r\nreturn-client-request-id: true\r\nx-client-SKU: .NET\r\nx-client-Ver: 2.6.1.0\r\nx-client-CPU: x64\r\nx-client-OS: Microsoft Windows NT 6.2.9200.0\r\nHost: login.windows.net\r\nExpect: 100-continue\r\n\r\ngrant_type=refresh_token&refresh_token={1}&client_id={2}&client_secret={3}&resource={4}",tenantId,token,clientId,clientSecret,resource);
            Clipboard.SetText(refreshPost.Text);
            MessageBox.Show("Fiddler composition copied to clipboard");
        }

        
 
    }
}
