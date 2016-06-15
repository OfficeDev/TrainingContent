using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace HubApp2.ViewModels
{
    /// <summary>
    /// Base view model for working with Office 365 services.
    /// </summary>
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