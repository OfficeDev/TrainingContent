using FileLibrary;
using MyBackgroundTask;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Windows.ApplicationModel.Background;
using Windows.Devices.Geolocation;
using Windows.Devices.Geolocation.Geofencing;
using Windows.UI.Core;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace App1
{

    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();
            this.Loaded += OnLoaded;
        }

        async void OnLoaded(object sender, RoutedEventArgs e)
        {
            this.RebuildListOfFences();
            await this.RebuildListOfNotifications();
            this.SyncBackgroundTaskCompletionEvent();
            this.SetVisibility();
        }
        async Task RebuildListOfNotifications()
        {
            string[] fileEntries = await StatusFile.ReadAllStatusEntries();

            this.listNotifications.ItemsSource = fileEntries;
        }
        void SetVisibility()
        {
            bool haveTask = (BackgroundTaskRegistration.AllTasks.Count > 0);

            this.stackRegister.Visibility = haveTask ? Visibility.Collapsed : Visibility.Visible;
            this.stackNotifications.Visibility = haveTask ? Visibility.Visible : Visibility.Collapsed;
        }

        void OnAddGeofence(object sender, RoutedEventArgs e)
        {
            double lat = double.Parse(this.txtLatitude.Text);
            double lon = double.Parse(this.txtLongitude.Text);
            string identifier = this.txtIdentifier.Text;

            Geofence fence = new Geofence(
                identifier,
                  new Geocircle(
                      new BasicGeoposition()
                      {
                          Latitude = lat,
                          Longitude = lon
                      },
                      500),
                  MonitoredGeofenceStates.Entered | MonitoredGeofenceStates.Exited,
                  false,
                  TimeSpan.FromSeconds(5));

            GeofenceMonitor.Current.Geofences.Add(fence);

            RebuildListOfFences();
        }
        void RebuildListOfFences()
        {
            List<string> items = new List<string>();
            foreach (var fence in GeofenceMonitor.Current.Geofences)
            {
                Geocircle circle = (Geocircle)fence.Geoshape;

                items.Add(
                    string.Format("Fence [{0}] at [{1},{2}] radius [{3}km]",
                    fence.Id,
                    circle.Center.Latitude,
                    circle.Center.Longitude,
                    circle.Radius / 1000.0));
            }
            this.listFences.ItemsSource = items;
        }
        async void OnRegisterBackgroundTask(object sender, RoutedEventArgs e)
        {
            BackgroundExecutionManager.RemoveAccess();
            await BackgroundExecutionManager.RequestAccessAsync();

            BackgroundTaskBuilder builder = new BackgroundTaskBuilder();
            builder.Name = "Location Task";
            builder.TaskEntryPoint = typeof(TheTask).FullName;
            builder.SetTrigger(new LocationTrigger(LocationTriggerType.Geofence));
            builder.Register();

            this.SyncBackgroundTaskCompletionEvent();
            this.SetVisibility();
        }
        void SyncBackgroundTaskCompletionEvent()
        {
            IBackgroundTaskRegistration registration =
                BackgroundTaskRegistration.AllTasks.Values.FirstOrDefault();

            if (registration != null)
            {
                registration.Completed += OnBackgroundTaskCompleted;
            }
        }
        void OnBackgroundTaskCompleted(BackgroundTaskRegistration sender, BackgroundTaskCompletedEventArgs args)
        {
            this.Dispatcher.RunAsync(
                CoreDispatcherPriority.Normal,
                () =>
                {
                    this.RebuildListOfNotifications();
                });
        }
    }
}
