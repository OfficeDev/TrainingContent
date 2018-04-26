using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;
using XamarinLab.Helper;
using Microsoft.Identity.Client;
using Microsoft.Graph;


namespace XamarinLab
{
	public partial class MailPage : ContentPage
	{
		public MailPage ()
		{
			InitializeComponent ();
            this.sendButton.Clicked += SendButton_Clicked;
        }
        private async void SendButton_Clicked(object sender, EventArgs e)
        {
            try
            {
                if (this.emailAdressEntry.Text.Length > 0)
                {
                    using (var scope = new ActivityIndicatorScope(activityIndicator, activityIndicatorPanel, true))
                    {
                        var graphClient = AuthenticationHelper.GetGraphServiceClient();
                        var newMessage = new Message { Subject = this.subjectEntry.Text };
                        var email = new EmailAddress
                        {
                            Name = this.emailAdressEntry.Text,
                            Address = this.emailAdressEntry.Text
                        };
                        var tolist = new List<Recipient>();
                        tolist.Add(new Recipient { EmailAddress = email });
                        newMessage.ToRecipients = tolist;
                        newMessage.Subject = this.subjectEntry.Text;
                        newMessage.Body = new ItemBody
                        {
                            ContentType = BodyType.Text,
                            Content = this.bodyEntry.Text
                        };
                        await graphClient.Me.SendMail(newMessage, true).Request().PostAsync();
                        await DisplayAlert("Success", "Send mail successfully.", "Ok");
                    }
                }
            }
            catch (Exception ex)
            {
                await DisplayAlert("Error", "Sign On failed", "Ok");
            }
        }
    }
}
