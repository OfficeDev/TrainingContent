// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

using Office365StarterProject.Common;
using Office365StarterProject.Helpers;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Threading.Tasks;
using System.Windows.Input;
using Windows.Storage;
using Windows.Storage.Pickers;
using Windows.Storage.Streams;

namespace Office365StarterProject.ViewModels
{
    /// <summary>
    /// Contains the calendar view model.
    /// </summary>
    class ContactsViewModel : ViewModelBase
    {
        private ContactsOperations _contactsOperations = null;

        public ContactsViewModel()
        {
            // Instantiate a private instance of the contacts operations object
            _contactsOperations = new ContactsOperations();

            this.Contacts = new ObservableCollection<ContactItemViewModel>();

            //construct relay commands to be bound to controls on a UI
            this.NewContactCommand = new RelayCommand(ExecuteNewContactCommand);
            this.GetContactsCommand = new RelayCommand(ExecuteGetContactsCommandAsync);
            this.DeleteContactCommand = new RelayCommand(ExecuteDeleteCommandAsync, CanDeleteContact);
            this.CancelContactChangesCommand = new RelayCommand(ExecuteCancelContactChangesCommand, CanCancelContactChanges);
        }

        /// <summary>
        /// The user contacts to be shown on a bound UI list
        /// </summary>
        public ObservableCollection<ContactItemViewModel> Contacts { get; private set; }

        /// <summary>
        /// Command to instantiate a new contact locally.
        /// </summary>
        public ICommand NewContactCommand { protected set; get; }

        /// <summary>
        /// Command to get the user's contacts.
        /// </summary>
        public ICommand GetContactsCommand { protected set; get; }


        /// <summary>
        /// Command to delete a contact.
        /// </summary>
        public ICommand DeleteContactCommand { protected set; get; }

        /// <summary>
        /// Cancel pending changes to a contact
        /// </summary>
        public ICommand CancelContactChangesCommand { protected set; get; }
        
        private bool _loadingContacts = false;   
        /// <summary>
        /// Gets or sets whether we are in the process of loading contact data.
        /// </summary>
        public bool LoadingContacts
        {
            get
            {
                return _loadingContacts;
            }
            private set
            {
                SetProperty(ref _loadingContacts, value);
            }
        }

        private ContactItemViewModel _selectedContact = null;

        /// <summary>
        /// Sets or gets the selected ContactViewModel from the contact list in a UI.
        /// Updates contact view model fields bound to contact field properties exposed in this model.
        /// </summary>
        public ContactItemViewModel SelectedContact
        {
            get
            {
                return _selectedContact;
            }
            set
            {
                if(SetProperty(ref _selectedContact,value))
                {
                    // Enable and disable commands depending on whether a contact has been selected.
                    ((RelayCommand)this.DeleteContactCommand).RaiseCanExecuteChanged();
                    ((RelayCommand)this.CancelContactChangesCommand).RaiseCanExecuteChanged();
                    if(_selectedContact!=null)
                    {
                        _selectedContact.PropertyChanged += _selectedContact_PropertyChanged;
                    }
                }
            }
        }

        void _selectedContact_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if(e.PropertyName=="IsNewOrDirty")
            {
                ((RelayCommand)this.CancelContactChangesCommand).RaiseCanExecuteChanged();
            }
        }

        private bool CanDeleteContact()
        {
            return (this.SelectedContact != null);
        }

        private bool CanCancelContactChanges()
        {
            return (this.SelectedContact != null && this.SelectedContact.IsNewOrDirty);
        }

        private bool CanUpdateContactImage()
        {
            return (this.SelectedContact != null);
        }

        /// <summary>
        /// Cancels any contact changes that the user has applied locally.
        /// </summary>
        void ExecuteCancelContactChangesCommand()
        {
            if (this.SelectedContact != null)
            {
                if (this.SelectedContact.IsNew)
                {
                    this.Contacts.Remove(this.SelectedContact);
                }
                else
                {
                    this.SelectedContact.Reset();
                }
            }

        }

        /// <summary>
        /// Creates a new contact and adds it to the collection. 
        /// </summary>
        /// <remarks>The contact is created locally.</remarks>
        void ExecuteNewContactCommand()
        {
            var newContact = new ContactItemViewModel();
            this.Contacts.Add(newContact);
            this.SelectedContact = newContact;
            LoggingViewModel.Instance.Information = "Click the Update Contact button and we'll save the new contact.";
        }

        /// <summary>
        /// Gets the user's contacts from the Exchange service.
        /// </summary>
        async void ExecuteGetContactsCommandAsync()
        {
            this.LoadingContacts = true;
            await this.LoadContactsAsync();
            this.LoadingContacts = false;
        }

        private async Task<bool> LoadContactsAsync()
        {
            LoggingViewModel.Instance.Information = string.Empty;
            try
            {
                //Clear out any contacts added in previous calls to LoadContactsAsync()
                if (Contacts != null)
                    Contacts.Clear();
                else
                    Contacts = new ObservableCollection<ContactItemViewModel>();

                LoggingViewModel.Instance.Information = "Getting contacts ...";

                //Get contacts from Exchange service via API.
                var contacts = await _contactsOperations.GetContactsAsync();

                if (contacts.Count == 0)
                {
                    LoggingViewModel.Instance.Information = "You have no contacts.";
                }
                else
                {
                    // Load contacts into the observable collection that is bound to UI
                    foreach (var contact in contacts)
                    {
                        Contacts.Add(new ContactItemViewModel(contact));
                    }

                    LoggingViewModel.Instance.Information = String.Format("{0} contacts loaded.", Contacts.Count);
                }
            }
            catch (Exception ex)
            {
                LoggingViewModel.Instance.Information = "Error loading contacts: " + ex.Message;
                return false;
            }
            return true;
        }
        

        /// <summary>
        /// Sends contact remove request to the Exchange service.
        /// </summary>
        async void ExecuteDeleteCommandAsync()
        {
            try
            {
                if (await MessageDialogHelper.ShowYesNoDialogAsync(String.Format("Are you sure you want to delete the contact '{0}'?", this._selectedContact.DisplayString), "Confirm Deletion"))
                {
                    if (!String.IsNullOrEmpty(this._selectedContact.Id))
                    {
                        if( await _contactsOperations.DeleteContactItemAsync(this._selectedContact.Id))
                            //Removes contact from bound observable collection
                            Contacts.Remove((ContactItemViewModel)_selectedContact);

                    }
                    
                }
            }
            catch (Exception)
            {
                LoggingViewModel.Instance.Information = "We could not delete your contact.";
            }           
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
