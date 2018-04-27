using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Data.Xml.Dom;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Notifications;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace FlickrSearch
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            string searchTerm = (string)e.Parameter;

            if (string.IsNullOrEmpty(searchTerm.Trim()))
            {
                searchTerm = "flowers";
            }
            SearchFlickr(searchTerm);
        }

        async void SearchFlickr(string searchTerm)
        {
            List<FlickrPhotoResult> results = await FlickrSearcher.SearchAsync(searchTerm);

            this.DataContext = results;

            UpdateTile(results.Take(5));
            SendToast(results.First());
        }

        void UpdateTile(IEnumerable<FlickrPhotoResult> results)
        {
            TileUpdater tileUpdater = TileUpdateManager.CreateTileUpdaterForApplication();

            tileUpdater.EnableNotificationQueue(true);

            foreach (FlickrPhotoResult result in results)
            {
                XmlDocument xmlTileContent = TileUpdateManager.GetTemplateContent(
                  TileTemplateType.TileWide310x150ImageAndText01);

                TemplateUtility.CompleteTemplate(
                  xmlTileContent,
                  new string[] { result.Title },
                  new string[] { result.ImageUrl });

                TileNotification notification = new TileNotification(xmlTileContent);

                tileUpdater.Update(notification);

            }
        }
        void SendToast(FlickrPhotoResult flickrPhotoResult)
        {
            ToastNotifier toastNotifier = ToastNotificationManager.CreateToastNotifier();

            XmlDocument xmlToastContent = ToastNotificationManager.GetTemplateContent(
              ToastTemplateType.ToastImageAndText01);

            TemplateUtility.CompleteTemplate(
              xmlToastContent,
              new string[] { flickrPhotoResult.Title },
              new string[] { flickrPhotoResult.ImageUrl },
              "ms-winsoundevent:Notification.Mail");

            // TODO: change delivery time
            ScheduledToastNotification toastNotification = new ScheduledToastNotification(xmlToastContent,
              (new DateTimeOffset(DateTime.Now) + TimeSpan.FromSeconds(10)));

            // TODO: change identifier
            toastNotification.Id = "Fred";

            toastNotifier.AddToSchedule(toastNotification);
        }
    }
}
