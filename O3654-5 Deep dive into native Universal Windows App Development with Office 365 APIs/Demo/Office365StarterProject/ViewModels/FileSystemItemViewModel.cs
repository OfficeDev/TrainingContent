// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

using Microsoft.Office365.SharePoint;

namespace Office365StarterProject.ViewModels
{
    /// <summary>
    /// Contains the files that are used in the view model.
    /// </summary>
    public class FileSystemItemViewModel
    {

        private IFileSystemItem _fileSystemItem;
        private string _name;

        public FileSystemItemViewModel(IFileSystemItem fileSystemItem)
        {
            if (fileSystemItem == null)
            {
                throw new System.ArgumentNullException("fileSystemItem");
            }

            _fileSystemItem = fileSystemItem;

            _name = fileSystemItem.Name;
        }

        public IFileSystemItem FileSystemItem
        {
            get
            {
                return _fileSystemItem;
            }
            private set

            { _fileSystemItem = value; }
        }

        /// <summary>
        /// The DisplayName property is the property path used in the 
        /// DisplayMemberPath property in the ListBox control that is
        /// bound to the ViewModel.
        /// </summary>
        public string DisplayName
        {
            get
            {
                if (_fileSystemItem is Folder)
                {
                    return _name + " (folder)";
                }
                else
                {
                    return _name;
                }
            }
        }

        public string Name
        {
            get
            {
                return _name;
            }

            set
            {
                _name = value;
            }
        }

        public override string ToString()
        {
            return _name;
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
