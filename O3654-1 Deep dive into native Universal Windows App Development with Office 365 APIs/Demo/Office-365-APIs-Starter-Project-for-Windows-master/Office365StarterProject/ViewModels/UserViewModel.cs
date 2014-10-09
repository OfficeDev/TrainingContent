// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

using Microsoft.Office365.ActiveDirectory;
using Office365StarterProject.Common;
using Office365StarterProject.Helpers;
using System;
using System.Threading.Tasks;
using Windows.UI.Xaml.Media.Imaging;

namespace Office365StarterProject.ViewModels
{
    /// <summary>
    /// Respresents the signed-in user. 
    /// </summary>
    public class UserViewModel : ViewModelBase
    {

        private IUser _currentUser;
        private string _mailAddress;
        private string _id;
        private string _displayName = "(not signed in)";
        private string _jobTitle;
        private bool _signedIn;
        private string _logOnCaption = "Sign In";
        private static readonly BitmapImage _signedOutImage = new BitmapImage(new Uri("ms-appx:///assets/UserSignedOut.png", UriKind.RelativeOrAbsolute));
        private BitmapImage _avatar = _signedOutImage;
        private RelayCommand _toggleSignInCommand;
        private UserOperations _userOperations = new UserOperations();

        /// <summary>
        /// Gets the Id of the user.
        /// </summary>
        public string Id
        {
            get
            {
                return _id;
            }

            private set
            {
                SetProperty(ref _id, value);
            }
        }

        /// <summary>
        /// True if the user is signed in; Otherwise, false.
        /// </summary>
        public bool SignedIn
        {
            get
            {
                return _signedIn;
            }

            private set
            {
                SetProperty(ref _signedIn, value);
            }
        }

        /// <summary>
        /// The display name of the user.
        /// </summary>
        public string DisplayName
        {
            get
            {
                return _displayName;
            }

            private set
            {
                SetProperty(ref _displayName, value);
            }
        }

        /// <summary>
        /// The job title of the user.
        /// </summary>
        public string JobTitle
        {
            get
            {
                return _jobTitle;
            }

            private set
            {
                SetProperty(ref _jobTitle, value);
            }
        }

        /// <summary>
        /// Caption to show depending on the whether the user is signed in or not. 
        /// </summary>
        public string LogOnCaption
        {
            get
            {
                return _logOnCaption;
            }

            set
            {
                SetProperty(ref _logOnCaption, value);
            }
        }

        /// <summary>
        /// The user's avatar.
        /// </summary>
        public BitmapImage Avatar
        {
            get
            {
                return _avatar;
            }

            set
            {
                SetProperty(ref _avatar, value);
            }
        }

        public string MailAddress
        {
            get
            {
                return _mailAddress;
            }

        }

        private bool _loggingIn = false;

        /// <summary>
        /// True when we are in the process of logging in; Otherwise, false.
        /// </summary>
        public bool LoggingIn
        {
            get
            {
                return _loggingIn;
            }
            set
            {
                SetProperty(ref _loggingIn, value);
            }

        }

        /// <summary>
        /// Command to sign the user in if he is not already signed in or to sign the user out.
        /// </summary>
        public RelayCommand ToggleSignInCommand
        {
            get
            {
                if (_toggleSignInCommand == null)
                {
                    _toggleSignInCommand = new RelayCommand
                    (
                        async () =>
                        {
                            if (!SignedIn)
                            {
                                try
                                {
                                    this.LoggingIn = true;
                                    await SignInCurrentUserAsync();
                                    this.LoggingIn = false;
                                }
                                catch (Exception)
                                { this.LoggingIn = false; }
                            }
                            else
                            {
                                await SignOutAsync();
                            }
                        },
                        null
                    );
                }

                return _toggleSignInCommand;
            }
        }

        private async Task SignOutAsync()
        {
            if (!SignedIn)
                return;

            await _userOperations.SignOutAsync();

            Avatar = _signedOutImage;

            DisplayName = JobTitle = String.Empty;

            SignedIn = false;
            this.LogOnCaption = "Sign In";
        }

        /// <summary>
        /// Signs in the current user.
        /// </summary>
        /// <returns></returns>
        public async Task SignInCurrentUserAsync()
        {
            _currentUser = await _userOperations.AuthenticateCurrentUserAsync();

            if (_currentUser != null)
            {
                var profilePhoto = await _userOperations.GetUserThumbnailPhotoAsync(_currentUser);

                this.DisplayName = _currentUser.DisplayName;
                this.JobTitle = _currentUser.JobTitle;
                this.Avatar = profilePhoto;
                this.LogOnCaption = "Sign Out";
                this.Id = _currentUser.ObjectId;
                this._mailAddress = _currentUser.Mail;
                this.SignedIn = true;
            }
        }
    }
}
//********************************************************* 
// 
//O365-APIs-Start-Windows, https://github.com/OfficeDev/O365-APIs-Start-Windows
//
//Copyright (c) Microsoft Corporation
//All rights reserved. 
//
//MIT License:
//
//Permission is hereby granted, free of charge, to any person obtaining
//a copy of this software and associated documentation files (the
//""Software""), to deal in the Software without restriction, including
//without limitation the rights to use, copy, modify, merge, publish,
//distribute, sublicense, and/or sell copies of the Software, and to
//permit persons to whom the Software is furnished to do so, subject to
//the following conditions:
//
//The above copyright notice and this permission notice shall be
//included in all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
//LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// 
//********************************************************* 
