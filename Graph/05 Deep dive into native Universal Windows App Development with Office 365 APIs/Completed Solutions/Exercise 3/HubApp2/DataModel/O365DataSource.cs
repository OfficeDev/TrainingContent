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
            await _dataSource.GetO365DataGroups();
            return _dataSource.Groups;
        }

        private async Task GetO365DataGroups()
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

            await Task.WhenAll(Groups.Select(g => GetGroupItemsAsync(g)));

            return;
        }

        private async Task GetGroupItemsAsync(O365DataGroup group)
        {
            switch (group.UniqueId)
            {
                case "calendar":
                    var ops = new O365Helpers.CalendarOperations();
                    var events = await ops.GetCalendarEvents();
                    foreach (var item in events)
                    {
                        group.Items.Add(new O365DataItem(item.Id, item.Subject, item.LocationName, "Assets/event.png", item.DisplayString, item.BodyContent));
                    }
                    break;

                case "files":
                    var fileOps = new O365Helpers.FileOperations();
                    var files = await fileOps.GetMyFilesAsync();
                    foreach (var item in files)
                    {
                        group.Items.Add(new O365DataItem(item.Id, item.Name, item.LastModified, "Assets/files.png", item.DisplayName, String.Empty));
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
                if (result != null)
                {
                    break;
                }
            }
            return result;
        }
    }
}