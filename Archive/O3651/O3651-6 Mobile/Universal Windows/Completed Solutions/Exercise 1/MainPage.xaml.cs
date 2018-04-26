using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using System.Threading.Tasks;
using System.Diagnostics;
using Windows.UI.Popups;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace WinOffice365Calendar
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            // Developer code - if you haven't registered the app yet, we warn you. 
            if (!App.Current.Resources.ContainsKey("ida:ClientID"))
            {
                appTitle.Text = "Oops - App not registered with Office 365. To run this sample, you must specify a client Id. See the steps above for more info.";
            }
        }

        public async Task SignInCurrentUserAsync()
        {
            await AuthenticationHelper.GetGraphAccessTokenAsync();
            if (AuthenticationHelper.LastAccessToken != null)
            {
                Debug.WriteLine("AuthorizationCode: " + AuthenticationHelper.LastAccessToken);
            }
        }

        //Toggle button for logging user in and out.
        private async void ConnectButton_Click(object sender, RoutedEventArgs e)
        {
            if (AuthenticationHelper.AccessToken == null)
            {
                ProgressBar.Visibility = Visibility.Visible;
                await SignInCurrentUserAsync();
                if (AuthenticationHelper.LastAccessToken == null)
                {
                    Debug.WriteLine("Unable to log in user.");
                }
                else
                {
                    var messageDialog = new MessageDialog("Connected Successfully.");
                    messageDialog.Commands.Add(new UICommand(
                            "OK", null));
                    await messageDialog.ShowAsync();
                    ConnectButton.Content = "Disconnect";
                }
            }
            else
            {
                ProgressBar.Visibility = Visibility.Visible;
                AuthenticationHelper.SignOut();
                ConnectButton.Content = "connect";
            }
            ProgressBar.Visibility = Visibility.Collapsed;
        }

        private async void ReloadButton_Click(object sender, RoutedEventArgs e)
        {

        }
    }
}
