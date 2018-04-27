using System;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Popups;

namespace HubApp2.O365Helpers
{
    internal static class MessageDialogHelper
    {

        internal static async Task<bool> ShowYesNoDialogAsync(string content, string title)
        {
            bool result = false;
            MessageDialog messageDialog = new MessageDialog(content, title);

            messageDialog.Commands.Add(new UICommand(
                "Yes",
                new UICommandInvokedHandler((cmd) => result = true)
                ));
            messageDialog.Commands.Add(new UICommand(
               "No",
               new UICommandInvokedHandler((cmd) => result = false)
               ));

            // Set the command that will be invoked by default 
            messageDialog.DefaultCommandIndex = 0;

            // Set the command to be invoked when escape is pressed 
            messageDialog.CancelCommandIndex = 1;

            await messageDialog.ShowAsync();

            return result;
        }

        internal static async void ShowDialogAsync(string content, string title)
        {
            MessageDialog messageDialog = new MessageDialog(content, title);
            messageDialog.Commands.Add(new UICommand(
               "OK",
               null
               ));

            await messageDialog.ShowAsync();
        }

        #region Exception display helpers
        // Display details of the exception. 
        // We are doing this here to help you, as a developer, understand exactly
        // what exception was received. In a real app, you would
        // handle exceptions within your code and give a more user-friendly behavior.
        internal static void DisplayException(Exception exception)
        {
            var title = "Connected Services configuration failure";
            StringBuilder content = new StringBuilder();
            content.AppendLine("We were unable to connect to Office 365. Here's the exception we received:");
            content.AppendFormat("Exception: {0}\n\n", exception.Message);
            content.AppendLine("Suggestion: Make sure you have added the Connected Services to this project as outlined in the Readme file.");
            MessageDialogHelper.ShowDialogAsync(content.ToString(), title);
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