using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;
using XamarinLab.Helper;
using Microsoft.Identity.Client;


namespace XamarinLab
{
	public partial class LoginPage : ContentPage
	{
        public IPlatformParameters platformParameters { get; set; }
        public LoginPage()
		{
			InitializeComponent();
            this.signInButton.Clicked += SignInButton_Clicked;
            this.signOutButton.Clicked += SignOutButton_Clicked;
            this.Title = "Login Page";
        }

        private void SignInButton_Clicked(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }

        private void SignOutButton_Clicked(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }
    }
}
