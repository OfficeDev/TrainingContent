// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.ApplicationModel.Resources;
using Windows.ApplicationModel.Resources.Core;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Imaging;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace O365_Win_Profile
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {

        private string _loggedInUserName = null;
        private bool _userLoggedIn = false;
        private GraphService _graphClient = null;
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

                if (_graphClient != null)
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

            _graphClient = await AuthenticationHelper.GetGraphClientAsync();

            if (_graphClient != null)
            {
                _loggedInUserName = (string)_settings.Values["LoggedInUser"];

            }
        }

        private void UsersList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            User selectedUser = (User)e.AddedItems[0];
            this.Frame.Navigate(typeof(UserDisplayPage), selectedUser.objectId);
        }


        //Toggle button for logging user in and out.
        private async void ConnectButton_Click(object sender, RoutedEventArgs e)
        {
            if (!_userLoggedIn)
            {
                ProgressBar.Visibility = Visibility.Visible;
                await SignInCurrentUserAsync();
                if (_graphClient == null)
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

//********************************************************* 
// 
//O365-Win-Profile, https://github.com/OfficeDev/O365-Win-Profile
//
//Copyright (c) Microsoft Corporation
//All rights reserved. 
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// ""Software""), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// 
//********************************************************* 
