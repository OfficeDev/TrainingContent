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
                else
                {
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