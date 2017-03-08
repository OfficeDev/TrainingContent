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
	public partial class FilesPage : ContentPage
	{
        public class FileViewModel
        {
            public string Name { get; set; }
            public string LastModifiedDateTime { get; set; }
        }
        ObservableCollection<FileViewModel> fileModelList = new ObservableCollection<FileViewModel>();
        private string contactEmail = string.Empty;
        public FilesPage (string email)
		{
            InitializeComponent();
            var template = new DataTemplate(typeof(TextCell));
            template.SetValue(TextCell.TextColorProperty, Color.White);
            template.SetBinding(TextCell.TextProperty, "Name");
            template.SetBinding(TextCell.DetailProperty, "LastModifiedDateTime");

            this.filesListView.ItemsSource = fileModelList;
            this.filesListView.ItemTemplate = template;
            this.contactEmail = email;
            this.Title = "Files Page";
        }
        protected async override void OnAppearing()
        {
            base.OnAppearing();
        }
    }
}
