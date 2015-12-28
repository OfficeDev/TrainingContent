using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using O365_Win_Profile.Model;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace O365_Win_Profile
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {

        private string _loggedInUserName = null;
        private bool _userLoggedIn = false;
        private string _loginAuthorizationCode = null;
        private UserOperations _userOperations = new UserOperations();
        public static ApplicationDataContainer _settings = ApplicationData.Current.LocalSettings;

        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            // Developer code - if you haven't registered the app yet, we warn you. 
            if (!App.Current.Resources.ContainsKey("ida:ClientID"))
            {
                appTitle.Text = "Oops - App not registered with Office 365. To run this sample, you must register it with Office 365. You can do that through the 'Add | Connected services' dialog in Visual Studio. See Readme for more info";


            }

            //Launch ADAL signin
            ProgressBar.Visibility = Visibility.Visible;


            try
            {
                await SignInCurrentUserAsync();

                _userLoggedIn = true;

                //If signin is successful, populate the user list

                if (_loginAuthorizationCode != null)
                {
                    if (App.UserList == null)
                    {
                        App.UserList = await _userOperations.GetUsersAsync();
                    }

                    if (App.UserList.Count > 0)
                    {
                        UsersList.ItemsSource = App.UserList;
                        UsersList.Visibility = Visibility.Visible;
                    }
                    else
                    {
                        UsersList.ItemsSource = null;
                        UsersList.Visibility = Visibility.Collapsed;
                    }

                    ProgressBar.Visibility = Visibility.Collapsed;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Could not log in: " + ex.Message);
            }



        }


        public MainPage()
        {
            this.InitializeComponent();
        }

        public async Task SignInCurrentUserAsync()
        {

            _loginAuthorizationCode = await AuthenticationHelper.GetGraphAccessTokenAsync();

            if (_loginAuthorizationCode != null)
            {
                _loggedInUserName = (string)_settings.Values["LoggedInUser"];

            }
        }

        private void UsersList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            UserModel selectedUser = (UserModel)e.AddedItems[0];
            this.Frame.Navigate(typeof(UserDisplayPage), selectedUser.id);
        }


        //Toggle button for logging user in and out.
        private async void ConnectButton_Click(object sender, RoutedEventArgs e)
        {
            if (!_userLoggedIn)
            {
                ProgressBar.Visibility = Visibility.Visible;
                await SignInCurrentUserAsync();
                if (_loginAuthorizationCode == null)
                {
                    Debug.WriteLine("Unable to log in user.");

                }
                else
                {
                    ConnectButton.Content = "disconnect";
                }

            }
            else
            {
                ProgressBar.Visibility = Visibility.Visible;
                AuthenticationHelper.SignOut();
                ProgressBar.Visibility = Visibility.Collapsed;
                _userLoggedIn = false;
                ConnectButton.Content = "connect";
            }

            ProgressBar.Visibility = Visibility.Collapsed;
        }

    }
}
