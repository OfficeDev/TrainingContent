using HubApp2.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace HubApp2.O365Helpers
{
    /// <summary>
    /// Contains methods for accessing the files and folders.
    /// </summary>
    public class FileOperations
    {
        /// <summary>
        /// Performs a search of the default Documents folder. Displays the first page of results.
        /// </summary>
        /// <returns>A collection of information that describes files and folders.</returns>
        internal async Task<List<FileSystemItemViewModel>> GetMyFilesAsync()
        {
            var fileResults = new List<FileSystemItemViewModel>();

            try
            {
                var restURL = string.Format("{0}me/drive/root/children", AuthenticationHelper.ResourceBetaUrl);
                string responseString = await AuthenticationHelper.GetJsonAsync(restURL);
                if (responseString != null)
                {
                    var jsonresult = JObject.Parse(responseString);

                    foreach (var item in jsonresult["value"])
                    {
                        FileSystemItemViewModel fileItemModel = new FileSystemItemViewModel();
                        fileItemModel.Name = !string.IsNullOrEmpty(item["name"].ToString()) ? item["name"].ToString() : string.Empty;
                        fileItemModel.LastModifiedBy = !string.IsNullOrEmpty(item["lastModifiedBy"]["user"]["displayName"].ToString()) ? item["lastModifiedBy"]["user"]["displayName"].ToString() : string.Empty;
                        fileItemModel.LastModifiedDateTime = !string.IsNullOrEmpty(item["lastModifiedDateTime"].ToString()) ? DateTime.Parse(item["lastModifiedDateTime"].ToString()) : new DateTime();
                        fileItemModel.Id = !string.IsNullOrEmpty(item["id"].ToString()) ? item["id"].ToString() : string.Empty;
                        fileItemModel.Folder = item["folder"] != null ? item["folder"].ToString() : string.Empty;
                        fileResults.Add(fileItemModel);
                    }
                }
            }
            catch (Exception el)
            {
                el.ToString();
            }

            return fileResults.OrderBy(e => e.Name).ToList();
        }
    }
}
//********************************************************* 
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