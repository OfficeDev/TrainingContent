namespace MyBackgroundTask
{
  using System;
  using System.IO;
  using System.Threading.Tasks;
  using Windows.ApplicationModel.Background;
  using Windows.Foundation;
  using Windows.Storage;

  public sealed class TheTask : IBackgroundTask
  {
    public async void Run(IBackgroundTaskInstance taskInstance)
    {
      var deferral = taskInstance.GetDeferral();

      for (uint i = 0; i < 10; i++)
      {
        taskInstance.Progress = i + 1;
        await Task.Delay(2000);
      }
      await WriteLastRunTimeToFileAsync();

      deferral.Complete();
    }
    public static IAsyncOperation<string> ReadLastRunTimeAsync()
    {
      return (ReadLastRunTimeFromFileAsync().AsAsyncOperation());
    }
    public static IAsyncAction ClearLastRunTimeAsync()
    {
      return (DeleteFileAsync().AsAsyncAction());
    }
    static async Task DeleteFileAsync()
    {
      try
      {
        var file = await ApplicationData.Current.LocalFolder.GetFileAsync(FILENAME);
        await file.DeleteAsync();
      }
      catch (FileNotFoundException)
      {

      }
    }
    static async Task<string> ReadLastRunTimeFromFileAsync()
    {
      string runtime = "Not Run";

      try
      {
        var file = await ApplicationData.Current.LocalFolder.GetFileAsync(FILENAME);

        using (var netStream = await file.OpenStreamForReadAsync())
        {
          using (var reader = new StreamReader(netStream))
          {
            runtime = reader.ReadLine();
          }
        }
      }
      catch (FileNotFoundException)
      {

      }
      return (runtime);
    }
    static async Task WriteLastRunTimeToFileAsync()
    {
      var file = await ApplicationData.Current.LocalFolder.CreateFileAsync(
          FILENAME, CreationCollisionOption.ReplaceExisting);

      using (var netStream = await file.OpenStreamForWriteAsync())
      {
        using (var writer = new StreamWriter(netStream))
        {
          writer.WriteLine(DateTimeOffset.Now.ToString());
        }
      }
    }
    static readonly string FILENAME = "background.txt";
  }
}
