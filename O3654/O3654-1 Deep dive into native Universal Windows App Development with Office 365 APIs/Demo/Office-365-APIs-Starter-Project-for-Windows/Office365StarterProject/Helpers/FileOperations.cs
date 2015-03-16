// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

using Microsoft.OData.Client;
using Microsoft.OData.Core;
using Microsoft.Office365.SharePoint.FileServices;
using Office365StarterProject.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;
using Windows.Storage.Pickers;

namespace Office365StarterProject.Helpers
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
        internal async Task<IEnumerable<IItem>> GetMyFilesAsync()
        {
            try
            {
                var sharePointClient = await AuthenticationHelper.EnsureSharePointClientCreatedAsync();

                // Performs a search of the default Documents folder (folder Id is "root")
                // You could also specify another folder if you know its Id using the following syntax. 
                // var filesResults = await sharePointClient.Files.GetById("folderId").ToFolder().Children.ExecuteAsync();
                // This results in a call to the service.
                var filesResults = await sharePointClient.Files.ExecuteAsync();

                // In this example, we'll just return the first page of results
                return filesResults.CurrentPage.OrderBy(e => e.Name);
            }
            catch (ODataErrorException)
            {
                return null;
            }
            catch(DataServiceQueryException)
            {
                return null;
            }
        }
        /// <summary>
        /// Creates a new file named demo.txt in the default document library.
        /// </summary>
        /// <returns>A Boolean value that indicates whether the new text file was successfully created.</returns>
        internal async Task<bool> CreateNewTextFileAsync()
        {
            bool isSuccess = false;
            var sharePointClient = await AuthenticationHelper.EnsureSharePointClientCreatedAsync();

            try
            {
                // In this example, we'll create a simple text file and write the current timestamp into it. 
                string createdTime = "Created at " + DateTime.Now.ToLocalTime().ToString();
                byte[] bytes = Encoding.UTF8.GetBytes(createdTime);

                using (MemoryStream stream = new MemoryStream(bytes))
                {
                    // File is called demo.txt. If it already exists, we'll get an exception. 
                    File newFile = new File
                    {
                        Name = "demo.txt"
                    };

                    // Create the empty file.
                    await sharePointClient.Files.AddItemAsync(newFile);

                    // Upload the file contents.
                    await sharePointClient.Files.GetById(newFile.Id).ToFile().UploadAsync(stream);
                }

                isSuccess = true;
            }
            
            // ODataErrorException can be thrown when you try to create a file that already exists.
            catch (ODataErrorException)
            {
                isSuccess = false;
            }

            return isSuccess;
        }

        /// <summary>
        /// Deletes the selected item or folder from the ListBox.
        /// </summary>
        /// <returns>A Boolean value that indicates whether the file or folder was successfully deleted.</returns>
        internal async Task<bool?> DeleteFileOrFolderAsync(FileSystemItemViewModel _selectedFileObject)
        {
            bool? isSuccess = false;

            try
            {
                // Gets the FileSystemItem that is selected in the bound ListBox control.
                IItem fileOrFolderToDelete = _selectedFileObject.FileSystemItem;

                // This results in a call to the service.
                await fileOrFolderToDelete.DeleteAsync();

                isSuccess = true;
            }
            catch (Microsoft.Data.OData.ODataErrorException)
            {
                isSuccess = null;
            }
            catch (NullReferenceException)
            {
                isSuccess = null;
            }

            return isSuccess;
        }

        /// <summary>
        /// Reads the contents of a text file and displays the results in a TextBox.
        /// </summary>
        /// <param name="_selectedFileObject">The file selected in the ListBox.</param>
        /// <returns>A Boolean value that indicates whether the text file was successfully read.</returns>
        internal async Task<object[]> ReadTextFileAsync(FileSystemItemViewModel _selectedFileObject)
        {
            
            string fileContents = string.Empty;
            object[] results = new object[] { fileContents, false };

            try
            {
                // Get a handle on the selected item.
                IItem myFile = _selectedFileObject.FileSystemItem;

                // Check that the selected item is a text-based file.
                if (!myFile.Name.EndsWith(".txt") && !myFile.Name.EndsWith(".xml"))
                {
                    results[0] = string.Empty;
                    results[1] = false;
                    return results;
                }

                File file = myFile as File;

                // Download the file contents as a string. This results in a call to the service.
                using (Stream stream = await file.DownloadAsync())
                {
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        results[0] = await reader.ReadToEndAsync();
                        results[1] = true;
                    }
                }
            }
            catch (NullReferenceException)
            {
                results[1] = false;
            }
            catch (ArgumentException)
            {
                results[1] = false;
            }

            return results;
        }

        /// <summary>
        /// Update the currently selected item by appending new text.
        /// </summary>
        /// <param name="_selectedFileObject">The file selected in the ListBox.</param>
        /// <param name="fileText">The updated text contents of the file.</param>
        /// <returns>A Boolean value that indicates whether the text file was successfully updated.</returns>
        internal async Task<bool> UpdateTextFileAsync(FileSystemItemViewModel _selectedFileObject, string fileText)
        {
            File file;
            byte[] byteArray;
            bool isSuccess = false;

            try
            {
                // Get a handle on the selected item.
                IItem myFile = _selectedFileObject.FileSystemItem;
                file = myFile as File;
                string updateTime = "\n\r\n\rLast update at " + DateTime.Now.ToLocalTime().ToString();
                byteArray = Encoding.UTF8.GetBytes(fileText + updateTime);

                using (MemoryStream stream = new MemoryStream(byteArray))
                {
                    // Update the file. This results in a call to the service.
                    await file.UploadAsync(stream);
                    isSuccess = true; // We've updated the file.
                }
            }
            catch (ArgumentException)
            {
                isSuccess = false;
            }

          return isSuccess; 
        }

        /// <summary>
        /// Downloads a file selected in the ListBox control.
        /// </summary>
        /// <param name="_selectedFileObject">The file selected in the ListBox.</param>
        /// <returns>A Stream of the downloaded file.</returns>
        internal async Task<Stream> DownloadFileAsync(FileSystemItemViewModel _selectedFileObject)
        {

            File file;
            Stream stream = null;

            try
            {
                // Get a handle on the selected item.
                IItem myFile = _selectedFileObject.FileSystemItem;
                file = myFile as File;
                // Download the file from the service. This results in call to the service.
                stream = await file.DownloadAsync();
            }

            catch (NullReferenceException)
            {
                // Silently fail. A null stream will be handled higher up the stack.
            }

            return stream;
        }


        /// <summary>
        /// Uploads a file to the default document library.
        /// </summary>
        /// <returns>A Boolean value that indicates whether the upload was successful.</returns>
        internal async Task<bool> UploadFileAsync()
        {
            bool isSuccess = false;
            try
            {
                FileOpenPicker picker = new FileOpenPicker();
                picker.FileTypeFilter.Add("*");
                picker.SuggestedStartLocation = PickerLocationId.DocumentsLibrary;

                StorageFile sFile = await picker.PickSingleFileAsync();
                if (sFile != null)
                {
                    var sharePointClient = await AuthenticationHelper.EnsureSharePointClientCreatedAsync();
                    using (var stream = await sFile.OpenStreamForReadAsync())
                    {
                        File newFile = new File
                        {
                            Name = sFile.Name
                        };

                        await sharePointClient.Files.AddItemAsync(newFile);
                        await sharePointClient.Files.GetById(newFile.Id).ToFile().UploadAsync(stream);
                    }
                    isSuccess = true;
                }
            }
            catch (NullReferenceException)
            {
                isSuccess = false;
            }

            return isSuccess;
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
