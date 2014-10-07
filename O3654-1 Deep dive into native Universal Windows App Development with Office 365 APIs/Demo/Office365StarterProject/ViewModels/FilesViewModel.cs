// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

using Microsoft.Office365.SharePoint;
using Office365StarterProject.Common;
using Office365StarterProject.Helpers;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
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
            DirectoryItems.Clear();

            IEnumerable<IFileSystemItem> files = await _fileOperations.GetMyFilesAsync();

            if (files != null)
            {
                foreach (IFileSystemItem file in files)
                {
                    FileSystemItemViewModel _directoryItem = new FileSystemItemViewModel(file);

                    //Adding FileSystemItems to observable collection.
                    DirectoryItems.Add(_directoryItem);
                }

            }
            else
            {
                LoggingViewModel.Instance.Information = "We couldn't get your file and folder list.";
            }

            
        }
        /// <summary>
        /// Command for creating a file.
        /// </summary>
        async void ExecuteCreateCommandAsync()
        {
            bool isSuccess = await _fileOperations.CreateNewTextFileAsync();
            ExecuteGetFileAndFolderListCommandAsync();

            if (isSuccess)
            {
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
            bool deleteFile = await MessageDialogHelper.ShowYesNoDialogAsync("Do you really want to delete this file or folder?", "Delete");

            if (deleteFile == true)
            {
                bool? isSuccess = await _fileOperations.DeleteFileOrFolderAsync(_selectedFileObject);
                ExecuteGetFileAndFolderListCommandAsync();


                if (isSuccess == true)
                {
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
            StorageFile downloadedFile = null;

            if (_selectedFileObject.FileSystemItem is Folder)
            {
                LoggingViewModel.Instance.Information = "We can't download a folder";
                return;
            }

            var stream = await _fileOperations.DownloadFileAsync(_selectedFileObject);

            // Save the file.
            FileSavePicker fsp = new FileSavePicker();
            fsp.SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.DocumentsLibrary;

            fsp.FileTypeChoices.Add("Text", new List<string>() { ".txt" });
            fsp.FileTypeChoices.Add("Word document", new List<string>() { ".docx" });
            fsp.FileTypeChoices.Add("Excel workbook", new List<string>() { ".xslx" });
            fsp.FileTypeChoices.Add("Powerpoint", new List<string>() { ".pptx" });
            fsp.FileTypeChoices.Add("XML", new List<string>() { ".xml" });
            fsp.FileTypeChoices.Add("JPEG", new List<string>() { ".jpg" });
            fsp.FileTypeChoices.Add("PNG", new List<string>() { ".png" });
            fsp.FileTypeChoices.Add("PDF", new List<string>() { ".pdf" });
            fsp.SuggestedFileName = _selectedFileObject.Name;

            StorageFile sFile = await fsp.PickSaveFileAsync();

            if (sFile != null && stream != null)
            {

                CachedFileManager.DeferUpdates(sFile);

                using (Stream s = await sFile.OpenStreamForWriteAsync())
                {
                    int count = 0;
                    do
                    {
                        var buffer = new byte[2048];
                        count = stream.Read(buffer, 0, 2048);
                        await s.WriteAsync(buffer, 0, count);
                    }
                    while (stream.CanRead && count > 0);

                    await s.FlushAsync();
                }

                stream.Dispose();

                downloadedFile = sFile;
            }

            if (downloadedFile != null)
            {
                if (await MessageDialogHelper.ShowYesNoDialogAsync(String.Format("Your file was downloaded to {0}\nWould you like to open the file?",downloadedFile.Path), "Download Succeeded"))
                {
                    // Try to launch the default app for the file, so the user can see it
                    try
                    {
                        // Set the option to show the picker
                        var options = new Windows.System.LauncherOptions();
                        options.DisplayApplicationPicker = true;

                        await Windows.System.Launcher.LaunchFileAsync(downloadedFile, options);
                    }
                    catch (Exception)
                    {
                        // Fail silently
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
            ExecuteGetFileAndFolderListCommandAsync();

            if (isSuccess)
            {
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
