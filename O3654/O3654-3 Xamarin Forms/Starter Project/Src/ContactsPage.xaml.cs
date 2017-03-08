using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.ObjectModel;
using Xamarin.Forms;
using Microsoft.Graph;
using XamarinLab.Helper;

namespace XamarinLab
{
    public class CantactViewModel {
        public string Id { get; set;}
        public string DisplayName { get; set; }
        public string EmailAddress { get; set; }
    }

	public partial class ContactsPage : ContentPage
	{
        ObservableCollection<CantactViewModel> contactModelList = new ObservableCollection<CantactViewModel>();
        public ContactsPage ()
		{
			InitializeComponent ();
            var template = new DataTemplate(typeof(TextCell));
            template.SetValue(TextCell.TextColorProperty, Color.White);
            template.SetBinding(TextCell.TextProperty, "DisplayName");
            template.SetBinding(TextCell.DetailProperty, "EmailAddress");

            this.contactsListView.ItemsSource = contactModelList;
            this.contactsListView.ItemTemplate = template;
            this.Title = "Contacts Page";
        }
        protected async override void OnAppearing()
        {
            base.OnAppearing();
        }
        void OnItemTapped(object sender, ItemTappedEventArgs e)
        {
            if (e == null) return;

        }

    }
}
