using System;
using Android.App;
using Android.Content;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;
using System.Collections.Generic;
using AdapterDemo.Model;

namespace AdapterDemo {
  [Activity(Label = "Adapter Demo", MainLauncher = true, Icon = "@drawable/icon")]
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
      button.Click += delegate {
        // add event handler code for button
        myContacts.Clear();
        myContacts.Add(new MyContact { Name = "Mike Fitzmaurice", Email = "Mike@fitz.net" });
        myContacts.Add(new MyContact { Name = "Chris Sells", Email = "chris@sellsbrothers.com" });
        myContacts.Add(new MyContact { Name = "Brian Cox", Email = "bc@adventureworks.com" });

        myContactsAdapter.AddAll(myContacts);
        myContactsAdapter.NotifyDataSetChanged();
      };
    }
  }
}

