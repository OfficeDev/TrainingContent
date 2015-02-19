// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

using Microsoft.Azure.ActiveDirectory.GraphClient;
using Microsoft.Data.OData;
using System;
using System.IO;
using System.Threading.Tasks;
using Windows.UI.Xaml.Media.Imaging;

namespace Office365StarterProject.Helpers
{
    /// <summary>
    /// Contains methods for accessing user information stored in Azure AD.
    /// </summary>
    public class UserOperations
    {
        private string _userEmail = string.Empty;

        /// <summary>
        /// Authenticates and signs in the user. 
        /// </summary>
        /// <returns></returns>
        public async Task<IUser> AuthenticateCurrentUserAsync()
        {
            IUser currentUser = null;

            // Make sure we have a reference to the Azure Active Directory client
            var aadClient = await AuthenticationHelper.EnsureGraphClientCreatedAsync();

            if (aadClient != null)
            {
                // This results in a call to the service.
                currentUser = await (aadClient.Users
                                            .Where(i => i.ObjectId == AuthenticationHelper.LoggedInUser)
                                            .ExecuteSingleAsync());

                if (currentUser != null)
                    _userEmail = currentUser.Mail;

            }

            return currentUser;
        }

        /// <summary>
        /// Get the user's photo.
        /// </summary>
        /// <param name="user">The target user.</param>
        /// <returns></returns>
        public async Task<BitmapImage> GetUserThumbnailPhotoAsync(IUser user)
        {
            BitmapImage bitmap = null;
            try
            {
                // The using statement ensures that Dispose is called even if an 
                // exception occurs while you are calling methods on the object.
                using (var dssr = await user.ThumbnailPhoto.DownloadAsync())
                using (var stream = dssr.Stream)
                using (var memStream = new MemoryStream())
                {
                    await stream.CopyToAsync(memStream);
                    memStream.Seek(0, SeekOrigin.Begin);
                    bitmap = new BitmapImage();
                    await bitmap.SetSourceAsync(memStream.AsRandomAccessStream());
                }

            }
            catch(ODataException)
            {
                // Something went wrong retrieving the thumbnail photo, so set the bitmap to a default image
                bitmap = new BitmapImage(new Uri("ms-appx:///assets/UserDefaultSignedIn.png", UriKind.RelativeOrAbsolute));
            }

            return bitmap;
        }

        /// <summary>
        /// Sign out of the service.
        /// </summary>
        /// <returns></returns>
        public async Task SignOutAsync()
        {
            await AuthenticationHelper.SignOutAsync();
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
