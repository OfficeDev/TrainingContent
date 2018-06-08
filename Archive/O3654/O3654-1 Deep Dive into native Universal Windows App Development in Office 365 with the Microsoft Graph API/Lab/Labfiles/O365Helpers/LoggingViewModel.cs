using HubApp2.ViewModels;

namespace HubApp2.O365Helpers {
  public class LoggingViewModel : ViewModelBase {
    public static LoggingViewModel Instance { get; private set; }

    static LoggingViewModel() {
      Instance = new LoggingViewModel();
    }

    private string _information;

    public string Information {
      get {
        return _information;
      }
      set {
        SetProperty(ref _information, value);
      }
    }
  }
}
