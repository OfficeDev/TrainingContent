// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

using Office365StarterProject.Common;
using Office365StarterProject.Helpers;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Threading.Tasks;
using System.Windows.Input;

namespace Office365StarterProject.ViewModels
{
    /// <summary>
    /// Contains the calendar view model.
    /// </summary>
    public class CalendarViewModel : ViewModelBase
    {
        private bool _loadingCalendarEvents = false;

        CalendarOperations _calendarOperations = new CalendarOperations();
        public bool LoadingCalendarEvents
        {
            get
            {
                return _loadingCalendarEvents;
            }
            set
            {
                SetProperty(ref _loadingCalendarEvents, value);
            }
        }

        /// <summary>
        /// The EventModel class object that enapsulates an event.
        /// </summary>
        private EventViewModel _selectedEvent = null;

        /// <summary>
        /// Sets or gets the selected EventViewModel from the calendar list in a UI
        /// Updates event view model fields bound to event field properties exposed in this model
        /// </summary>
        public EventViewModel SelectedEvent
        {
            get
            {
                return _selectedEvent;
            }
            set
            {
                if (SetProperty(ref _selectedEvent, value))
                {
                    ((RelayCommand)this.DeleteEventCommand).RaiseCanExecuteChanged();
                    ((RelayCommand)this.CancelEventChangesCommand).RaiseCanExecuteChanged();
                    if (_selectedEvent != null)
                    {
                        _selectedEvent.PropertyChanged += _selectedEvent_PropertyChanged;
                    }
                }
            }
        }


        void _selectedEvent_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "IsNewOrDirty")
            {
                ((RelayCommand)this.CancelEventChangesCommand).RaiseCanExecuteChanged();
            }
        }

        /// <summary>
        /// The user calendar events to be shown on a bound UI list
        /// </summary>
        public ObservableCollection<EventViewModel> Events { get; private set; }

        /// <summary>
        /// Clears the public selected event properties that are bound to a consuming UI
        /// </summary>
        public ICommand NewEventCommand { protected set; get; }

        /// <summary>
        /// Get a calendar event from the user's calendar
        /// </summary>
        public ICommand GetCalendarEventsCommand { protected set; get; }


        /// <summary>
        /// Remove a calendar event
        /// </summary>
        public ICommand DeleteEventCommand { protected set; get; }

        /// <summary>
        /// Cancel pending changes to a calendar event
        /// </summary>
        public ICommand CancelEventChangesCommand { protected set; get; }

        /// <summary>
        /// Takes an ExchangeClient object for an authenticated user
        /// </summary>
        /// <param name="client">ExcangeClient client</param>
        public CalendarViewModel()
        {
            this.Events = new ObservableCollection<EventViewModel>();

            //construct relay commands to be bound to controls on a UI
            this.NewEventCommand = new RelayCommand(ExecuteNewEventCommandAsync);
            this.GetCalendarEventsCommand = new RelayCommand(ExecuteGetCalendarEventsCommandAsync);
            this.DeleteEventCommand = new RelayCommand(ExecuteDeleteCommandAsync,CanDeleteEvent);
            this.CancelEventChangesCommand = new RelayCommand(ExecuteCancelEventChangesCommand, CanCancelEventChanges);
        }

        /// <summary>
        /// Loads today's calendar event items for the user
        /// </summary>
        /// <returns></returns>
        public async Task<bool> LoadCalendarAsync()
        {
            LoggingViewModel.Instance.Information = "Getting your calendar events ...";
            try
            {
                //Clear out any calendar events added in previous calls to LoadCalendarAsync()
                if (Events != null)
                    Events.Clear();
                else
                    Events = new ObservableCollection<EventViewModel>();

                // Get calendar events
                List<EventViewModel> events = await _calendarOperations.GetCalendarEventsAsync();

                if (events.Count == 0)
                {
                    LoggingViewModel.Instance.Information = "You have no calendar events.";
                }
                else
                {
                    //Load events into the observable collection that is bound to UI
                    foreach (EventViewModel calendarEvent in events)
                    {
                        Events.Add(calendarEvent);
                    }
                    LoggingViewModel.Instance.Information = String.Format("{0} calendar events loaded", Events.Count);
                }
            }
            catch (Exception ex)
            {
                LoggingViewModel.Instance.Information = "Error loading calendar: " + ex.Message;
                return false;
            }
            return true;
        }

        private bool CanDeleteEvent()
        {
            return (this.SelectedEvent != null);
        }

        private bool CanCancelEventChanges()
        {
            return (this.SelectedEvent != null && this.SelectedEvent.IsNewOrDirty);
        }

        /// <summary>
        /// Cancels any event changes that the user has applied locally.
        /// </summary>
        void ExecuteCancelEventChangesCommand()
        {
            if (this.SelectedEvent != null)
            {
                if (this.SelectedEvent.IsNew)
                {
                    this.Events.Remove(this.SelectedEvent);
                }
                else
                {
                    this.SelectedEvent.Reset();
                }
            }

        }

        /// <summary>
        /// Creates a new event and adds it to the collection. 
        /// </summary>
        /// <remarks>The event is created locally.</remarks>
        async void ExecuteNewEventCommandAsync()
        {
            var aadClient = await AuthenticationHelper.EnsureGraphClientCreatedAsync();

            var currentUser = await (aadClient.Users
                .Where(i => i.ObjectId == AuthenticationHelper.LoggedInUser)
                .ExecuteSingleAsync());
            var newEvent = new EventViewModel(currentUser.Mail);
            this.Events.Add(newEvent);
            this.SelectedEvent = newEvent;
            LoggingViewModel.Instance.Information = "Click the Update Event button and we'll save the new event to your calendar";

        }

        /// <summary>
        /// Reloads the user's calendar with the newest calendar events
        /// </summary>
        async void ExecuteGetCalendarEventsCommandAsync()
        {
            
            this.LoadingCalendarEvents = true;
            //Reload the user's calendar
            await this.LoadCalendarAsync();
            this.LoadingCalendarEvents = false;
        }
        

        /// <summary>
        /// Sends event remove request to Exchange service
        /// </summary>
        async void ExecuteDeleteCommandAsync()
        {
            if (await MessageDialogHelper.ShowYesNoDialogAsync(String.Format("Are you sure you want to delete the event '{0}'?", this._selectedEvent.DisplayString), "Confirm Deletion"))
            {
                if (!String.IsNullOrEmpty(this._selectedEvent.Id))
                {
                    var success = await _calendarOperations.DeleteCalendarEventAsync(this._selectedEvent.Id);
                    if (success)
                    {
                        //Removes event from bound observable collection
                        Events.Remove((EventViewModel)_selectedEvent);
                    }
                }
                    
            }
        }
 
    }
}
//********************************************************* 
// 
//O365-APIs-Start-Windows, https://github.com/OfficeDev/O365-APIs-Start-Windows
//
//Copyright (c) Microsoft Corporation
//All rights reserved. 
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// ""Software""), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// 
//********************************************************* 
