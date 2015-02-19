// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

using Microsoft.Office365.OutlookServices;
using Office365StarterProject.Common;
using Office365StarterProject.Helpers;
using System;
using System.Text.RegularExpressions;
using Windows.UI.Xaml.Media.Imaging;

namespace Office365StarterProject.ViewModels
{
    /// <summary>
    /// Models a contact item
    /// </summary>
    public class ContactItemViewModel : ViewModelBase
    {
        private string _id;
        private bool _isNewOrDirty;
        private string _displayString;

        private string _contactDisplayName;
        private string _contactFileAs;
        private string _contactFirstName;
        private string _contactLastName;
        private string _contactJobTitle;
        private string _contactEmail;
        private string _contactWorkPhone;
        private string _contactMobilePhone;
        
        private IContact _serverContactData;
        ContactsOperations _contactsOperations = new ContactsOperations();

        public bool IsNewOrDirty
        {
            get
            {
                return _isNewOrDirty;
            }
            set
            {
                if (SetProperty(ref _isNewOrDirty, value) && SaveChangesCommand != null)
                {
                    UpdateDisplayString();
                    LoggingViewModel.Instance.Information = "Press the Update Contact button and we'll save the changes to your contacts";
                    SaveChangesCommand.RaiseCanExecuteChanged();
                }
            }
        }
        public string ContactFileAs
        {
            get
            {
                return _contactFileAs;
            }
            set
            {
                if (SetProperty(ref _contactFileAs, value))
                {
                    IsNewOrDirty = true;
                }
            }
        }
        public string ContactDisplayName
        {
            get
            {
                return _contactDisplayName;
            }
            set
            {
                if (SetProperty(ref _contactDisplayName, value))
                {
                    IsNewOrDirty = true;
                    UpdateDisplayString();
                }
            }
        }
        public string ContactFirstName
        {
            get
            {
                return _contactFirstName;
            }
            set
            {
                if (SetProperty(ref _contactFirstName, value))
                {
                    UpdateContactDisplayName();
                    IsNewOrDirty = true;
                }
            }
        }
        public string ContactLastName
        {
            get
            {
                return _contactLastName;
            }
            set
            {
                if (SetProperty(ref _contactLastName, value))
                {
                    UpdateContactDisplayName();
                    IsNewOrDirty = true;
                }
            }
        }
        public string ContactJobTitle
        {
            get
            {
                return _contactJobTitle;
            }
            set
            {
                if (SetProperty(ref _contactJobTitle, value))
                {
                    IsNewOrDirty = true;
                }
            }
        }
        public string ContactEmail
        {
            get
            {
                return _contactEmail;
            }
            set
            {
                if (SetProperty(ref _contactEmail, value))
                {
                    IsNewOrDirty = true;
                }
            }
        }
        public string ContactWorkPhone
        {
            get
            {
                return _contactWorkPhone;
            }
            set
            {
                if (SetProperty(ref _contactWorkPhone, value))
                {
                    IsNewOrDirty = true;
                }
            }
        }
        public string ContactMobilePhone
        {
            get
            {
                return _contactMobilePhone;
            }
            set
            {
                if (SetProperty(ref _contactMobilePhone, value))
                {
                    IsNewOrDirty = true;
                }
            }
        }
        
        public string DisplayString
        {
            get
            {
                return _displayString;
            }
            set
            {
                SetProperty(ref _displayString, value);
            }
        }
        private void UpdateContactDisplayName()
        {
            this.ContactDisplayName = String.Format("{0} {1}", this.ContactFirstName, this.ContactLastName);
        }

        private void UpdateDisplayString()
        {
            DisplayString = (this.IsNewOrDirty) ? ContactDisplayName + " *" : ContactDisplayName;

        }
        public string Id
        {
            set
            {
                _id = value;
            }

            get
            {
                return _id;
            }
        }

        public bool IsNew
        {
            get
            {
                return this._serverContactData == null;
            }
        }

        public void Reset()
        {
            if (!this.IsNew)
            {
                this.initialize(this._serverContactData);
            }
        }
        /// <summary>
        /// Changes a contact.
        /// </summary>
        public RelayCommand SaveChangesCommand { get; private set; }
        private bool CanSaveChanges()
        {
            return (this.IsNewOrDirty);
        }
        /// <summary>
        /// Saves changes to a contact on the Exchange service and
        /// updates the local collection of contacts.
        /// </summary>
        public async void ExecuteSaveChangesCommandAsync()
        {
            string operationType = string.Empty;
            try
            {
                if (!String.IsNullOrEmpty(this.Id))
                {
                    operationType = "update";
                    //Send changes to Exchange
                    _serverContactData = await _contactsOperations.UpdateContactItemAsync(
                        this.Id,
                        this._contactFileAs,
                        this._contactFirstName,
                        this._contactLastName,
                        this._contactJobTitle,
                        this._contactEmail,
                        this._contactWorkPhone,
                        this._contactMobilePhone
                        );
                    this.IsNewOrDirty = false;
                }
                else
                {
                    operationType = "save";
                    //Add the contact
                    //Send the add request to Exchange service with new contact properties
                    this.Id = await _contactsOperations.AddContactItemAsync(
                        this._contactFileAs,
                        this._contactFirstName,
                        this._contactLastName,
                        this._contactJobTitle,
                        this._contactEmail,
                        this._contactWorkPhone,
                        this._contactMobilePhone
                        );
                    this.IsNewOrDirty = false;
                }
                LoggingViewModel.Instance.Information = "Your contact is updated.";
            }
            catch (Exception ex)
            {
                LoggingViewModel.Instance.Information = string.Format("We could not {0} your contact. Error: {1}", operationType, ex.Message);
            }
        }
        public ContactItemViewModel()
        {
            this.Id = string.Empty;
            
            this._contactDisplayName = "New Contact";
            this._contactFileAs = string.Empty;
            this._contactFirstName = string.Empty;
            this._contactLastName = string.Empty;
            this._contactJobTitle = string.Empty;
            this._contactEmail = string.Empty;
            this._contactWorkPhone = string.Empty;
            this._contactMobilePhone = string.Empty;
            this.SaveChangesCommand = new RelayCommand(ExecuteSaveChangesCommandAsync, CanSaveChanges);
            this.IsNewOrDirty = true;
            

        }
        public ContactItemViewModel(IContact contactData)
        {
            initialize(contactData);
        }
        private void initialize(IContact contactData)
        {
            _serverContactData = contactData;
            _id = _serverContactData.Id;

            _contactDisplayName = TidyValue(_serverContactData.DisplayName);
            _contactFileAs = TidyValue(_serverContactData.FileAs);
            _contactFirstName = TidyValue(_serverContactData.GivenName);
            _contactLastName = TidyValue(_serverContactData.Surname);
            _contactJobTitle = TidyValue(_serverContactData.JobTitle);
            if (_serverContactData.EmailAddresses[0] != null)
                _contactEmail = TidyValue(_serverContactData.EmailAddresses[0].Address);
            _contactWorkPhone = TidyValue(_serverContactData.BusinessPhones[0]);
            _contactMobilePhone = TidyValue(_serverContactData.MobilePhone1);

            this.IsNewOrDirty = false;

            this.SaveChangesCommand = new RelayCommand(ExecuteSaveChangesCommandAsync, CanSaveChanges);
            UpdateDisplayString();
        }

        // Ensures that null strings are converted to empty strings.
        private string TidyValue(string value)
        {
            return (value == null) ? string.Empty : value;
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
