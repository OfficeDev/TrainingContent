// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

using Microsoft.Office365.SharePoint;
using Microsoft.Office365.SharePoint.FileServices;
using Office365StarterProject.Common;
using Office365StarterProject.Helpers;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Threading.Tasks;
using System.Windows.Input;
using Windows.Storage;
using Windows.Storage.Pickers;

namespace Office365StarterProject.ViewModels
{
    /// <summary>
    /// View model for interacting with files.
    /// </summary>
    class FilesViewModel : ViewModelBase
    {
        #region Private fields, observable collection, cstor, property changed event
        public ObservableCollection<FileSystemItemViewModel> DirectoryItems { get; set; }
        private FileSystemItemViewModel _selectedFileObject = null;
        private string _updatedTextObject = null;
        private FileOperations _fileOperations;
        private bool _loadingFilesAndFolders = false;
        

        public FilesViewModel()
        {
            DirectoryItems = new ObservableCollection<FileSystemItemViewModel>();
            _fileOperations = new FileOperations();

            

            this.CreateNewFileCommand = new RelayCommand(ExecuteCreateCommandAsync);
            this.ReadFileandFoldersCommand = new RelayCommand(ExecuteGetFileAndFolderListCommandAsync);
            this.ReadTextFileCommand = new RelayCommand(ExecuteReadTextFileCommandAsync, CanReadTextFile);
            this.UpdateFileCommand = new RelayCommand(ExecuteUpdateCommandAsync, CanUpdateFile);
            this.DeleteFileOrFolderCommand = new RelayCommand(ExecuteDeleteCommandAsync, CanDeleteFileorFolder);
            this.UploadFileCommand = new RelayCommand(ExecuteUploadFileCommandAsync);
            this.DownloadFileCommand = new RelayCommand(ExecuteDownloadFileCommandAsync, CanDownloadFile);
        }
        #endregion

        #region Properties
        /// <summary>
        /// Gets or sets the property for the file that is selected in the listbox.
        /// </summary>
        public FileSystemItemViewModel SelectedFile
        {
            get
            {
                return _selectedFileObject;
            }
            set
            {
                if (SetProperty(ref _selectedFileObject, value))
                {
                    FileText = string.Empty;
                }
            }
        }

        /// <summary>
        /// Gets or sets the property for the updated text supplied in the textbox.
        /// </summary>
        public string FileText
        {
            get
            {
                return _updatedTextObject;
            }

            set
            {
                SetProperty(ref _updatedTextObject, value);
            }
        }

        public bool LoadingFilesAndFolders
        {
            get
            {
                return _loadingFilesAndFolders;
            }
            set
            {
                SetProperty(ref _loadingFilesAndFolders, value);
            }
        }

       
        #endregion       
        #region Command properties
        public ICommand CreateNewFileCommand { protected set; get; }
        public ICommand ReadFileandFoldersCommand { protected set; get; }
        public ICommand ReadTextFileCommand { protected set; get; }
        public ICommand UpdateFileCommand { protected set; get; }
        public ICommand DeleteFileOrFolderCommand { protected set; get; }
        public ICommand UploadFileCommand { protected set; get; }
        public ICommand DownloadFileCommand { protected set; get; }


   

        private bool CanReadTextFile()
        {
            return (_selectedFileObject != null
              && (_selectedFileObject.FileSystemItem.Name.EndsWith(".txt") || _selectedFileObject.FileSystemItem.Name.EndsWith(".xml")));
        }
        private bool CanUpdateFile()
        {
            return (_selectedFileObject != null 
                && (_selectedFileObject.FileSystemItem.Name.EndsWith(".txt") || _selectedFileObject.FileSystemItem.Name.EndsWith(".xml")));
        }

        private bool CanDownloadFile()
        {
            return (_selectedFileObject != null);
        }

        private bool CanDeleteFileorFolder()
        {
            return (_selectedFileObject != null);
        }

       
        #endregion
        #region Commands
        /// <summary>
        /// Command for getting the file and folder list.
        /// </summary>
        async void ExecuteGetFileAndFolderListCommandAsync()
        {
            await LoadFilesAndFoldersAsync();
        }

        private async Task LoadFilesAndFoldersAsync()
        {
            LoggingViewModel.Instance.Information = "Retrieving items ...";
            this.LoadingFilesAndFolders = true;

            DirectoryItems.Clear();

            IEnumerable<IItem> files = await _fileOperations.GetMyFilesAsync();

            if (files != null)
            {
                foreach (IItem file in files)
                {
                    FileSystemItemViewModel _directoryItem = new FileSystemItemViewModel(file);

                    //Adding FileSystemItems to observable collection.
                    DirectoryItems.Add(_directoryItem);
                }
                LoggingViewModel.Instance.Information = string.Empty;

            }
            else
            {
                LoggingViewModel.Instance.Information = "We couldn't get your file and folder list.";
            }

            this.LoadingFilesAndFolders = false;
        }
        /// <summary>
        /// Command for creating a file.
        /// </summary>
        async void ExecuteCreateCommandAsync()
        {
            bool isSuccess = await _fileOperations.CreateNewTextFileAsync();

            if (isSuccess)
            {
                await LoadFilesAndFoldersAsync();
                LoggingViewModel.Instance.Information = "You successfully created the text file!";
            }
            else
            {
                LoggingViewModel.Instance.Information = "The text file wasn't created. A text file named demo.txt may already exist.";
            }
        }
        /// <summary>
        /// Command for deleting a file.
        /// </summary>
        async void ExecuteDeleteCommandAsync()
        {
            bool deleteFile = await MessageDialogHelper.ShowYesNoDialogAsync(
            String.Format("Are you sure you want to delete '{0}'?",_selectedFileObject.Name), "Confirm deletion");

            if (deleteFile == true)
            {
                bool? isSuccess = await _fileOperations.DeleteFileOrFolderAsync(_selectedFileObject);
                


                if (isSuccess == true)
                {
                    await LoadFilesAndFoldersAsync();
                    LoggingViewModel.Instance.Information = "You successfully deleted the file or folder!";
                }
                else if (isSuccess == false)
                {
                    LoggingViewModel.Instance.Information = "The file or folder wasn't deleted.";
                }
                else
                {
                    LoggingViewModel.Instance.Information = "Please get the file and folder list, select an item, and try again.";
                }
            }

            else
            {
                LoggingViewModel.Instance.Information = "The file or folder wasn't deleted.";
            }
        }
        /// <summary>
        /// Command for reading a text file.
        /// </summary>
        async void ExecuteReadTextFileCommandAsync()
        {
            object[] results;

            bool isSuccess = false;
            results = await _fileOperations.ReadTextFileAsync(_selectedFileObject);
            FileText = results[0].ToString();
            isSuccess = (bool)results[1];

            if (isSuccess)
            {
                LoggingViewModel.Instance.Information = "You successfully read the text file!";
            }
            else
            {
                LoggingViewModel.Instance.Information = "We couldn't return the text file. Please select a text file and try again.";
            }
        }
        /// <summary>
        /// Command for updating a file.
        /// </summary>
        async void ExecuteUpdateCommandAsync()
        {

            if (FileText == null || FileText == string.Empty)
            {
                LoggingViewModel.Instance.Information = "You need to choose a text file, add some text in the text box, and then click Update.";
            }

            else if (!SelectedFile.Name.EndsWith(".txt") && !SelectedFile.Name.EndsWith(".xml"))
            {

                LoggingViewModel.Instance.Information = "You need to choose a text (.txt) file, or an xml (.xml) file, to update.";
            }

            else
            {

                bool isSuccess = await _fileOperations.UpdateTextFileAsync(_selectedFileObject, FileText);

                if (isSuccess)
                {
                    LoggingViewModel.Instance.Information = "You successfully updated the text file.";
                }
                else
                {
                    LoggingViewModel.Instance.Information = "You didn't select a text file or the text file wasn't updated.";
                }

            }
        }
        /// <summary>
        /// Command for downloading and viewing a file.
        /// </summary>
        async void ExecuteDownloadFileCommandAsync()
        {
            StorageFile destinationFile = null;

            if (_selectedFileObject.FileSystemItem is Folder)
            {
                LoggingViewModel.Instance.Information = String.Format("The item '{0}' is a folder and therefore can't be downloaded.", _selectedFileObject.Name);
                return;
            }

            using (var downloadStream = await _fileOperations.DownloadFileAsync(_selectedFileObject))
            {

                // Create the picker object and set options
                FileSavePicker picker = new FileSavePicker();
                picker.SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.DocumentsLibrary;

                // Dropdown of file types the user can save the file as
                picker.FileTypeChoices.Add("Text", new List<string>() { ".txt" });
                picker.FileTypeChoices.Add("Word document", new List<string>() { ".docx" });
                picker.FileTypeChoices.Add("Excel workbook", new List<string>() { ".xlsx" });
                picker.FileTypeChoices.Add("Powerpoint", new List<string>() { ".pptx" });
                picker.FileTypeChoices.Add("XML", new List<string>() { ".xml" });
                picker.FileTypeChoices.Add("JPEG", new List<string>() { ".jpg" });
                picker.FileTypeChoices.Add("PNG", new List<string>() { ".png" });
                picker.FileTypeChoices.Add("PDF", new List<string>() { ".pdf" });

                // Default file name if the user does not type one in or select a file to replace
                picker.SuggestedFileName = _selectedFileObject.Name;

                destinationFile = await picker.PickSaveFileAsync();

                if (destinationFile != null && downloadStream != null)
                {

                    CachedFileManager.DeferUpdates(destinationFile);

                    using (Stream destinationStream = await destinationFile.OpenStreamForWriteAsync())
                    {
                        int count = 0;
                        do
                        {
                            var buffer = new byte[2048];
                            count = downloadStream.Read(buffer, 0, 2048);
                            await destinationStream.WriteAsync(buffer, 0, count);
                        }
                        while (downloadStream.CanRead && count > 0);

                        await destinationStream.FlushAsync();
                    }

                }
            }

            if (destinationFile != null)
            {
                var viewFile =  await MessageDialogHelper.ShowYesNoDialogAsync(
                               String.Format("Your file was downloaded to {0}\nWould you like to open the file?",destinationFile.Path), "Download Succeeded");

                if (viewFile)
                {
                    // Launch the selected app so the user can see the file contents.

                    // Let the user choose which app to use.
                    var options = new Windows.System.LauncherOptions();
                    options.DisplayApplicationPicker = true;

                    var success = await Windows.System.Launcher.LaunchFileAsync(destinationFile, options);
                    if (!success)
                    {
                        LoggingViewModel.Instance.Information = "We couldn't launch an app to view the file.";
                    }
                }
            }
            else
            {
                LoggingViewModel.Instance.Information = "The file wasn't downloaded.";

            }
        }
        /// <summary>
        /// Command to upload a file. 
        /// </summary>
        async void ExecuteUploadFileCommandAsync()
        {
            bool isSuccess = await _fileOperations.UploadFileAsync();

            if (isSuccess)
            {
                await LoadFilesAndFoldersAsync();
                LoggingViewModel.Instance.Information = "You successfully uploaded the file.";
            }
            else
            {
                LoggingViewModel.Instance.Information = "The file wasn't uploaded or you pressed the cancel button.";
            }
        }
        #endregion
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