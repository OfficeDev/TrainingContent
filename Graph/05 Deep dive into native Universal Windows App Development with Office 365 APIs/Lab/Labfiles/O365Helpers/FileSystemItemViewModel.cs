
using System;

namespace HubApp2.ViewModels
{
    /// <summary>
    /// Contains the files that are used in the view model.
    /// </summary>
    public class FileSystemItemViewModel
    {
        private string _name;
        private string _folder;
        private string _id;
        private string _lastModifiedBy;
        private DateTimeOffset _lastModifiedDateTime;
        public string Folder
        {
            get { return _folder; }
            set { _folder = value; }
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
                if (!string.IsNullOrEmpty(Folder))
                {
                    return _name + " (folder)";
                }
                else {
                    return _name;
                }
            }
        }
        public DateTimeOffset LastModifiedDateTime
        {
            get { return _lastModifiedDateTime; }
            set { _lastModifiedDateTime = value; }
        }
        public string LastModifiedBy
        {
            get { return _lastModifiedBy; }
            set { _lastModifiedBy = value; }
        }

        public string LastModified
        {
            get
            {
                return String.Format("Last modified by {0} on {1:d}",
                                    LastModifiedBy,
                                    LastModifiedDateTime);
            }
        }
        public string Id
        {
            get { return _id; }
            set { _id = value; }
        }
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        public override string ToString()
        {
            return _name;
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