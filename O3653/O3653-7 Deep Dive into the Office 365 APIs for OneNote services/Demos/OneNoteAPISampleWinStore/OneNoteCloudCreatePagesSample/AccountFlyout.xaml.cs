//*********************************************************
// Copyright (c) Microsoft Corporation
// All rights reserved. 
//
// Licensed under the Apache License, Version 2.0 (the ""License""); 
// you may not use this file except in compliance with the License. 
// You may obtain a copy of the License at 
// http://www.apache.org/licenses/LICENSE-2.0 
//
// THIS CODE IS PROVIDED ON AN  *AS IS* BASIS, WITHOUT 
// WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS 
// OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED 
// WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR 
// PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
//
// See the Apache Version 2.0 License for specific language 
// governing permissions and limitations under the License.
//*********************************************************

using Microsoft.Live;
using OneNoteCloudCreatePagesSample.Common;
using Windows.UI.Xaml;

namespace OneNoteCloudCreatePagesSample
{
    /// <summary>
    /// Reepresents a settings flyout for handlign account sign in/sign out
    /// </summary>
    public sealed partial class AccountFlyout : SettingsFlyout
    {
        public static readonly DependencyProperty SignInNameProperty =
            DependencyProperty.Register("SignInName", typeof (string), typeof (AccountFlyout),
                                        new PropertyMetadata(null));

        public static readonly DependencyProperty IsSignedInProperty =
            DependencyProperty.Register("IsSignedIn", typeof(bool), typeof(AccountFlyout),
                                        new PropertyMetadata(null));
        /// <summary>
        /// Name shown as currently signed in user
        /// </summary>
        public string SignInName
        {
            get { return (string)this.GetValue(SignInNameProperty); }
            set { this.SetValue(SignInNameProperty, value); }
        }

        /// <summary>
        /// Is the user currently signed in
        /// </summary>
        public bool IsSignedIn
        {
            get { return (bool)this.GetValue(IsSignedInProperty); }
            set { this.SetValue(IsSignedInProperty, value); }
        }

        /// <summary>
        /// Constructor
        /// </summary>
        public AccountFlyout()
        {
            this.InitializeComponent();
        }

        /// <summary>
        /// Opportunity to do flyout-specific logic when it the flyout is opened
        /// </summary>
        protected override void OnOpening()
        {
            base.OnOpening();
            this.UpdateState();
        }

        /// <summary>
        /// Click handler for sign in button
        /// </summary>
        private async void SignInClick(object sender, RoutedEventArgs e)
        {
            try
            {
                await MainPage.Current.SignIn();
                this.UpdateState();
            }
            catch (LiveConnectException)
            {
                // Handle exception.
            }
        }

        /// <summary>
        /// Click handler for sign out button
        /// </summary>
        private async void SignOutClick(object sender, RoutedEventArgs e)
        {
            try
            {
                await MainPage.Current.SignOut();
                this.UpdateState();
            }
            catch (LiveConnectException)
            {
                // Handle exception.
            }
        }

        /// <summary>
        /// Update the UI state to match the live status
        /// </summary>
        public void UpdateState()
        {
            try
            {
                this.SignInName = MainPage.Current.SignInName;
                this.IsSignedIn = MainPage.Current.IsSignedIn;
                if (this.IsSignedIn)
                {
                    // Show sign-out button if they can sign out.
                    signOutBtn.Visibility = (MainPage.Current.AuthClient.CanLogout
                                                 ? Visibility.Visible
                                                 : Visibility.Collapsed);
                    signInBtn.Visibility = Visibility.Collapsed;
                }
                else
                {
                    // Show sign-in button.
                    signInBtn.Visibility = Visibility.Visible;
                    signOutBtn.Visibility = Visibility.Collapsed;
                }
            }
            catch (LiveConnectException)
            {
                // Handle exception.
            }
        }
    }
}