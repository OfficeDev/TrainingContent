using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Windows.ApplicationModel.Background;
using Windows.UI.Core;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace App10
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        IBackgroundTaskRegistration taskRegistration;

        public MainPage()
        {
            this.InitializeComponent();
            this.Loaded += OnLoaded;
        }
        void OnLoaded(object sender, RoutedEventArgs e)
        {
            if (this.TaskIsRegistered)
            {
                this.GetTask();
            }
            SetUIVisibility();
        }
        bool TaskIsRegistered
        {
            get
            {
                IReadOnlyDictionary<Guid, IBackgroundTaskRegistration> allTasks = BackgroundTaskRegistration.AllTasks;
                return (allTasks.Count > 0);
            }
        }
        void GetTask()
        {
            this.taskRegistration = BackgroundTaskRegistration.AllTasks.Values.First();
            this.taskRegistration.Completed += OnCompleted;
            this.taskRegistration.Progress += OnProgress;
        }
        void SetUIVisibility()
        {
          this.stackRegistered.Visibility = this.TaskIsRegistered ? Visibility.Visible : Visibility.Collapsed;
          this.stackNotRegistered.Visibility = this.TaskIsRegistered ? Visibility.Collapsed : Visibility.Visible;
          this.UpdateActiveUI();
        }
        async Task UpdateActiveUI()
        {
          this.txtLastRunTime.Text = await MyBackgroundTask.TheTask.ReadLastRunTimeAsync();
        }
        async Task RegisterTask()
        {
            // Rumour of a bug which means you have to call this before calling Request...
            BackgroundExecutionManager.RemoveAccess();

            await BackgroundExecutionManager.RequestAccessAsync();

            BackgroundTaskBuilder taskBuilder = new BackgroundTaskBuilder();
            taskBuilder.Name = "MyBackgroundTask";
            SystemTrigger trigger = new SystemTrigger(SystemTriggerType.TimeZoneChange, false);
            taskBuilder.SetTrigger(trigger);
            taskBuilder.TaskEntryPoint = typeof(MyBackgroundTask.TheTask).FullName;
            taskBuilder.Register();

            this.GetTask();
        }
        void UnregisterTask()
        {
            this.taskRegistration.Completed -= OnCompleted;
            this.taskRegistration.Progress -= OnProgress;
            this.taskRegistration.Unregister(false);
            this.taskRegistration = null;
            BackgroundExecutionManager.RemoveAccess();
        }
        void OnProgress(BackgroundTaskRegistration sender, BackgroundTaskProgressEventArgs args)
        {
            Dispatcher.RunAsync(CoreDispatcherPriority.Normal,
                () =>
                {
                    if (this.mediaElement.Visibility == Visibility.Collapsed)
                    {
                        this.mediaElement.Visibility = Visibility.Visible;
                        this.mediaElement.Play();
                    }
                    this.txtTaskRunning.Text = "Running";
                    this.progressBar.Value = args.Progress;
                });
        }

        void OnCompleted(BackgroundTaskRegistration sender, BackgroundTaskCompletedEventArgs args)
        {
            Dispatcher.RunAsync(CoreDispatcherPriority.Normal,
                () =>
                {
                    this.mediaElement.Visibility = Visibility.Collapsed;
                    this.mediaElement.Stop();
                    this.txtTaskRunning.Text = "Not Running";
                    this.progressBar.Value = 0;
                    this.UpdateActiveUI();
                });
        }

        private async void RegisterButtonClickHandler(object sender, RoutedEventArgs e)
        {
            await this.RegisterTask();
            this.SetUIVisibility();
        }

        async void UnregisterButtonClickHandler(object sender, RoutedEventArgs e)
        {
            this.UnregisterTask();
            await MyBackgroundTask.TheTask.ClearLastRunTimeAsync();
            this.SetUIVisibility();
        }
    }
}
