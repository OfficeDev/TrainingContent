// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
using Microsoft.OData.Client;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Windows.UI.Xaml.Media.Imaging;
using O365_Win_Profile.Model;


namespace O365_Win_Profile
{
    class UserOperations
    {

        public static async Task<string> GetJsonAsync(string url)
        {
            var accessToken = await AuthenticationHelper.GetGraphAccessTokenAsync();
            using (HttpClient client = new HttpClient())
            {
                var accept = "application/json";

                client.DefaultRequestHeaders.Add("Accept", accept);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                using (var response = await client.GetAsync(url))
                {
                    if (response.IsSuccessStatusCode)
                        return await response.Content.ReadAsStringAsync();
                    return null;
                }
            }
        }

        public async Task<List<UserModel>> GetUsersAsync()
        {

            List<UserModel> retUsers = null;
            try
            {
                var restURL = string.Format("{0}/users?$filter={1}", AuthenticationHelper.EndPointUrl, "(userType eq 'Member')");
                string responseString = await GetJsonAsync(restURL);

                if (responseString != null)
                {
                    retUsers = JObject.Parse(responseString)["value"].ToObject<UserModel[]>().ToList();
                }
            }

            catch (Exception el)
            {
                el.ToString();
            }

            return retUsers;
        }

        public async Task<UserModel> GetUserManagerAsync(string userId)
        {
            UserModel user = null;
            try
            {
                var restURL = string.Format("{0}/users/{1}/manager", AuthenticationHelper.EndPointUrl, userId);
                string responseString = await GetJsonAsync(restURL);

                if (responseString != null)
                {
                    user = JObject.Parse(responseString).ToObject<UserModel>();
                }
            }
            catch (Exception el)
            {
                el.ToString();
            }
            return user;
        }

        public async Task<UserModel> GetUserAsync(string userId)
        {
            UserModel user = null;
            try
            {
                var restURL = string.Format("{0}/users/{1}", AuthenticationHelper.EndPointUrl, userId);
                string responseString = await GetJsonAsync(restURL);
                if (responseString != null)
                {
                    user = JObject.Parse(responseString).ToObject<UserModel>();
                }
            }

            catch (Exception el)
            {
                el.ToString();
            }

            return user;
        }

        public async Task<List<UserModel>> GetUserDirectReportsAsync(string userId)
        {
            List<UserModel> retUsers = null;
            try
            {
                var restURL = string.Format("{0}/users/{1}/directReports", AuthenticationHelper.EndPointUrl, userId);
                string responseString = await GetJsonAsync(restURL);
                if (responseString != null)
                {
                    retUsers = JObject.Parse(responseString)["value"].ToObject<List<UserModel>>();
                }
            }

            catch (Exception el)
            {
                el.ToString();
            }
            return retUsers;
        }

        public async Task<List<GroupModel>> GetUserGroupsAsync(string userId)
        {
            List<GroupModel> retUserGroups = null;
            try
            {
                var restURL = string.Format("{0}/users/{1}/memberof", AuthenticationHelper.EndPointUrl, userId);
                string responseString = await GetJsonAsync(restURL);
                if (responseString != null)
                {
                    var jsonresult = JObject.Parse(responseString)["value"];
                    retUserGroups = new List<GroupModel>();
                    foreach (var item in jsonresult)
                    {
                        if (item["@odata.type"].ToString() == "#microsoft.graph.group")
                        {
                            var group = item.ToObject<GroupModel>();
                            retUserGroups.Add(group);
                        }
                    }

                }
            }

            catch (Exception el)
            {
                el.ToString();
            }
            return retUserGroups;
        }

        public async Task<List<DriveItemModel>> GetUserFilesAsync(string userId)
        {

            List<DriveItemModel> fileList = null;
            try
            {
                var restURL = string.Format("{0}/users/{1}/drive/root/children", AuthenticationHelper.EndPointUrl, userId);
                string responseString = await GetJsonAsync(restURL);
                if (responseString != null)
                {
                    fileList = JObject.Parse(responseString)["value"].ToObject<List<DriveItemModel>>();
                }
            }

            catch (Exception el)
            {
                el.ToString();
            }
            return fileList;
        }

        public async Task<BitmapImage> GetPhotoAsync(string userId, string token)
        {
            BitmapImage bitmap = null;
            var restURL = string.Format("{0}/users/{1}/photo/$value", AuthenticationHelper.EndPointUrl, userId);
            var accessToken = AuthenticationHelper.AccessToken;
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                using (var response = await client.GetAsync(restURL))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        Stream imageStream = await response.Content.ReadAsStreamAsync();

                        var memStream = new MemoryStream();
                        await imageStream.CopyToAsync(memStream);
                        memStream.Position = 0;

                        bitmap = new BitmapImage();
                        await bitmap.SetSourceAsync(memStream.AsRandomAccessStream());
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