// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

#if WINDOWS_APP
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Office365.SharePoint;
using System.IO;
using Windows.Storage.Pickers;
using Windows.Storage;
using HubApp2.ViewModels;

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
		internal async Task<IEnumerable<IFileSystemItem>> GetMyFilesAsync()
		{
			var sharePointClient = await AuthenticationHelper.EnsureSharePointClientCreatedAsync();
			IOrderedEnumerable<IFileSystemItem> files = null;

			try
			{
				// Performs a search of the default Documents folder.
				// You could also specify other folders using the syntax: var filesResults = await _client.Files["folder_name"].ExecuteAsync();
				// This results in a call to the service.
				var filesResults = await sharePointClient.Files.ExecuteAsync();
				files = filesResults.CurrentPage.OrderBy(e => e.Name);
			}
			catch (Microsoft.OData.Core.ODataErrorException)
			{
				//Fail silently
			}

			return files;
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
				string createdTime = "Created at " + DateTime.Now.ToLocalTime().ToString();
				byte[] bytes = Encoding.UTF8.GetBytes(createdTime);

				using (MemoryStream stream = new MemoryStream(bytes))
				{
					// This results in a call to the service.
					await sharePointClient.Files.AddAsync("demo.txt", false, stream);
				}
				isSuccess = true;
			}

			// ODataErrorException can be thrown when you try to create a file that already exists.
			catch (Microsoft.Data.OData.ODataErrorException)
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
				IFileSystemItem fileOrFolderToDelete = _selectedFileObject.FileSystemItem;

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
				IFileSystemItem myFile = _selectedFileObject.FileSystemItem;

				// Check that the selected item is a .txt file.
				if (!myFile.Name.EndsWith(".txt") && !myFile.Name.EndsWith(".xml"))
				{
					results[0] = string.Empty;
					results[1] = false;
					return results;
				}

				File file = myFile as File;

				// Download the text file and put the results into a string. This results in a call to the service.
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
				IFileSystemItem myFile = _selectedFileObject.FileSystemItem;
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
				IFileSystemItem myFile = _selectedFileObject.FileSystemItem;
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

			var sharePointClient = await AuthenticationHelper.EnsureSharePointClientCreatedAsync();

			try
			{
				FileOpenPicker fop = new FileOpenPicker();
				fop.FileTypeFilter.Add("*");
				fop.SuggestedStartLocation = PickerLocationId.DocumentsLibrary;

				StorageFile sFile = await fop.PickSingleFileAsync();
				if (sFile != null)
				{
					var stream = await sFile.OpenStreamForReadAsync();

					// This results in call to the service.
					IFile iFile = await sharePointClient.Files.AddAsync(sFile.Name, true, stream);
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

#endif//********************************************************* 
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
