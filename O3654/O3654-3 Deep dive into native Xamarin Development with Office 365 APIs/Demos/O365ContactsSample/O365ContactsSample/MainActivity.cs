using Android.App;
using Android.OS;
using Android.Widget;
using System;
using System.Collections.Generic;

namespace O365ContactsSample
{
    [Activity(Label = "O365 Contacts Sample", MainLauncher = true, Icon = "@drawable/icon")]
    public class MainActivity : Activity
    {
        List<MyContact> myContacts = new List<MyContact>();
        ListView contactsListView;
        MyContactsAdapter myContactsAdapter;

        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);
            SetContentView(Resource.Layout.Main);
            Button btnAuthenticate = FindViewById<Button>(Resource.Id.BtnAuthenticate);
            contactsListView = FindViewById<ListView>(Resource.Id.ContactsListView);
            myContactsAdapter = new MyContactsAdapter(this, myContacts);
            contactsListView.Adapter = myContactsAdapter;
            btnAuthenticate.Click += btnAuthenticate_Click;
        }

        async void btnAuthenticate_Click(object sender, EventArgs e)
        {
            Button btnSender = sender as Button;
            if (btnSender.Text == "Sign In")
            {
                btnSender.Enabled = false;
                await Office365Service.EnsureClientCreated(this);
                myContacts = await Office365Service.GetMyContacts();
                myContactsAdapter.AddAll(myContacts);
                myContactsAdapter.NotifyDataSetChanged();
                btnSender.Text = "Sign Out";
                btnSender.Enabled = true; ;
            }
            else
            {
                myContacts.Clear();
                myContactsAdapter.Clear();
                myContactsAdapter.NotifyDataSetChanged();
                Office365Service.SignOut(this);
                btnSender.Text = "Sign In";
            }
        }
    }
}

