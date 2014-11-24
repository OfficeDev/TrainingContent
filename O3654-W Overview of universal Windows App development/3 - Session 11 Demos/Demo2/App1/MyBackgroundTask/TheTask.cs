using FileLibrary;
using mtaulty.Utility;
using System.Collections.Generic;
using Windows.ApplicationModel.Background;
using Windows.Data.Xml.Dom;
using Windows.Devices.Geolocation.Geofencing;
using Windows.UI.Notifications;

namespace MyBackgroundTask
{
    public sealed class TheTask : IBackgroundTask
    {
        public async void Run(IBackgroundTaskInstance taskInstance)
        {
            var deferral = taskInstance.GetDeferral();

            IReadOnlyList<GeofenceStateChangeReport> reports = GeofenceMonitor.Current.ReadReports();

            foreach (var report in reports)
            {
                if ((report.NewState != GeofenceState.None) &&
                    (report.NewState != GeofenceState.Removed))
                {
                    await StatusFile.AddStatusEntry(
                        report.Geofence.Id, 
                        report.NewState == GeofenceState.Entered ? EntryType.EnteredZone : EntryType.ExitedZone);
                }
            }

            XmlDocument template = ToastNotificationManager.GetTemplateContent(ToastTemplateType.ToastText01);
            
            NotificationTemplateHelper.CompleteToastOrTileTemplate(
                template,
                new string[] 
                {
                    "One or more of our fences has been crossed"
                },
                null);

            ToastNotifier notifier = ToastNotificationManager.CreateToastNotifier();

            notifier.Show(new ToastNotification(template));

            deferral.Complete();
        }
    }
}
