# Deep Dive into native Universal App Development with Office 365 APIs
In this lab, you will use the Office 365 APIs as part of a Windows Store Universal application. The starter project uses the sample data files that are part of the Hub App project. In this lab, you will extend the application to use the Office 365 API.

## Prerequisites
1. You must have an Office 365 tenant and Windows Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You must have the Office 365 API Tools version 1.1.728 installed in Visual Studio 2013.

## Exercise 1: Configure the starter project and create data
In this exercise, you will configure the starter project to connect to your Office 365 tenant. 

1. Launch **Visual Studio 2013** as an administrator.
2. In Visual Studio, select **File/Open Project**.
3. In the **Open Project** dialog, select **HubApp2.sln** from the **Labs\Starter** folder.
4. Right-click on the **HubApp2.Windows** project and choose **Add.../Connected Service**.
	1. In the **Services Manager** dialog, select Office 365 in the left navigation, anc click **Register your app**.
	2. Sign in to your Office 365 tenant.
    3. Click **Calendar**.
    4. Click **Permissions**.
    5. Check **Read users' calendar**.
    6. Click **Apply**.<br/>
	7. Click **My Files**
	8. Click **Permissions**.
	9. Check **Read users' files**
	10. Click **Apply**.
    11. Click **OK**.<br/>

5. In **Solution Explorer**, delete the files **CalendarApiSample.cs** and **MyFilesApiSample.cs** from the **HubApp2.Windows** project. These files are added as part of the Connected Service, but are not necessary for this application.

## Exercise 2: Add classes to represent the data returned from the Office 365 service.
In this exercise, you will add classes to the project that will "normalize" the various data types from Office 365. These classes mimic the sample data classes from the starter project. This is intentional, since the focus of this module is on the Office 365 operations, not the XAML data binding. 
*Note: The code listed in this lab can be found in the Lab\Labfiles folder.*

1. Add a class to represent a group of items from Office 365:
	1. In **Solution Explorer**, right-click on the **DataModel** folder in the **HubApp2.Shared** project and select **Add/New Item...**
	2. In the **Add New Item** dialog, select **Class** and enter the name **O365DataGroup**.
	3. Replace the template code with the following:

			using System;
			using System.Collections.Generic;
			using System.Collections.ObjectModel;
			using System.Text;
			
			namespace HubApp2.Data
			{
				public class O365DataGroup
				{
					public O365DataGroup(String uniqueId, String title, String subtitle, String imagePath, String description)
					{
						this.UniqueId = uniqueId;
						this.Title = title;
						this.Subtitle = subtitle;
						this.Description = description;
						this.ImagePath = imagePath;
						this.Items = new ObservableCollection<O365DataItem>();
					}
			
					public string UniqueId { get; private set; }
					public string Title { get; private set; }
					public string Subtitle { get; private set; }
					public string Description { get; private set; }
					public string ImagePath { get; private set; }
					public ObservableCollection<O365DataItem> Items { get; private set; }
			
					public override string ToString()
					{
						return this.Title;
					}
				}
			}

2. Add a class to represent items from Office 365:
	1. In **Solution Explorer**, right-click on the **DataModel** folder in the **HubApp2.Shared** project and select **Add/New Item...**
	2. In the **Add New Item** dialog, select **Class** and enter the name **O365DataItem**.
	3. Replace the template code with the following:

			using System;
			using System.Collections.Generic;
			using System.Text;
			
			namespace HubApp2.Data
			{
			    public class O365DataItem
			    {
						public O365DataItem(String uniqueId, String title, String subtitle, String imagePath, String description, String content)
						{
							this.UniqueId = uniqueId;
							this.Title = title;
							this.Subtitle = subtitle;
							this.Description = description;
							this.ImagePath = imagePath;
							this.Content = content;
						}
			
						public string UniqueId { get; private set; }
						public string Title { get; private set; }
						public string Subtitle { get; private set; }
						public string Description { get; private set; }
						public string ImagePath { get; private set; }
						public string Content { get; private set; }
			
						public override string ToString()
						{
							return this.Title;
						}
					}
			}

3. Add a class to serve as the data source for Office 365 data:
	1. In **Solution Explorer**, right-click on the **DataModel** folder in the **HubApp2.Shared** project and select **Add/New Item...**
	2. In the **Add New Item** dialog, select **Class** and enter the name **O365DataSource**.
	3. Replace the template code with the following:

			#if WINDOWS_APP
			using System;
			using System.Collections.Generic;
			using System.Collections.ObjectModel;
			using System.Linq;
			using System.Text;
			using System.Threading.Tasks;
			
			namespace HubApp2.Data
			{
				public sealed class O365DataSource
				{
					private static O365DataSource _dataSource = new O365DataSource();
			
					private ObservableCollection<O365DataGroup> _groups = new ObservableCollection<O365DataGroup>();
					public ObservableCollection<O365DataGroup> Groups
					{
						get { return this._groups; }
					}
			
					public static async Task<IEnumerable<O365DataGroup>> GetGroupsAsync()
					{
						await O365Helpers.AuthenticationHelper.EnsureDiscoveryContextAsync();
						_dataSource.GetO365DataGroups();
			
						await Task.WhenAll(_dataSource.Groups.Select(g => _dataSource.GetGroupItemsAsync(g)));
			
						return _dataSource.Groups;
					}
			
					private void GetO365DataGroups()
					{
						if (this._groups.Count != 0)
						{
							return;
						}
			
						Groups.Add(new O365DataGroup("calendar", "Calendar", "Calendar events", "Assets/event.png",
																					"Events from your Office 365 Calendar"));
						Groups.Add(new O365DataGroup("contacts", "Contacts", "Contacts from the \"People\" page.", "Assets/contact.png",
																					"Contacts from your Office 365 \"My Contacts\""));
						Groups.Add(new O365DataGroup("mail", "Mail", "Messages from your Inbox", "Assets/mail.png",
																					"Messages from your Office 365 Inbox."));
						Groups.Add(new O365DataGroup("files", "Files", "Files from your OneDrive for business", "Assets/files.png",
																					"Files from your OneDrive for Business"));
			
			
						return;
					}
			
					private async Task GetGroupItemsAsync(O365DataGroup group)
					{
						switch (group.UniqueId)
						{
							case "calendar":
								var ops = new O365Helpers.CalendarOperations();
								var events = await ops.GetCalendarEvents();
								foreach (ViewModels.EventViewModel item in events)
								{
									group.Items.Add(new O365DataItem(item.Id, item.Subject, item.LocationName, "Assets/event.png", item.DisplayString, item.BodyContent));
								}
			
								break;
			
							case "contacts":
								break;
							case "mail":
								break;
							case "files":
								var fileOps = new O365Helpers.FileOperations();
								var files = await fileOps.GetMyFilesAsync();
								foreach (var item in files)
								{
									ViewModels.FileSystemItemViewModel vm = new ViewModels.FileSystemItemViewModel(item);
									string lastModified = String.Format("Last modified by {0} on {1:d}",
																					vm.FileSystemItem.LastModifiedBy,
																					vm.FileSystemItem.TimeLastModified);
									group.Items.Add(new O365DataItem(vm.FileSystemItem.Id, vm.Name, lastModified, "Assets/file.png", vm.DisplayName, String.Empty));
								}
								break;
							default:
								break;
						}
			
					}
			
					public static async Task<O365DataGroup> GetGroupAsync(string UniqueId)
					{
						return _dataSource.Groups.FirstOrDefault(g => g.UniqueId.Equals(UniqueId));
					}
			
					public static async Task<O365DataItem> GetItemAsync(string uniqueId)
					{
						O365DataItem result = null;
			
						foreach (O365DataGroup group in _dataSource.Groups)
						{
							result = group.Items.FirstOrDefault(i => i.UniqueId.Equals(uniqueId));
							if (result !=null)
							{
								break;
							}
						}
						return result;
					}
				}
			}
			#endif

# Exercise 3: Add Office 365 Operations to the project
In this exercise, you will add classes to perform the Office 365 operations

1. Add a class to facilitate the authorization to Azure/O365:
	1. In **Solution Explorer**, right-click on the **HubApp2.Shared** project and choose **Add/New Folder**. Name the folder **O365Helpers**.
	2. Right-click on the **O365Helpers** folder in the **HubApp2.Shared** project and select **Add/New Item...**
	2. In the **Add New Item** dialog, select **Class** and enter the name **AuthenticationHelper**.
	3. Replace the template code with the following:

			#if WINDOWS_APP
			using System;
			using System.Threading.Tasks;
			using Microsoft.Office365.SharePoint;
			using Microsoft.Office365.Exchange;
			using Microsoft.Office365.OAuth;
			using Microsoft.IdentityModel.Clients.ActiveDirectory;
			
			namespace HubApp2.O365Helpers
			{
				internal static class AuthenticationHelper
				{
			
					const string ExchangeServiceResourceId = "https://outlook.office365.com";
					static readonly Uri ExchangeServiceEndpointUri = new Uri("https://outlook.office365.com/ews/odata");
					static string _loggedInUser;
					static DiscoveryContext _discoveryContext;
					static internal String LoggedInUser
					{
						get
						{
							return _loggedInUser;
						}
					}
			
					public static async Task EnsureDiscoveryContextAsync()
					{
						try
						{
							if (_discoveryContext == null)
							{
								_discoveryContext = await DiscoveryContext.CreateAsync();
							}
			
							var dcr = await _discoveryContext.DiscoverResourceAsync(ExchangeServiceResourceId);
							_loggedInUser = dcr.UserId;
			
						}
						catch (AuthenticationFailedException ex)
						{
							string errorText = String.Format(
									"{0}, code {1}.  EnsureCalendarClientCreatedAsync - failed",
									ex.ErrorDescription,
									ex.ErrorCode);
							throw;
						}
					}
			
					public static async Task<ExchangeClient> EnsureCalendarClientCreatedAsync()
					{
						try
						{
							if (_discoveryContext == null)
							{
								_discoveryContext = await DiscoveryContext.CreateAsync();
							}
			
							var dcr = await _discoveryContext.DiscoverResourceAsync(ExchangeServiceResourceId);
							_loggedInUser = dcr.UserId;
			
							return new ExchangeClient(ExchangeServiceEndpointUri, async () =>
							{
								return (await _discoveryContext.AuthenticationContext.AcquireTokenSilentAsync(ExchangeServiceResourceId, _discoveryContext.AppIdentity.ClientId, new Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifier(dcr.UserId, Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifierType.UniqueId))).AccessToken;
							});
						}
						catch (AuthenticationFailedException ex)
						{
							string errorText = String.Format(
									"{0}, code {1}.  EnsureCalendarClientCreatedAsync - failed",
									ex.ErrorDescription,
									ex.ErrorCode);
							throw;
						}
			
						return null;
					}
			
					public static async Task<SharePointClient> EnsureSharePointClientCreatedAsync()
					{
						try
						{
							if (_discoveryContext == null)
							{
								_discoveryContext = await DiscoveryContext.CreateAsync();
							}
			
							var dcr = await _discoveryContext.DiscoverCapabilityAsync("MyFiles");
							var serviceEndPointUri = dcr.ServiceEndpointUri;
							var serviceResourceId = dcr.ServiceResourceId;
			
							_loggedInUser = dcr.UserId;
			
							return new SharePointClient(serviceEndPointUri, async () =>
							{
								return (await _discoveryContext.AuthenticationContext.AcquireTokenSilentAsync(serviceResourceId, _discoveryContext.AppIdentity.ClientId, new Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifier(dcr.UserId, Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifierType.UniqueId))).AccessToken;
							});
			
						}
						catch (AuthenticationFailedException ex)
						{
							string errorText = String.Format(
									"{0}, code {1}.  EnsureSharePointClientCreatedAsync - failed",
									ex.ErrorDescription,
									ex.ErrorCode
									);
			
							throw;
						}
			
						return null;
					}
			
					public static async Task SignOutAsync()
					{
						if (string.IsNullOrEmpty(_loggedInUser))
						{
							return;
						}
			
						if (_discoveryContext == null)
						{
							_discoveryContext = await DiscoveryContext.CreateAsync();
						}
			
						await _discoveryContext.LogoutAsync(_loggedInUser);
					}
				}
			}
			#endif

2. Add a base class that implements the INotifyPropertyChanged interface. This interface enables the User Interface updates as data is retrieved through the databinding capabilities of XAML.
	1. Right-click on the **O365Helpers** folder in the **HubApp2.Shared** project and select **Add/New Item...**
	2. In the **Add New Item** dialog, select **Class** and enter the name **ViewModelBase**.
	3. Replace the template code with the following:
			
			using System;
			using System.ComponentModel;
			using System.Runtime.CompilerServices;
			
			namespace HubApp2.ViewModels
			{
				public class ViewModelBase : INotifyPropertyChanged
				{
					protected bool SetProperty<T>(ref T field, T value, [CallerMemberName] string propertyName = "")
					{
						// If the value is the same as the current value, return false to indicate this was a no-op. 
						if (Object.Equals(field, value))
							return false;
			
						// Raise any registered property changed events and indicate to the user that the value was indeed changed.
						field = value;
						NotifyPropertyChanged(propertyName);
						return true;
					}
			
					public event PropertyChangedEventHandler PropertyChanged;
					
					protected void NotifyPropertyChanged([CallerMemberName]string propertyName = "")
					{
						if (PropertyChanged != null)
							PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
					}
				}
			}

3. Add a class to represent the data returned from Calendar operations:
	1. Right-click on the **O365Helpers** folder in the **HubApp2.Shared** project and select **Add/New Item...**
	2. In the **Add New Item** dialog, select **Class** and enter the name **EventViewModel**.
	3. Replace the template code with the following:

			#if WINDOWS_APP
			using Microsoft.Office365.Exchange;
			
			using System;
			using System.Text.RegularExpressions;
			using HubApp2.O365Helpers;
			using HubApp2.Common;
			
			namespace HubApp2.ViewModels
			{
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
						get { return _id; }
						set { _id = value; }
					}
			
					public bool IsNew
					{
						get { return this._serverEventData == null; }
					}
			
					public void Reset()
					{
						if (!this.IsNew) { this.initialize(this._serverEventData); }
					}
			
			
					public RelayCommand SaveChangesCommand { get; private set; }
			
					private bool CanSaveChanges()
					{
						return (this.IsNewOrDirty);
					}
			
					public async void ExecuteSaveChangesCommandAsync()
					{
						// code to update items
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
			
			#endif

4. Add a class to facilitate the Calendar operations:
	2. Right-click on the **O365Helpers** folder in the **HubApp2.Shared** project and select **Add/New Item...**
	2. In the **Add New Item** dialog, select **Class** and enter the name **CalendarOperations**.
	3. Replace the template code with the following:

			#if WINDOWS_APP
			using HubApp2.ViewModels;
			using Microsoft.Office365.Exchange;
			using System;
			using System.Collections.Generic;
			using System.Linq;
			using System.Text;
			using System.Threading.Tasks;
			
			namespace HubApp2.O365Helpers
			{
				internal class CalendarOperations
				{
					internal async Task<IEvent> GetEventDetailsAsync(string SelectedEventId)
					{
						var calendarClient = await AuthenticationHelper.EnsureCalendarClientCreatedAsync();
			
						var thisEventFetcher = calendarClient.Me.Calendar.Events.GetById(SelectedEventId);
						var thisEvent = await thisEventFetcher.ExecuteAsync();
						return thisEvent;
					}
			
					internal async Task<List<EventViewModel>> GetCalendarEvents()
					{
						var calendarClient = await AuthenticationHelper.EnsureCalendarClientCreatedAsync();
			
						List<EventViewModel> returnResults = new List<EventViewModel>();
			
						var eventsResults = await (from i in calendarClient.Me.Events
																			 where i.End >= DateTimeOffset.UtcNow
																			 select i).Take(10).ExecuteAsync();
			
						var events = eventsResults.CurrentPage.OrderBy(e => e.Start);
						foreach (IEvent calendarEvent in events)
						{
							IEvent thisEvent = await GetEventDetailsAsync(calendarEvent.Id);
							EventViewModel calendarEventModel = new EventViewModel(thisEvent);
							returnResults.Add(calendarEventModel);
						}
						return returnResults;
					}
			
					internal async Task<List<EventViewModel>> GetTodaysCalendar(int hoursBefore, int hoursAfter)
					{
						var calendarClient = await AuthenticationHelper.EnsureCalendarClientCreatedAsync();
			
						List<EventViewModel> returnResults = new List<EventViewModel>();
			
						var eventsResults = await (from i in calendarClient.Me.Calendar.Events
																			 where i.Start >= DateTimeOffset.Now.Subtract(new TimeSpan(hoursBefore, 0, 0)) &&
																			 i.Start <= DateTimeOffset.Now.AddHours(hoursAfter)
																			 select i).Take(48).ExecuteAsync();
			
						var events = eventsResults.CurrentPage.OrderBy(e => e.Start);
						foreach (IEvent calendarEvent in events)
						{
							IEvent thisEvent = await GetEventDetailsAsync(calendarEvent.Id);
							EventViewModel calendarEventModel = new EventViewModel(thisEvent);
							returnResults.Add(calendarEventModel);
						}
						return returnResults;
					}
			
					internal async Task<string> AddCalendarEventAsync(string LocationName,
							string BodyContent, string Attendees, string EventName, DateTimeOffset start,
							DateTimeOffset end, TimeSpan startTime, TimeSpan endTime)
					{
						string newEventId = string.Empty;
						Location location = new Location();
						location.DisplayName = LocationName;
						ItemBody body = new ItemBody();
						body.Content = BodyContent;
						body.ContentType = BodyType.Text;
						string[] splitter = { ";" };
						var splitAttendeeString = Attendees.Split(splitter, StringSplitOptions.RemoveEmptyEntries);
						Attendee[] attendees = new Attendee[splitAttendeeString.Length];
						for (int i = 0; i < splitAttendeeString.Length; i++)
						{
							attendees[i] = new Attendee();
							attendees[i].Type = AttendeeType.Required;
							attendees[i].Address = splitAttendeeString[i];
						}
			
						Event newEvent = new Event
						{
							Subject = EventName, Location = location, Attendees = attendees,
							Start = start, End = end, Body = body
						};
						newEvent.Start = (DateTimeOffset?)CalcNewTime(newEvent.Start, start, startTime);
						newEvent.End = (DateTimeOffset?)CalcNewTime(newEvent.End, end, endTime);
			
						try
						{
							var calendarClient = await AuthenticationHelper.EnsureCalendarClientCreatedAsync();
			
							await calendarClient.Me.Events.AddEventAsync(newEvent);
							await ((IEventFetcher)newEvent).ExecuteAsync();
							newEventId = newEvent.Id;
						}
						catch (Exception e)
						{
							throw new Exception("We could not create your calendar event: " + e.Message);
						}
						return newEventId;
					}
			
					internal async Task<IEvent> UpdateCalendarEventAsync(string selectedEventId,
							string LocationName, string BodyContent, string Attendees, string EventName,
							DateTimeOffset start, DateTimeOffset end, TimeSpan startTime, TimeSpan endTime)
					{
						// Make sure we have a reference to the calendar client
						var calendarClient = await AuthenticationHelper.EnsureCalendarClientCreatedAsync();
			
						var thisEventFetcher = calendarClient.Me.Calendar.Events.GetById(selectedEventId);
						IEvent eventToUpdate = await thisEventFetcher.ExecuteAsync();
						eventToUpdate.Attendees.Clear();
						string[] splitter = { ";" };
						var splitAttendeeString = Attendees.Split(splitter, StringSplitOptions.RemoveEmptyEntries);
						Attendee[] attendees = new Attendee[splitAttendeeString.Length];
						for (int i = 0; i < splitAttendeeString.Length; i++)
						{
							Attendee newAttendee = new Attendee();
							newAttendee.Address = splitAttendeeString[i];
							newAttendee.Type = AttendeeType.Required;
							eventToUpdate.Attendees.Add(newAttendee);
						}
			
						eventToUpdate.Subject = EventName;
						Location location = new Location();
						location.DisplayName = LocationName;
						eventToUpdate.Location = location;
						eventToUpdate.Start = (DateTimeOffset?)CalcNewTime(eventToUpdate.Start, start, startTime);
						eventToUpdate.End = (DateTimeOffset?)CalcNewTime(eventToUpdate.End, end, endTime);
						ItemBody body = new ItemBody();
						body.ContentType = BodyType.Text;
						body.Content = BodyContent;
						eventToUpdate.Body = body;
						try
						{
							await eventToUpdate.UpdateAsync(true);
			
							await calendarClient.Context.SaveChangesAsync();
						}
						catch (Exception)
						{
							throw new Exception("Your calendar event was not updated on the Exchange service");
						}
						return eventToUpdate;
					}
			
					internal async Task<IEvent> DeleteCalendarEventAsync(string selectedEventId)
					{
						IEvent thisEvent = null;
						try
						{
							var calendarClient = await AuthenticationHelper.EnsureCalendarClientCreatedAsync();
			
							var thisEventFetcher = calendarClient.Me.Calendar.Events.GetById(selectedEventId);
							thisEvent = await thisEventFetcher.ExecuteAsync();
			
							await thisEvent.DeleteAsync(false);
						}
						catch (Exception)
						{
							throw new Exception("Your calendar event was not deleted on the Exchange service");
						}
						return thisEvent;
					}
			
			
					internal string BuildAttendeeList(IList<Attendee> attendeeList)
					{
						StringBuilder attendeeListBuilder = new StringBuilder();
						foreach (Attendee attendee in attendeeList)
						{
							if (attendeeListBuilder.Length == 0)
							{
								attendeeListBuilder.Append(attendee.Address);
							}
							else
							{
								attendeeListBuilder.Append(";" + attendee.Address);
							}
						}
			
						return attendeeListBuilder.ToString();
					}
			
					internal DateTimeOffset CalcNewTime(DateTimeOffset? OldDate, DateTimeOffset NewDate, TimeSpan newTime)
					{
						DateTimeOffset returnValue = NewDate;
			
						int hour = OldDate.Value.ToLocalTime().TimeOfDay.Hours;
						int min = OldDate.Value.ToLocalTime().TimeOfDay.Minutes;
						int second = OldDate.Value.ToLocalTime().TimeOfDay.Seconds;
			
						int newHour = newTime.Hours;
						int newMin = newTime.Minutes;
						int newSec = newTime.Seconds;
			
						returnValue = returnValue.AddHours(newHour - hour);
						returnValue = returnValue.AddMinutes(newMin - min);
						returnValue = returnValue.AddSeconds(newSec - second);
			
						return returnValue;
					}
				}
			}
			
			#endif

5. Add a class to represent the data returned from Calendar operations:
	1. Right-click on the **O365Helpers** folder in the **HubApp2.Shared** project and select **Add/New Item...**
	2. In the **Add New Item** dialog, select **Class** and enter the name **FileSystemItemViewModel**.
	3. Replace the template code with the following:

			#if WINDOWS_APP
			using Microsoft.Office365.SharePoint;
			
			namespace HubApp2.ViewModels
			{
				public class FileSystemItemViewModel
				{
			
					private IFileSystemItem _fileSystemItem;
					private string _name;
			
					public FileSystemItemViewModel(IFileSystemItem fileSystemItem)
					{
						if (fileSystemItem == null)
						{
							throw new System.ArgumentNullException("fileSystemItem");
						}
			
						_fileSystemItem = fileSystemItem;
						_name = fileSystemItem.Name;
					}
			
					public IFileSystemItem FileSystemItem
					{
						get { return _fileSystemItem; }
						private set			{ _fileSystemItem = value; }
					}
			
					public string DisplayName
					{
						get
						{
							if (_fileSystemItem is Folder)
							{
								return _name + " (folder)";
							}
							else
							{
								return _name;
							}
						}
					}
			
					public string Name
					{
						get { return _name; }
						set { _name = value; }
					}
			
					public override string ToString()
					{
						return _name;
					}
				}
			}
			
			#endif
6. Add a class to facilitate the File operations:
	2. Right-click on the **O365Helpers** folder in the **HubApp2.Shared** project and select **Add/New Item...**
	2. In the **Add New Item** dialog, select **Class** and enter the name **FileOperations**.
	3. Replace the template code with the following:

			#if WINDOWS_APP
			using HubApp2.ViewModels;
			using Microsoft.Office365.SharePoint;
			using System;
			using System.Collections.Generic;
			using System.IO;
			using System.Linq;
			using System.Text;
			using System.Threading.Tasks;
			using Windows.Storage;
			using Windows.Storage.Pickers;
			
			namespace HubApp2.O365Helpers
			{
				public class FileOperations
				{
					internal async Task<IEnumerable<IFileSystemItem>> GetMyFilesAsync()
					{
						var sharePointClient = await AuthenticationHelper.EnsureSharePointClientCreatedAsync();
						IOrderedEnumerable<IFileSystemItem> files = null;
			
						var filesResults = await sharePointClient.Files.ExecuteAsync();
						files = filesResults.CurrentPage.OrderBy(e => e.Name);
			
						return files;
					}
			
					internal async Task<bool> CreateNewTextFileAsync()
					{
						bool isSuccess = false;
						var sharePointClient = await AuthenticationHelper.EnsureSharePointClientCreatedAsync();
			
						try
						{
							string createdTime = "Created at " + DateTime.Now.ToLocalTime().ToString();
							byte[] bytes = Encoding.UTF8.GetBytes(createdTime);
			
							using (MemoryStream stream = new MemoryStream(bytes))
							{
								await sharePointClient.Files.AddAsync("demo.txt", false, stream);
							}
							isSuccess = true;
						}
			
						catch (Microsoft.Data.OData.ODataErrorException)
						{
							isSuccess = false;
						}
			
						return isSuccess;
					}
			
					internal async Task<bool?> DeleteFileOrFolderAsync(FileSystemItemViewModel _selectedFileObject)
					{
						bool? isSuccess = false;
			
						try
						{
							IFileSystemItem fileOrFolderToDelete = _selectedFileObject.FileSystemItem;
							await fileOrFolderToDelete.DeleteAsync();
			
							isSuccess = true;
						}
						catch (Microsoft.Data.OData.ODataErrorException)
						{
							isSuccess = null;
						}
						catch (NullReferenceException)
						{
							isSuccess = null;
						}
			
						return isSuccess;
					}
			
					internal async Task<object[]> ReadTextFileAsync(FileSystemItemViewModel _selectedFileObject)
					{
			
						string fileContents = string.Empty;
						object[] results = new object[] { fileContents, false };
			
						try
						{
							IFileSystemItem myFile = _selectedFileObject.FileSystemItem;
							if (!myFile.Name.EndsWith(".txt") && !myFile.Name.EndsWith(".xml"))
							{
								results[0] = string.Empty;
								results[1] = false;
								return results;
							}
			
							File file = myFile as File;
			
							using (Stream stream = await file.DownloadAsync())
							{
								using (StreamReader reader = new StreamReader(stream))
								{
									results[0] = await reader.ReadToEndAsync();
									results[1] = true;
								}
							}
						}
						catch (NullReferenceException)
						{
							results[1] = false;
						}
						catch (ArgumentException)
						{
							results[1] = false;
						}
			
						return results;
					}
			
					internal async Task<bool> UpdateTextFileAsync(FileSystemItemViewModel _selectedFileObject, string fileText)
					{
						File file;
						byte[] byteArray;
						bool isSuccess = false;
			
						try
						{
							IFileSystemItem myFile = _selectedFileObject.FileSystemItem;
							file = myFile as File;
							string updateTime = "\n\r\n\rLast update at " + DateTime.Now.ToLocalTime().ToString();
							byteArray = Encoding.UTF8.GetBytes(fileText + updateTime);
			
							using (MemoryStream stream = new MemoryStream(byteArray))
							{
								await file.UploadAsync(stream);
								isSuccess = true; // We've updated the file.
							}
						}
						catch (ArgumentException)
						{
							isSuccess = false;
						}
			
						return isSuccess;
					}
			
					internal async Task<Stream> DownloadFileAsync(FileSystemItemViewModel _selectedFileObject)
					{
			
						File file;
						Stream stream = null;
			
						try
						{
							IFileSystemItem myFile = _selectedFileObject.FileSystemItem;
							file = myFile as File;
							stream = await file.DownloadAsync();
						}
			
						catch (NullReferenceException)
						{
							// Silently fail. A null stream will be handled higher up the stack.
						}
			
						return stream;
					}
			
			
					internal async Task<bool> UploadFileAsync()
					{
						bool isSuccess = false;
						var sharePointClient = await AuthenticationHelper.EnsureSharePointClientCreatedAsync();
						try
						{
							FileOpenPicker fop = new FileOpenPicker();
							fop.FileTypeFilter.Add("*");
							fop.SuggestedStartLocation = PickerLocationId.DocumentsLibrary;
			
							StorageFile sFile = await fop.PickSingleFileAsync();
							if (sFile != null)
							{
								var stream = await sFile.OpenStreamForReadAsync();
								IFile iFile = await sharePointClient.Files.AddAsync(sFile.Name, true, stream);
								isSuccess = true;
							}
						}
						catch (NullReferenceException)
						{
							isSuccess = false;
						}
			
						return isSuccess;
					}
				}
			}
			
			#endif

## Exercise 3: Modify the pages to use the Office 365 classes
In this exercise, you will replace calls to the sample data source with calls to the Office 365 data source created in the previous exercise.

1. In **Solution Explorer**, expand the **HubApp2.Windows** project. Locate and open the file **HubPage.xaml.cs**
	2. In the **NavigationHelper_LoadState**, locate the call to the sample data source:

			// TODO: Create an appropriate data model for your problem 
			// 		 domain to replace the sample data
			var sampleDataGroups = await SampleDataSource.GetGroupsAsync();
			this.DefaultViewModel["Groups"] = sampleDataGroups;
	
		Replace those lines with the following:

			var groups = await O365DataSource.GetGroupsAsync();
			this.DefaultViewModel["CalendarItems"] = 
				groups.First(g => g.UniqueId.Equals("calendar"));
			this.defaultViewModel["FileItems"] = 
				groups.First(g => g.UniqueId.Equals("files"));
	3. In the **Hub_SectionHeaderClick** method, locate the line:

			this.Frame.Navigate(typeof(SectionPage), ((SampleDataGroup)group).UniqueId);

		Replace the **SampleDataGroup** class with the O365DateGroup** class.

			this.Frame.Navigate(typeof(SectionPage), ((O365DataGroup)group).UniqueId);
			
 
	5. Similarly, in the **ItemView_ItemClick** method, location the line:  

			var itemId = ((SampleDataItem)e.ClickedItem).UniqueId;

		Replace the **SampleDataGroup** class with the O365DateGroup** class.

			var itemId = ((O365DataItem)e.ClickedItem).UniqueId;

2. In **Solution Explorer**, locate and open the file **SectionPage.xaml.cs**
	1. In the **ItemView_ItemClick** method, location the line:  

			var itemId = ((SampleDataItem)e.ClickedItem).UniqueId;

		Replace the **SampleDataGroup** class with the O365DateGroup** class.

			var itemId = ((O365DataItem)e.ClickedItem).UniqueId;

3. In **Solution Explorer**, locate and open the file **ItemPage.xaml.cs**
	2. In the **NavigationHelper_LoadState**, locate the call to the sample data source:

            // TODO: Create an appropriate data model for your problem domain to replace the sample data
            var item = await SampleDataSource.GetItemAsync((string)e.NavigationParameter);
            
	
		Replace those lines with the following:

			var item = await O365DataSource.GetItemAsync((string)e.NavigationParameter);
 
4. In **Solution Explorer** right-click on the **HubApp2.Windows** project and select **Set as startup project.
5. Press **F5** to run the program.