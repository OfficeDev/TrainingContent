using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Android.App;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace XamarinLab.Model {

  public class MyContactsAdapter : ArrayAdapter<MyContact> {
    public MyContactsAdapter(Activity activity, List<MyContact> myContacts)
      : base(activity, Resource.Layout.ContactListItem, myContacts) {
    }

    public override View GetView(int position, View contactItemView, ViewGroup parent) {

      MyContact myContactItem = this.GetItem(position);

      if (contactItemView == null) {
        contactItemView = LayoutInflater.FromContext(this.Context)
                                        .Inflate(Resource.Layout.ContactListItem, parent, false);
      }

      var contactNameElement = contactItemView.FindViewById<TextView>(Resource.Id.ContactName);
      contactNameElement.Text = myContactItem.Name;

      var contactEmailElement = contactItemView.FindViewById<TextView>(Resource.Id.ContactEmail);
      contactEmailElement.Text = myContactItem.Email;

      return contactItemView;
    }

  }
}