// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

using Microsoft.OData.Core;
using Microsoft.Office365.OutlookServices;
using Office365StarterProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace Office365StarterProject.Helpers
{
    /// <summary>
    /// Contains methods for accessing events in a contact list.
    /// </summary>
    public class ContactsOperations
    {
        /// <summary>
        /// Gets a collection of contacts.
        /// </summary>
        /// <returns>A collection of contact items.</returns>
        public async Task<List<IContact>> GetContactsAsync()
        {

            // Make sure we have a reference to the Exchange client
            var exchangeClient = await AuthenticationHelper.EnsureOutlookClientCreatedAsync();

            // Query contacts
            var contactsResults = await exchangeClient.Me.Contacts.OrderBy(c => c.DisplayName).ExecuteAsync();

            // Return the first page of contacts. 
            return contactsResults.CurrentPage.ToList();

        }

        /// <summary>
        /// Adds a new contact.
        /// </summary>
        internal async Task<string> AddContactItemAsync(
            string fileAs,
            string givenName,
            string surname,
            string jobTitle,
            string email,
            string workPhone,
            string mobilePhone
            )
        {
            string newContactId = string.Empty;

            Contact newContact = new Contact
            {
                FileAs = fileAs,
                GivenName = givenName,
                Surname = surname,
                JobTitle = jobTitle,
                MobilePhone1 = mobilePhone
            };

            newContact.BusinessPhones.Add(workPhone);

            // Note: Setting EmailAddress1 to a null or empty string will throw an exception that
            // states the email address is invalid and the contact cannot be added.
            // Setting EmailAddress1 to a string that does not resemble an email address will not
            // cause an exception to be thrown, but the value is not stored in EmailAddress1.
            if (!string.IsNullOrEmpty(email))
                newContact.EmailAddresses.Add(new EmailAddress() { Address = email, Name = email });

            try
            {
                // Make sure we have a reference to the Exchange client
                var exchangeClient = await AuthenticationHelper.EnsureOutlookClientCreatedAsync();

                // This results in a call to the service.
                await exchangeClient.Me.Contacts.AddContactAsync(newContact);

            }
            catch (Exception e)
            {
                throw new Exception("We could not create your contact: " + e.Message);
            }
            return newContactId;
        }

        /// <summary>
        /// Updates an existing contact.
        /// </summary>
        internal async Task<IContact> UpdateContactItemAsync(string selectedContactId,
            string fileAs,
            string givenName,
            string surname,
            string jobTitle,
            string email,
            string workPhone,
            string mobilePhone
           )
        {
            IContact contactToUpdate = null; 

            try
            {
                // Make sure we have a reference to the Exchange client
                var exchangeClient = await AuthenticationHelper.EnsureOutlookClientCreatedAsync();

                contactToUpdate = await exchangeClient.Me.Contacts[selectedContactId].ExecuteAsync();

                contactToUpdate.FileAs = fileAs;
                contactToUpdate.GivenName = givenName;
                contactToUpdate.Surname = surname;
                contactToUpdate.JobTitle = jobTitle;
                contactToUpdate.BusinessPhones[0] = workPhone;
                contactToUpdate.MobilePhone1 = mobilePhone;

                // Note: Setting EmailAddress1 to a null or empty string will throw an exception that
                // states the email address is invalid and the contact cannot be added.
                // Setting EmailAddress1 to a string that does not resemble an email address will not
                // cause an exception to be thrown, but the value is not stored in EmailAddress1.

                if (!string.IsNullOrEmpty(email))
                {
                    contactToUpdate.EmailAddresses[0].Address = email;
                    contactToUpdate.EmailAddresses[0].Name = email;
                }

                // Update the contact in Exchange
                await contactToUpdate.UpdateAsync();

                // A note about Batch Updating
                // You can save multiple updates on the client and save them all at once (batch) by 
                // implementing the following pattern:
                // 1. Call UpdateAsync(true) for each contact you want to update. Setting the parameter dontSave to true 
                //    means that the updates are registered locally on the client, but won't be posted to the server.
                // 2. Call exchangeClient.Context.SaveChangesAsync() to post all contact updates you have saved locally  
                //    using the preceding UpdateAsync(true) call to the server, i.e., the user's Office 365 contacts list.
            }
            catch(ODataErrorException odataEx)
            {
                // Error with updated image
                Debug.WriteLine(odataEx.Message);
            }

            return contactToUpdate;
        }

        /// <summary>
        /// Removes a contact.
        /// </summary>
        internal async Task<bool> DeleteContactItemAsync(string selectedContactId)
        {
            bool result = false;
            try
            {
                // Make sure we have a reference to the Exchange client
                var exchangeClient = await AuthenticationHelper.EnsureOutlookClientCreatedAsync();

                // Get the contact to be removed from the Exchange service. This results in a call to the service.
                var contactToDelete = await exchangeClient.Me.Contacts[selectedContactId].ExecuteAsync();
                if (contactToDelete != null)
                {
                    await contactToDelete.DeleteAsync();
                    result = true;
                }
            }
            catch (Exception)
            {
                throw new Exception("Your contact was not deleted on the Exchange service");
            }

            return result;
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
