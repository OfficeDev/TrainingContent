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
        }
    }
}
