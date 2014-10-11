// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

#if WINDOWS_APP
using Microsoft.Office365.Exchange;

using System;
using System.Text.RegularExpressions;
using HubApp2.O365Helpers;
using HubApp2.Common;

namespace HubApp2.ViewModels
{
	/// <summary>
	/// Models a calendar event
	/// </summary>
	public class EventViewModel : ViewModelBase
	{

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
		private IEvent _serverEventData;
		private string _displayString;
		CalendarOperations _calenderOperations = new CalendarOperations();

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
			get
			{
				return _isNewOrDirty;
			}
			set
			{
				if (SetProperty(ref _isNewOrDirty, value) && SaveChangesCommand != null)
				{
					UpdateDisplayString();
					SaveChangesCommand.RaiseCanExecuteChanged();
				}
			}
		}

		public string DisplayString
		{
			get
			{
				return _displayString;
			}
			set
			{
				SetProperty(ref _displayString, value);
			}
		}

		private void UpdateDisplayString()
		{
			DisplayString = String.Format("From: {1} To: {2} Location: {3}",
							Subject, Start.ToLocalTime().LocalDateTime.ToString(),
							End.ToLocalTime().LocalDateTime.ToString(),
							LocationName);
			DisplayString = (this.IsNewOrDirty) ? DisplayString + " *" : DisplayString;

		}

		public string Id
		{
			set
			{
				_id = value;
			}

			get
			{
				return _id;
			}
		}

		public bool IsNew
		{
			get
			{
				return this._serverEventData == null;
			}
		}

		public void Reset()
		{
			if (!this.IsNew)
			{
				this.initialize(this._serverEventData);
			}
		}


		/// <summary>
		/// Changes a calendar event.
		/// </summary>
		public RelayCommand SaveChangesCommand { get; private set; }

		private bool CanSaveChanges()
		{
			return (this.IsNewOrDirty);
		}

		/// <summary>
		/// Saves changes to a calendar event on the Exchange service and
		/// updates the local collection of calendar events.
		/// </summary>
		public async void ExecuteSaveChangesCommandAsync()
		{
			string operationType = string.Empty;
			try
			{
				if (!String.IsNullOrEmpty(this.Id))
				{
					operationType = "update";
					//Send changes to Exchange
					_serverEventData = await _calenderOperations.UpdateCalendarEventAsync(
							this.Id,
							this.LocationName,
							this.BodyContent,
							this.Attendees,
							this.Subject,
							this.Start,
							this.End,
							this.StartTime,
							this.EndTime);
					this.IsNewOrDirty = false;
				}
				else
				{
					operationType = "save";
					//Add the event
					//Send the add request to Exchange service with new event properties
					this.Id = await _calenderOperations.AddCalendarEventAsync(
							this.LocationName,
							this.BodyContent,
							this.Attendees,
							this.Subject,
							this.Start,
							this.End,
							this.StartTime,
							this.EndTime);
					this.IsNewOrDirty = false;
				}
				//LoggingViewModel.Instance.Information = "Your event is updated in your calendar";
			}
			catch (Exception)
			{
				//LoggingViewModel.Instance.Information = string.Format("We could not {0} your calendar event in your calendar", operationType);
				throw;
			}
		}

		public EventViewModel(string currentUserMail)
		{
			this.Subject = "New Event";
			this.Start = System.DateTime.Now;
			this.End = System.DateTime.Now;
			this.Id = string.Empty;
			this.StartTime = new TimeSpan(System.DateTime.Now.Hour, System.DateTime.Now.Minute, System.DateTime.Now.Second);
			this.EndTime = new TimeSpan(System.DateTime.Now.Hour, System.DateTime.Now.Minute, System.DateTime.Now.Second);

			this.Attendees = currentUserMail;

			this.IsNewOrDirty = true;
			this.SaveChangesCommand = new RelayCommand(ExecuteSaveChangesCommandAsync, CanSaveChanges);

		}


		public EventViewModel(IEvent eventData)
		{
			initialize(eventData);
		}

		private void initialize(IEvent eventData)
		{
			_serverEventData = eventData;
			string bodyContent = string.Empty;
			if (eventData.Body != null)
				bodyContent = _serverEventData.Body.Content;

			_id = _serverEventData.Id;
			_subject = _serverEventData.Subject;
			_locationDisplayName = _serverEventData.Location.DisplayName;
			_start = (DateTimeOffset)_serverEventData.Start;
			_startTime = Start.ToLocalTime().TimeOfDay;
			_end = (DateTimeOffset)_serverEventData.End;
			_endTime = End.ToLocalTime().TimeOfDay;


			//If HTML, take text. Otherwise, use content as is
			string bodyType = _serverEventData.Body.ContentType.ToString();
			if (bodyType == "HTML")
			{
				bodyContent = Regex.Replace(bodyContent, "<[^>]*>", "");
				bodyContent = Regex.Replace(bodyContent, "\n", "");
				bodyContent = Regex.Replace(bodyContent, "\r", "");
			}
			_body = bodyContent;
			_attendees = _calenderOperations.BuildAttendeeList(_serverEventData.Attendees);

			this.IsNewOrDirty = false;

			this.SaveChangesCommand = new RelayCommand(ExecuteSaveChangesCommandAsync, CanSaveChanges);
			UpdateDisplayString();
		}
	}
}

#endif//********************************************************* 
// 
//O365-APIs-Start-Windows, https://github.com/OfficeDev/O365-APIs-Start-Windows
//
//Copyright (c) Microsoft Corporation
//All rights reserved. 
//
//MIT License:
//
//Permission is hereby granted, free of charge, to any person obtaining
//a copy of this software and associated documentation files (the
//""Software""), to deal in the Software without restriction, including
//without limitation the rights to use, copy, modify, merge, publish,
//distribute, sublicense, and/or sell copies of the Software, and to
//permit persons to whom the Software is furnished to do so, subject to
//the following conditions:
//
//The above copyright notice and this permission notice shall be
//included in all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
//LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// 
//********************************************************* 
