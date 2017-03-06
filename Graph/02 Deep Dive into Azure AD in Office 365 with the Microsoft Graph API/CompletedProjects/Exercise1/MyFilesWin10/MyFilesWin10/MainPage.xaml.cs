using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using System.Net.Http.Headers;
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
using Microsoft.Graph;

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
                var files = await GetFilesAsync();
                foreach (var file in files)
                {
                    this.Status.Text += string.Format("'{0}'\n", file.Name);
                }
            }
            catch (Exception ex)
            {
                this.Status.Text += "Exception caught: '" + ex.Message + "'.";
                this.Status.Foreground = ErrorBrush;
            }
        }

        private async Task<IEnumerable<DriveItem>> GetFilesAsync()
        {
            try
            {
                //get my files

            }
            catch (Exception ex)
            {
                this.Status.Text += "Exception caught: '" + ex.Message + "'.";
                this.Status.Foreground = ErrorBrush;
                return null;
            }
            return null;
        }

        private GraphServiceClient GetGraphServiceClient(string token)
        {
            var authenticationProvider = new DelegateAuthenticationProvider(
                (requestMessage) =>
                {
                    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    return Task.FromResult(0);
                });
            return new GraphServiceClient(authenticationProvider);
        }
        #endregion
    }
}
