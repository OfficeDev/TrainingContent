using CacheModeDemo.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace CacheModeDemo
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class Page2 : Page
    {
        private NavigationHelper navigationHelper;

        /// <summary>
        /// NavigationHelper is used on each page to aid in navigation and 
        /// process lifetime management
        /// </summary>
        public NavigationHelper NavigationHelper
        {
            get { return this.navigationHelper; }
        }

        public Page2()
        {
            this.InitializeComponent();

            System.Diagnostics.Debug.WriteLine("Created new instance of Page2");

            this.NavigationCacheMode = NavigationCacheMode.Required;

            this.navigationHelper = new NavigationHelper(this);
            this.navigationHelper.LoadState += navigationHelper_LoadState;
            this.navigationHelper.SaveState += navigationHelper_SaveState;
        }

        void navigationHelper_SaveState(object sender, SaveStateEventArgs e)
        {
            e.PageState.Clear();

            e.PageState["Value1TextBox"] = Value1TextBox.Text;
            e.PageState["Value2TextBox"] = Value2TextBox.Text;
            if (RadioButton1.IsChecked.HasValue)
            {
                e.PageState["RadioButton1Value"] = RadioButton1.IsChecked.Value ? 1 : 0;
            }
            if (RadioButton2.IsChecked.HasValue)
            {
                e.PageState["RadioButton2Value"] = RadioButton2.IsChecked.Value ? 1 : 0;
            }
            if (RadioButton3.IsChecked.HasValue)
            {
                e.PageState["RadioButton3Value"] = RadioButton3.IsChecked.Value ? 1 : 0;
            }
        }

        void navigationHelper_LoadState(object sender, LoadStateEventArgs e)
        {
            // Check for no saved state (new page navigation)
            if (e.PageState == null)
                return;

            object value;
            if (e.PageState.TryGetValue("Value1TextBox", out value))
            {
                Value1TextBox.Text = e.PageState["Value1TextBox"] as string;
            }
            if (e.PageState.TryGetValue("Value2TextBox", out value))
            {
                Value2TextBox.Text = e.PageState["Value2TextBox"] as string;
            }
            if (e.PageState.TryGetValue("RadioButton1Value", out value))
            {
                RadioButton1.IsChecked = (int)(e.PageState["RadioButton1Value"]) == 1 ? true : false;
            }
            else
                RadioButton1.IsChecked = null;
            if (e.PageState.TryGetValue("RadioButton2Value", out value))
            {
                RadioButton2.IsChecked = (int)(e.PageState["RadioButton2Value"]) == 1 ? true : false;
            }
            else
                RadioButton2.IsChecked = null;
            if (e.PageState.TryGetValue("RadioButton3Value", out value))
            {
                RadioButton3.IsChecked = (int)(e.PageState["RadioButton3Value"]) == 1 ? true : false;
            }
            else
                RadioButton3.IsChecked = null;
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            this.NavigationHelper.OnNavigatedTo(e);

            System.Diagnostics.Debug.WriteLine("Page2 instance hashcode: " + ((object)this).GetHashCode());
        }

        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            this.NavigationHelper.OnNavigatedFrom(e);
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(Page3));
        }
    }
}
