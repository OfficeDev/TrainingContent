using HubApp2.O365Helpers;
using System;
using Windows.Globalization.DateTimeFormatting;

namespace HubApp2.ViewModels
{
    /// <summary>
    /// Models a calendar event
    /// </summary>
    public class EventViewModel : ViewModelBase
    {
        public EventViewModel()
        {
        }

        private string _id;
        private string _subject;
        private string _locationDisplayName;
        private bool _isNewOrDirty;
        private DateTimeOffset _start;
        private DateTimeOffset _end;
        private TimeSpan _startTime;
        private TimeSpan _endTime;
        private string _body;
        private string _attendees;
        private string _displayString;

        public string Id
        {
            get { return _id; }
            set { _id = value; }
        }
        public string Subject
        {
            get { return _subject; }
            set
            {
                if (SetProperty(ref _subject, value))
                {
                    IsNewOrDirty = true;
                    UpdateDisplayString();
                }
            }
        }
        public string LocationName
        {
            get { return _locationDisplayName; }
            set
            {
                if (SetProperty(ref _locationDisplayName, value))
                {
                    IsNewOrDirty = true;
                    UpdateDisplayString();
                }

            }
        }
        public DateTimeOffset Start
        {
            get { return _start; }
            set
            {
                if (SetProperty(ref _start, value))
                {
                    IsNewOrDirty = true;
                    UpdateDisplayString();
                }
            }
        }
        public TimeSpan StartTime
        {
            get { return _startTime; }
            set
            {
                if (SetProperty(ref _startTime, value))
                {
                    IsNewOrDirty = true;
                    this.Start = this.Start.Date + _startTime;
                    UpdateDisplayString();
                }
            }
        }
        public DateTimeOffset End
        {
            get { return _end; }
            set
            {
                if (SetProperty(ref _end, value))
                {
                    IsNewOrDirty = true;
                    UpdateDisplayString();
                }
            }
        }
        public TimeSpan EndTime
        {
            get { return _endTime; }
            set
            {
                if (SetProperty(ref _endTime, value))
                {
                    IsNewOrDirty = true;
                    this.End = this.End.Date + _endTime;
                    UpdateDisplayString();
                }
            }
        }
        public string BodyContent
        {
            get { return _body; }
            set
            {
                if (SetProperty(ref _body, value))
                {
                    IsNewOrDirty = true;
                }
            }
        }
        public string Attendees
        {
            get { return _attendees; }
            set
            {
                if (SetProperty(ref _attendees, value))
                {
                    IsNewOrDirty = true;
                }
            }
        }

        public bool IsNewOrDirty
        {
            get { return _isNewOrDirty; }
            set
            {
                if (SetProperty(ref _isNewOrDirty, value))
                {
                    UpdateDisplayString();
                    LoggingViewModel.Instance.Information = "Press the Update Event button and we'll save the changes to your calendar";
                }
            }
        }

        public string DisplayString
        {
            get { return _displayString; }
            set
            {
                SetProperty(ref _displayString, value);
            }
        }

        public void UpdateDisplayString()
        {
            DateTimeFormatter dateFormat = new DateTimeFormatter("month.abbreviated day hour minute");

            var startDate = (this.Start == DateTimeOffset.MinValue) ? string.Empty : dateFormat.Format(this.Start);
            var endDate = (this.End == DateTimeOffset.MinValue) ? string.Empty : dateFormat.Format(this.End);

            DisplayString = String.Format("Subject: {0} Location: {1} Start: {2} End: {3}",
                    Subject,
                    LocationName,
                    startDate,
                    endDate
                    );
            DisplayString = (this.IsNewOrDirty) ? DisplayString + " *" : DisplayString;
        }
    }
}