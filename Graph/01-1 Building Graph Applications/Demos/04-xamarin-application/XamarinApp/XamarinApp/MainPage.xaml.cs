using Microsoft.Identity.Client;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Net.Http;
using Xamarin.Forms;

namespace XamarinApp
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
        }
        protected override async void OnAppearing()
        {
            // let's see if we have a user in our belly already
            try
            {
                AuthenticationResult ar =
                    await App.PCA.AcquireTokenSilentAsync(App.Scopes, App.PCA.Users.FirstOrDefault());
                RefreshUserData(ar.AccessToken);
                btnSignInSignOut.Text = "Sign out";
            }
            catch
            {
                // doesn't matter, we go in interactive more
                btnSignInSignOut.Text = "Sign in";
            }
        }
        async void OnSignInSignOut(object sender, EventArgs e)
        {
            try
            {
                if (btnSignInSignOut.Text == "Sign in")
                {
                    AuthenticationResult ar = await App.PCA.AcquireTokenAsync(App.Scopes, App.UiParent);
                    RefreshUserData(ar.AccessToken);
                    btnSignInSignOut.Text = "Sign out";
                }
                else
                {
                    foreach (var user in App.PCA.Users)
                    {
                        App.PCA.Remove(user);
                    }
                    slUser.IsVisible = false;
                    btnSignInSignOut.Text = "Sign in";
                }
            }
            catch (Exception ee)
            {

            }
        }

        public async void RefreshUserData(string token)
        {
            //get data from API
            HttpClient client = new HttpClient();
            HttpRequestMessage message = new HttpRequestMessage(HttpMethod.Get, "https://graph.microsoft.com/v1.0/me");
            message.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", token);
            HttpResponseMessage response = await client.SendAsync(message);
            string responseString = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
            {
                JObject user = JObject.Parse(responseString);

                slUser.IsVisible = true;
                lblDisplayName.Text = user["displayName"].ToString();
                lblGivenName.Text = user["givenName"].ToString();
                lblId.Text = user["id"].ToString();
                lblSurname.Text = user["surname"].ToString();
                lblUserPrincipalName.Text = user["userPrincipalName"].ToString();

                // just in case
                btnSignInSignOut.Text = "Sign out";


            }
            else
            {
                DisplayAlert("Something went wrong with the API call", responseString, "Dismiss");
            }
        }
    }
}
