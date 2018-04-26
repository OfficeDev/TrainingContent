// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
using Microsoft.OData.Client;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Windows.UI.Xaml.Media.Imaging;
using Microsoft.Graph;


namespace O365_Win_Profile
{
    class UserOperations
    {
        public async Task<List<User>> GetUsersAsync()
        {
            try
            {
                var graphServiceClient = await AuthenticationHelper.GetGraphServiceAsync(AuthenticationHelper.EndpointUrl);
                var userCollection = await graphServiceClient.Users.Request().
                                          Filter(string.Format("userType eq 'Member'")).
                                          Select("id,displayName,jobTitle").GetAsync();
                return userCollection.CurrentPage.ToList();
            }
            catch (Exception el)
            {
                el.ToString();
            }
            return null;
        }

        public async Task<User> GetUserManagerAsync(string userId)
        {
            try
            {
                var graphServiceClient = await AuthenticationHelper.GetGraphServiceAsync(AuthenticationHelper.EndpointUrl);

                UserRequestBuilder userBuilder = new UserRequestBuilder(string.Format("{0}/users/{1}", AuthenticationHelper.EndpointUrl, userId),
                                                                       graphServiceClient);
                User user = (await userBuilder.Manager.Request().GetAsync()) as User;
                return user;
            }
            catch (Exception el)
            {
                el.ToString();
            }
            return null;
        }

        public async Task<User> GetUserAsync(string userId)
        {
            try
            {
                var graphServiceClient = await AuthenticationHelper.GetGraphServiceAsync(AuthenticationHelper.EndpointUrl);
                UserRequestBuilder userBuilder = new UserRequestBuilder(string.Format("{0}/users/{1}", AuthenticationHelper.EndpointUrl, userId),
                                                                       graphServiceClient);
                return await userBuilder.Request().Select("id,displayName,jobTitle,email,userPrincipalName,department,mobilePhone,city,country,streetAddress").GetAsync();
            }
            catch (Exception el)
            {
                el.ToString();
            }
            return null;
        }

        public async Task<List<DirectoryObject>> GetUserDirectReportsAsync(string userId)
        {
            try
            {
                var graphServiceClient = await AuthenticationHelper.GetGraphServiceAsync(AuthenticationHelper.EndpointUrl);
                var directReportsBuilder = new UserDirectReportsCollectionWithReferencesRequestBuilder(string.Format("{0}/users/{1}/directReports", AuthenticationHelper.EndpointUrl, userId),
                                                                                               graphServiceClient);
                var directReport = (await directReportsBuilder.Request().GetAsync()).CurrentPage.ToList();

                return directReport;
            }

            catch (Exception el)
            {
                el.ToString();
            }
            return null;
        }

        public async Task<List<DirectoryObject>> GetUserGroupsAsync(string userId)
        {
            try
            {
                var graphServiceClient = await AuthenticationHelper.GetGraphServiceAsync(AuthenticationHelper.EndpointUrl);
                UserRequestBuilder userBuilder = new UserRequestBuilder(string.Format("{0}/users/{1}", AuthenticationHelper.EndpointUrl, userId),
                                                           graphServiceClient);
                var groups = (await userBuilder.MemberOf.Request().GetAsync()).CurrentPage.ToList();
                var retGroups = groups.Where(i => i is Group).ToList();
                return retGroups;
            }

            catch (Exception el)
            {
                el.ToString();
            }
            return null;
        }

        public async Task<List<DriveItem>> GetUserFilesAsync(string userId)
        {
            try
            {
                var graphServiceClient = await AuthenticationHelper.GetGraphServiceAsync(AuthenticationHelper.EndpointUrl);
                UserRequestBuilder userBuilder = new UserRequestBuilder(string.Format("{0}/users/{1}", AuthenticationHelper.EndpointUrl, userId),
                                                           graphServiceClient);
                return (await userBuilder.Drive.Root.Children.Request().GetAsync()).CurrentPage.ToList();
            }

            catch (Exception el)
            {
                el.ToString();
            }
            return null;
        }

        public async Task<BitmapImage> GetPhotoAsync(string userId)
        {
            BitmapImage bitmap = null;
            try
            {
                var graphServiceClient = await AuthenticationHelper.GetGraphServiceAsync(AuthenticationHelper.EndpointUrl);
                var photoStream = await graphServiceClient.Users[userId].Photo.Content.Request().GetAsync();

                var memStream = new MemoryStream();
                await photoStream.CopyToAsync(memStream);
                memStream.Position = 0;
                bitmap = new BitmapImage();
                await bitmap.SetSourceAsync(memStream.AsRandomAccessStream());
            }
            catch (Exception el)
            {
                el.ToString();
            }
            if (bitmap == null)
            {
                Debug.WriteLine("Unable to find an image at this endpoint.");
                bitmap = new BitmapImage(new Uri("ms-appx:///assets/UserDefault.png", UriKind.RelativeOrAbsolute));
            }
            return bitmap;
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