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
        protected override void OnAppearing()
        {
            base.OnAppearing();
            App.PCA.PlatformParameters = platformParameters;
        }
        private async void SignInButton_Clicked(object sender, EventArgs e)
        {
            try
            {
                string token = await AuthenticationHelper.SignIn();
                await DisplayAlert("Success", token, "Ok");
            }
            catch{
                await DisplayAlert("Error", "Sign On failed", "Ok");
            }

        }

        private async void SignOutButton_Clicked(object sender, EventArgs e)
        {
            AuthenticationHelper.SignOut();
            await DisplayAlert("Success", "Sign Out Successfully", "Ok");
        }
    }
}
