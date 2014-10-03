using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace XamarinLab.Model {
  public class MyContact {
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
  }
}