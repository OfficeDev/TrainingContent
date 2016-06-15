using HubApp2.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace HubApp2.O365Helpers
{
    /// <summary>
    /// Contains methods for accessing the files and folders.
    /// </summary>
    public class FileOperations
    {
        /// <summary>
        /// Performs a search of the default Documents folder. Displays the first page of results.
        /// </summary>
        /// <returns>A collection of information that describes files and folders.</returns>
        internal async Task<List<FileSystemItemViewModel>> GetMyFilesAsync()
        {
            var fileResults = new List<FileSystemItemViewModel>();

            try
            {
                var graphClient = await AuthenticationHelper.GetGraphServiceClientAsync();
                var driveItems = await graphClient.Me.Drive.Root.Children.Request().GetAsync();
                foreach (var item in driveItems)
                {
                    FileSystemItemViewModel fileItemModel = new FileSystemItemViewModel();
                    fileItemModel.Name = item.Name;
                    fileItemModel.LastModifiedBy = item.LastModifiedBy.User.DisplayName;
                    fileItemModel.LastModifiedDateTime = item.LastModifiedDateTime.GetValueOrDefault(new DateTimeOffset());
                    fileItemModel.Id = item.Id;
                    fileItemModel.Folder = item.Folder != null ? item.Folder.ToString() : string.Empty;
                    fileResults.Add(fileItemModel);
                }
            }
            catch (Exception el)
            {
                el.ToString();
            }

            return fileResults.OrderBy(e => e.Name).ToList();
        }
    }
}