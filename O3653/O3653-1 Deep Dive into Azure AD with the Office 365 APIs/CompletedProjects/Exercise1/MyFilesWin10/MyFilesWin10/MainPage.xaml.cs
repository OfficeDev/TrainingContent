using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Data.Json;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace MyFilesWin10
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        #region Private Fields and Constants

        private readonly Brush SuccessBrush = new SolidColorBrush(Colors.Green);
        private readonly Brush ErrorBrush = new SolidColorBrush(Colors.Red);

        private Dictionary<string, string> m_settings;
        #endregion
        public MainPage()
        {
            this.InitializeComponent();
        }

        #region Get Token for Target Service
        private async void TokenButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Get access token for the target service

                return;
            }
            catch (Exception ex)
            {
                this.Status.Text += "Exception caught: '" + ex.Message + "'.";
                this.Status.Foreground = ErrorBrush;
            }
        }
        #endregion

        #region Get Files
        private async void FilesButton_Click(object sender, RoutedEventArgs e)
        {
            this.Status.Text += "==============================\n";

            try
            {
                var json = await GetFilesAsJsonAsync();
                ParseJson(json);
            }
            catch (Exception ex)
            {
                this.Status.Text += "Exception caught: '" + ex.Message + "'.";
                this.Status.Foreground = ErrorBrush;
            }
        }

        private async Task<JsonObject> GetFilesAsJsonAsync()
        {
            try
            {
                //get my files

                return null;
            }
            catch (Exception ex)
            {
                this.Status.Text += "Exception caught: '" + ex.Message + "'.";
                this.Status.Foreground = ErrorBrush;
                return null;
            }
        }

        private void ParseJson(JsonObject json)
        {
            if (json == null)
                return;
            // The JSON responses from SkyDrive and SkyDrive Pro are slightly different
            JsonArray files = json["value"].GetArray();
            string name = "name";

            // Traverse the files JsonArray and show the item names 
            foreach (var file in files)
            {
                var nameValue = file.GetObject()[name].GetString();
                this.Status.Text += string.Format("'{0}'\n", nameValue);
            }
        }
        #endregion
    }
}
