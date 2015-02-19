using System;

using Android.App;
using Android.Content;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;

using System.Collections.Generic;
using XamarinLab.Model;

namespace XamarinLab {
  [Activity(Label = "Xamarin Lab", MainLauncher = true, Icon = "@drawable/icon")]
  public class MainActivity : Activity {

    ListView contactsListView;
    List<MyContact> myContacts = new List<MyContact>();
    MyContactsAdapter myContactsAdapter;

    protected override void OnCreate(Bundle bundle) {
      base.OnCreate(bundle);

      SetContentView(Resource.Layout.Main);

      contactsListView = FindViewById<ListView>(Resource.Id.ContactsListView);
      myContactsAdapter = new MyContactsAdapter(this, myContacts);
      contactsListView.Adapter = myContactsAdapter;

      Button button = FindViewById<Button>(Resource.Id.cmdGetContacts);
      button.Click += async delegate {
        // add event handler code for button
        await Office365Service.EnsureClientCreated(this);
        myContacts = await Office365Service.GetMyContacts();
        myContactsAdapter.AddAll(myContacts);
        myContactsAdapter.NotifyDataSetChanged();
      };
    }
  }
}



