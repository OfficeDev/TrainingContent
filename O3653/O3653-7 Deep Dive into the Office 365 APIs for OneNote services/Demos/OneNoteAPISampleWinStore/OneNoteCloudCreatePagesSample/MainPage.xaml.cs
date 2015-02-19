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

using System.Net;
using System.Threading.Tasks;
using Microsoft.Live;
using OneNoteCloudCreatePagesSample.Common;
using OneNoteCloudCreatePagesSample.DataModel;

using System;
using System.Collections.Generic;
using Windows.System;
using Windows.UI.ApplicationSettings;
using Windows.UI.Core;
using Windows.UI.Popups;
using Windows.UI.ViewManagement;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.ApplicationModel.Core;
using Windows.Foundation;

// The Split Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234234

namespace OneNoteCloudCreatePagesSample
{
    /// <summary>
    /// A page that displays a group title, a list of items within the group, and details for the
    /// currently selected item.
    /// </summary>
    public sealed partial class MainPage : OneNoteCloudCreatePagesSample.Common.LayoutAwarePage
    {
        private const string UserNotSignedIn = "You're not signed in.";

        private static MainPage _current;

        public static readonly DependencyProperty SignInNameProperty =
            DependencyProperty.Register("SignInName", typeof(string), typeof(MainPage),
                                        new PropertyMetadata(UserNotSignedIn));

        public static readonly DependencyProperty IsSignedInProperty =
            DependencyProperty.Register("IsSignedIn", typeof(bool), typeof(MainPage),
                                        new PropertyMetadata(false));


        private LiveAuthClient _authClient;
        private static readonly string[] Scopes = new[] {"wl.signin", "wl.offline_access", "Office.OneNote_Create" };

		private string pageSectionName = "Quick Notes";

        /// <summary>
        /// Authentication client to be used across the Page.
        /// </summary>
        public LiveAuthClient AuthClient
        {
            get
            {
                if (_authClient == null)
                {
                    _authClient = new LiveAuthClient();
                }
                return _authClient;
            }
        }

        public string SignInName
        {
            get { return (string) GetValue(SignInNameProperty); }
            private set { SetValue(SignInNameProperty, value); }
        }

        public bool IsSignedIn
        {
            get { return (bool) GetValue(IsSignedInProperty); }
            private set { SetValue(IsSignedInProperty, value); }
        }

        public static MainPage Current
        {
            get { return _current; }
        }

        public MainPage()
        {
            InitializeComponent();
            _current = this;
        }

        #region Page state management

        /// <summary>
        /// Populates the page with content passed during navigation.  Any saved state is also
        /// provided when recreating a page from a prior session.
        /// </summary>
        /// <param name="navigationParameter">The parameter value passed to
        /// <see cref="Frame.Navigate(Type, Object)"/> when this page was initially requested.
        /// </param>
        /// <param name="pageState">A dictionary of state preserved by this page during an earlier
        /// session.  This will be null the first time a page is visited.</param>
        protected override async void LoadState(Object navigationParameter, Dictionary<String, Object> pageState)
        {
            var group = SampleDataSource.GetGroup((string)navigationParameter);
            DefaultViewModel["Group"] = group;
            DefaultViewModel["Items"] = group.Items;

            if (pageState == null)
            {
                itemListView.SelectedItem = null;
                // When this is a new page, select the first item automatically unless logical page
                // navigation is being used (see the logical page navigation #region below.)
                if (!UsingLogicalPageNavigation() && this.itemsViewSource.View != null)
                {
                    itemsViewSource.View.MoveCurrentToFirst();
                }
            }
            else
            {
                // Restore the previously saved state associated with this page
                if (pageState.ContainsKey("SelectedItem") && this.itemsViewSource.View != null)
                {
                    var selectedItem = SampleDataSource.GetItem((String)pageState["SelectedItem"]);
                    itemsViewSource.View.MoveCurrentTo(selectedItem);
                }
            }
            await SilentSignIn();
        }

        /// <summary>
        /// Preserves state associated with this page in case the application is suspended or the
        /// page is discarded from the navigation cache.  Values must conform to the serialization
        /// requirements of <see cref="SuspensionManager.SessionState"/>.
        /// </summary>
        /// <param name="pageState">An empty dictionary to be populated with serializable state.</param>
        protected override void SaveState(Dictionary<String, Object> pageState)
        {
            if (itemsViewSource.View != null)
            {
                var selectedItem = (SampleDataItem)itemsViewSource.View.CurrentItem;
                if (selectedItem != null) pageState["SelectedItem"] = selectedItem.UniqueId;
            }
        }

        #endregion

        #region Logical page navigation

        // Visual state management typically reflects the four application view states directly
        // (full screen landscape and portrait plus snapped and filled views.)  The split page is
        // designed so that the snapped and portrait view states each have two distinct sub-states:
        // either the item list or the details are displayed, but not both at the same time.
        //
        // This is all implemented with a single physical page that can represent two logical
        // pages.  The code below achieves this goal without making the user aware of the
        // distinction.

        /// <summary>
        /// Invoked to determine whether the page should act as one logical page or two.
        /// </summary>
        /// <param name="viewState">The view state for which the question is being posed, or null
        /// for the current view state.  This parameter is optional with null as the default
        /// value.</param>
        /// <returns>True when the view state in question is portrait or snapped, false
        /// otherwise.</returns>
        private bool UsingLogicalPageNavigation(ApplicationViewState? viewState = null)
        {
            if (viewState == null) viewState = ApplicationView.Value;
            return viewState == ApplicationViewState.FullScreenPortrait ||
                viewState == ApplicationViewState.Snapped;
        }

        /// <summary>
        /// Invoked when an item within the list is selected.
        /// </summary>
        /// <param name="sender">The GridView (or ListView when the application is Snapped)
        /// displaying the selected item.</param>
        /// <param name="e">Event data that describes how the selection was changed.</param>
        void ItemListView_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Invalidate the view state when logical page navigation is in effect, as a change
            // in selection may cause a corresponding change in the current logical page.  When
            // an item is selected this has the effect of changing from displaying the item list
            // to showing the selected item's details.  When the selection is cleared this has the
            // opposite effect.
            if (UsingLogicalPageNavigation()) InvalidateVisualState();
        }

        /// <summary>
        /// Invoked when the page's back button is pressed.
        /// </summary>
        /// <param name="sender">The back button instance.</param>
        /// <param name="e">Event data that describes how the back button was clicked.</param>
        protected override void GoBack(object sender, RoutedEventArgs e)
        {
            if (UsingLogicalPageNavigation() && itemListView.SelectedItem != null)
            {
                // When logical page navigation is in effect and there's a selected item that
                // item's details are currently displayed.  Clearing the selection will return
                // to the item list.  From the user's point of view this is a logical backward
                // navigation.
                itemListView.SelectedItem = null;
            }
            else
            {
                // When logical page navigation is not in effect, or when there is no selected
                // item, use the default back button behavior.
                base.GoBack(sender, e);
            }
        }

        /// <summary>
        /// Invoked to determine the name of the visual state that corresponds to an application
        /// view state.
        /// </summary>
        /// <param name="viewState">The view state for which the question is being posed.</param>
        /// <returns>The name of the desired visual state.  This is the same as the name of the
        /// view state except when there is a selected item in portrait and snapped views where
        /// this additional logical page is represented by adding a suffix of _Detail.</returns>
        protected override string DetermineVisualState(ApplicationViewState viewState)
        {
            // Update the back button's enabled state when the view state changes
            var logicalPageBack = UsingLogicalPageNavigation(viewState) && itemListView.SelectedItem != null;
            var physicalPageBack = Frame != null && Frame.CanGoBack;
            DefaultViewModel["CanGoBack"] = logicalPageBack || physicalPageBack;

            // Determine visual states for landscape layouts based not on the view state, but
            // on the width of the window.  This page has one layout that is appropriate for
            // 1366 virtual pixels or wider, and another for narrower displays or when a snapped
            // application reduces the horizontal space available to less than 1366.
            if (viewState == ApplicationViewState.Filled ||
                viewState == ApplicationViewState.FullScreenLandscape)
            {
                var windowWidth = Window.Current.Bounds.Width;
                if (windowWidth >= 1366) return "FullScreenLandscapeOrWide";
                return "FilledOrNarrow";
            }

            // When in portrait or snapped start with the default visual state name, then add a
            // suffix when viewing details instead of the list
            var defaultStateName = base.DetermineVisualState(viewState);
            return logicalPageBack ? defaultStateName + "_Detail" : defaultStateName;
        }

        #endregion

        #region Settings Management
        /// <summary>
        /// Opens the privacy settings flyout.
        /// </summary>
        /// <param name="command">The settings command issued by the user.</param>
        internal void OpenPrivacySettingsFlyout(IUICommand command)
        {
            privacy.Open();
        }
        
        /// <summary>
        /// Opens the account settings flyout.
        /// </summary>
        /// <param name="command">The settings command issued by the user.</param>
        internal void OpenAccountSettingsFlyout(IUICommand command)
        {
           account.Open();
        }
        #endregion

        #region Authentication

        public async Task<LiveLoginResult> SignIn()
        {
            // First try silent login
            
            LiveLoginResult loginResult = await AuthClient.InitializeAsync(Scopes);

            // Sign in to the user's Microsoft account with the required scope.
            //  
            //  This call will display the Microsoft account sign-in screen if 
            //   the user is not already signed in to their Microsoft account 
            //   through Windows 8.
            // 
            //  This call will also display the consent dialog, if the user has 
            //   has not already given consent to this app to access the data 
            //   described by the scope.
            // 
            //  Change the parameter of LoginAsync to include the scopes 
            //   required by your app.
            if (loginResult.Status != LiveConnectSessionStatus.Connected)
            {
                loginResult = await AuthClient.LoginAsync(Scopes);
            }
            UpdateAuthProperties(loginResult.Status);
            return loginResult;
        }

        public async Task SignOut()
        {
            LiveLoginResult loginResult = await AuthClient.InitializeAsync(Scopes);

            // Sign the user out, if they are connected
            if (loginResult.Status != LiveConnectSessionStatus.NotConnected)
            {
                AuthClient.Logout();
            }
            UpdateAuthProperties(LiveConnectSessionStatus.NotConnected);
        }

        public async Task<LiveLoginResult> SilentSignIn()
        {
            try
            {
                LiveLoginResult loginResult = await AuthClient.InitializeAsync(Scopes);
                UpdateAuthProperties(loginResult.Status);
                return loginResult;
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Update dependency properties that drive the UI for Auth
        /// </summary>
        private async void UpdateAuthProperties(LiveConnectSessionStatus loginStatus)
        {
            IsSignedIn = loginStatus == LiveConnectSessionStatus.Connected;
            if (IsSignedIn)
            {
                SignInName = await RetrieveName();
            }
            else
            {
                SignInName = UserNotSignedIn;
            }
        }

        /// <summary>
        /// Get the user's name from the profile 
        /// </summary>
        private async Task<string> RetrieveName()
        {
            // Create a client session to get the profile data.
            var lcConnect = new LiveConnectClient(AuthClient.Session);

            // Get the profile info of the user.
            LiveOperationResult operationResult = await lcConnect.GetAsync("me");
            dynamic result = operationResult.Result;
            if (result != null)
            {
                return (string)result.name;
            }
            else
            {
                // Handle the case where the user name was not returned. 
                throw new InvalidOperationException();
            }
        }

        #endregion

        private async Task AttemptRefreshToken()
        {
            //If the user is signed in and has not yet signed out, we will attempt to refresh the token if necessary before sending a create page request
            if (IsSignedIn)
            {
                //Attempt to use the refresh token acquired previously since the user has not explicitly signed out
                LiveLoginResult loginWithRefreshTokenResult = await AuthClient.InitializeAsync(Scopes);
                UpdateAuthProperties(loginWithRefreshTokenResult.Status);
            }
        }

        private async void CreatePageButton_Click(object sender, RoutedEventArgs e)
        {
            await AttemptRefreshToken();
            await CreatePage();
        }

        private async void DebugButton_Click(object sender, RoutedEventArgs e)
        {
            await AttemptRefreshToken();
            await CreatePage(true);
        }

        private async Task CreatePage(bool debug = false)
        {
            try
            {
                await SetActionControlState(false);
                await ClearResponseFields();

                // Get actual handler for the specific example from the data model
                Func<bool, string, Task<StandardResponse>> runAction = ((SampleDataItem) (itemDetail.DataContext)).Action;
                if (runAction != null)
                {
					StandardResponse response = await runAction(debug, pageSectionName);
                    responseTextBox.Text = ((int) response.StatusCode).ToString() + ": " +
                                                response.StatusCode.ToString();
                    if (response.StatusCode == HttpStatusCode.Created)
                    {
                        var successResponse = (CreateSuccessResponse) response;
                        clientLinkTextBox.Text = successResponse.OneNoteClientUrl ?? "No URI";
                        webLinkTextBox.Text = successResponse.OneNoteWebUrl ?? "No URI";
                    }
                    else
                    {
                        clientLinkTextBox.Text = string.Empty;
                        webLinkTextBox.Text = string.Empty;

                        // TODO: Log response.CorrelationId  and date/time if app is in diagnostic mode.
                        // This is the key information that will facilitiate diagnosis with Microsoft support.
                    }
                }
            }
            finally
            {
#pragma warning disable 4014 // Disable warning as it is not possible to await inside a finally block.
                SetActionControlState(true);
#pragma warning restore 4014
            }
        }

        /// <summary>
        /// Yield the thread of operation to the dispatcher to allow UI updates to happen.
        /// </summary>
        /// <remarks>
        /// Schedules a do-nothing operation on the dispatcher, then allows continuation after it's 'completed'.
        /// Usage: await Yield();
        /// </remarks>
        /// <returns>A dispatcher operation that is awaitable.</returns>
        /// 
        private static IAsyncAction Yield()
        {
            return CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () => { });
        }

        /// <summary>
        /// Update the enabled states of the UI buttons and allow the UI to refresh.
        /// </summary>
        private async Task SetActionControlState(bool enabled)
        {
            createPageButton.IsEnabled = enabled;
            debugButton.IsEnabled = enabled;
            webLinkLaunchButton.IsEnabled = enabled;
            clientLinkLaunchButton.IsEnabled = enabled;
            await Yield();
        }

        /// <summary>
        /// Empty the response UI fields and allow the UI to refresh.
        /// </summary>
        private async Task ClearResponseFields()
        {
            responseTextBox.Text = string.Empty;
            clientLinkTextBox.Text = string.Empty;
            webLinkTextBox.Text = string.Empty;
            await Yield();    
        }

        private void authenticateButton_Click(object sender, RoutedEventArgs e)
        {
            SettingsPane.Show();
        }

        private async void clientLinkLaunchButton_Click(object sender, RoutedEventArgs e)
        {
            await Launcher.LaunchUriAsync(new Uri(clientLinkTextBox.Text));
        }

        private async void webLinkLaunchButton_Click(object sender, RoutedEventArgs e)
        {
            await Launcher.LaunchUriAsync(new Uri(webLinkTextBox.Text));
        }

		private void sectionName_GotFocus(object sender, RoutedEventArgs e)
		{
			if(sectionName.Text.Equals("Enter Section Name"))
			{
				sectionName.Text = string.Empty;
			}
		}

		private void sectionName_LostFocus(object sender, RoutedEventArgs e)
		{
			if(string.IsNullOrEmpty(sectionName.Text))
			{
				sectionName.Text = "Enter Section Name";
			}
		}

		private void sectionName_TextChanged(object sender, TextChangedEventArgs e)
		{
			string sectionNameSpecified = sectionName.Text.Trim();
			if(sectionNameSpecified.Trim().Length > 0)
			{
				if(sectionNameSpecified.Equals("Enter Section Name"))
				{
					pageSectionName = "Quick Notes";
				}
				else
				{
					pageSectionName = sectionNameSpecified;
				}
			}
		}
    }
}
