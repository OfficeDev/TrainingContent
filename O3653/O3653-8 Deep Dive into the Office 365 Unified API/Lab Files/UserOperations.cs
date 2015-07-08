// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
using Microsoft.Graph;
using Microsoft.OData.Client;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml.Media.Imaging;

namespace O365_Win_Profile {
  class UserOperations {

    public async Task<List<IUser>> GetUsersAsync() {
      return null;
    }

    public async Task<User> GetUserManagerAsync(string userId) {
      return null;
    }

    public async Task<User> GetUserAsync(string userId) {
      return null;
    }

    public async Task<List<IDirectoryObject>> GetUserDirectReportsAsync(string userId) {
      return null;
    }

    public async Task<List<IDirectoryObject>> GetUserGroupsAsync(string userId) {
      return null;
    }

    public async Task<List<IItem>> GetUserFilesAsync(string userId) {
      return null;
    }

    public async Task<BitmapImage> GetPhotoAsync(string photoUrl, string token) {

      using (var client = new HttpClient()) {
        try {
          var request = new HttpRequestMessage(HttpMethod.Get, new Uri(photoUrl));
          BitmapImage bitmap = null;

          request.Headers.Add("Authorization", "Bearer " + token);

          var response = await client.SendAsync(request);

          var stream = await response.Content.ReadAsStreamAsync();
          if (response.IsSuccessStatusCode) {

            using (var memStream = new MemoryStream()) {
              await stream.CopyToAsync(memStream);
              memStream.Seek(0, SeekOrigin.Begin);
              bitmap = new BitmapImage();
              await bitmap.SetSourceAsync(memStream.AsRandomAccessStream());
            }
            return bitmap;
          } else {
            Debug.WriteLine("Unable to find an image at this endpoint.");
            bitmap = new BitmapImage(new Uri("ms-appx:///assets/UserDefault.png", UriKind.RelativeOrAbsolute));
            return bitmap;
          }

        } catch (Exception e) {
          Debug.WriteLine("Could not get the thumbnail photo: " + e.Message);
          return null;
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