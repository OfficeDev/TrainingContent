using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace FileLibrary
{
    public enum EntryType
    {
        EnteredZone,
        ExitedZone
    }
    public static class StatusFile
    {
        public static async Task AddStatusEntry(string fenceName, EntryType type)
        {
            StorageFile file = await OpenFileAsync(true);

            using (Stream stream = await file.OpenStreamForWriteAsync())
            {
                long position = stream.Seek(0, SeekOrigin.End);

                using (StreamWriter writer = new StreamWriter(stream))
                {
                    await writer.WriteAsync(
                        string.Format("{0}Fence {1} {2} at time {3}",
                        position == 0 ? string.Empty : SEPARATOR_STRING,
                        fenceName, type == EntryType.EnteredZone ? "entered" : "exited", DateTime.Now));

                    await writer.FlushAsync();
                }
            }
        }
        public static async Task<string[]> ReadAllStatusEntries()
        {
            string[] entries = null;

            StorageFile file = await OpenFileAsync();

            if (file != null)
            {
                using (Stream stream = await file.OpenStreamForReadAsync())
                {
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        string lines = await reader.ReadToEndAsync();
                        entries = lines.Split(SEPARATOR_CHAR);
                    }
                }
            }
            return (entries);
        }
        static async Task<StorageFile> OpenFileAsync(bool write = false)
        {
            StorageFile file = null;

            if (!write)
            {
                try
                {
                    file = await ApplicationData.Current.LocalFolder.GetFileAsync(FILENAME);
                }
                catch (FileNotFoundException)
                { 
                }
            }
            else
            {
                file = await ApplicationData.Current.LocalFolder.CreateFileAsync(
                    FILENAME, CreationCollisionOption.OpenIfExists);
            }
            return (file);
        }
        static readonly char SEPARATOR_CHAR = '|';
        static readonly string SEPARATOR_STRING = "|";
        static readonly string FILENAME = "status.txt";
    }
}
