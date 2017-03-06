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