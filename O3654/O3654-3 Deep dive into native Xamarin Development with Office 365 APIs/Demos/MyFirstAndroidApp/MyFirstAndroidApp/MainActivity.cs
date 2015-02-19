using System;
using Android.App;
using Android.Content;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;

namespace MyFirstAndroidApp {
  [Activity(Label = "My First Android App", MainLauncher = true, Icon = "@drawable/icon")]
  public class MainActivity : Activity {

    protected override void OnCreate(Bundle bundle) {
      base.OnCreate(bundle);

      // Set our view from the "main" layout resource
      SetContentView(Resource.Layout.Main);

      // Get our button from the layout resource,
      // and attach an event to it
      Button button = FindViewById<Button>(Resource.Id.cmdPressMe);
    
      button.Click += delegate {
        TextView textView = FindViewById<TextView>(Resource.Id.textDisplay);
        textView.Text = "Hello World"; 
      };
    }
  }
}

