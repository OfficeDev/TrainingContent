using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace HubApp2.ViewModels {
  /// <summary>
  /// Base view model for working with Office 365 services.
  /// </summary>
  public class ViewModelBase : INotifyPropertyChanged {

    protected bool SetProperty<T>(ref T field, T value, [CallerMemberName] string propertyName = "") {
      // If the value is the same as the current value, return false to indicate this was a no-op. 
      if (Object.Equals(field, value))
        return false;

      // Raise any registered property changed events and indicate to the user that the value was indeed changed.
      field = value;
      NotifyPropertyChanged(propertyName);
      return true;
    }

    public event PropertyChangedEventHandler PropertyChanged;


    protected void NotifyPropertyChanged([CallerMemberName]string propertyName = "") {
      if (PropertyChanged != null)
        PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
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
