using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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

namespace O365Universal
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page, IWebAuthenticationContinuable
    {
        //implement a timer for login...this is a hack to avoid a threading issue with the webauthenticationbroker in the loaded event
        DispatcherTimer loginTimer = null;
        void MainPage_Loaded(object sender, RoutedEventArgs e)
        {
            if (loginTimer == null)
            {
                loginTimer = new DispatcherTimer();
                loginTimer.Interval = new TimeSpan(0, 0, 0);
                loginTimer.Tick += loginTimer_Tick;
                loginTimer.Start();
            }
        }

        async void loginTimer_Tick(object sender, object e)
        {
            loginTimer.Stop();
            controller = new MyFilesController();
            var x = await controller.EnsureClientCreated();
            (App.Current as App).Items = await controller.GetMyImages();
            this.DataContext = (App.Current as App).Items;
            waiting.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
        }

        public async void ContinueWebAuthentication(Windows.ApplicationModel.Activation.WebAuthenticationBrokerContinuationEventArgs args)
        {
            await controller.AuthContext.ContinueAcquireTokenAsync(args);
        }
    }
}
