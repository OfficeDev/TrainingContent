using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xamarin.Forms;


namespace XamarinLab
{
	public partial class App : Application
	{
        public static PublicClientApplication PCA = null;
        public static string ClientID = "ecc4e5d6-6b59-4573-89a4-86ade07c340c";
        public static string[] Scopes = { "https://graph.microsoft.com/Mail.Send",
            "https://graph.microsoft.com/Mail.ReadWrite",
            "https://graph.microsoft.com/Files.Read",
            "https://graph.microsoft.com/Files.ReadWrite",
            "https://graph.microsoft.com/Sites.Read.All",
            "https://graph.microsoft.com/Contacts.Read",
            "https://graph.microsoft.com/User.Read.All",
            "https://graph.microsoft.com/User.Read" };

        public App ()
		{
            PCA = new PublicClientApplication(ClientID);
            InitializeComponent();
            MainPage = new NavigationPage( new XamarinLab.LoginPage());
		}

		protected override void OnStart ()
		{
			// Handle when your app starts
		}

		protected override void OnSleep ()
		{
			// Handle when your app sleeps
		}

		protected override void OnResume ()
		{
			// Handle when your app resumes
		}
	}
}
