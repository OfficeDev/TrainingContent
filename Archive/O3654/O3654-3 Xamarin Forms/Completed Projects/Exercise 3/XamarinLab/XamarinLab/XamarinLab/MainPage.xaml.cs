using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;

namespace XamarinLab
{
	public partial class MainPage : ContentPage
	{
		public MainPage ()
		{
			InitializeComponent ();

            var template = new DataTemplate(typeof(TextCell));
            template.SetValue(TextCell.TextColorProperty, Color.White);
            template.SetBinding(TextCell.TextProperty, ".");

            this.mainListView.ItemTemplate = template;
            this.BindingContext = new[] { "Contacts", "Send Email" };

            this.Title = "Main Page";
        }
        private async void OnItemTapped(object sender, ItemTappedEventArgs e)
        {
            if (e == null) return;
            if (e.Item.ToString().Equals("Contacts"))
            {
                await Navigation.PushAsync(new ContactsPage());
            }
            else {
                await Navigation.PushAsync(new MailPage());
            }
        }
    }
}
