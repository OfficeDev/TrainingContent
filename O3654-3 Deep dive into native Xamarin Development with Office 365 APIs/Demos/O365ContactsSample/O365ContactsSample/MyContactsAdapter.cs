using Android.App;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace O365ContactsSample
{
    public class MyContactsAdapter : ArrayAdapter<MyContact>
    {
        public MyContactsAdapter(Activity activity, List<MyContact> myContacts)
            : base(activity, Resource.Layout.ContactListItem, myContacts)
        {
           
        }        

        public override View GetView(int position, View convertView, ViewGroup parent)
        {
            MyContact myContactItem = this.GetItem(position);

            View row = convertView;

            if(row == null)
            {    
                row = LayoutInflater.FromContext(this.Context).Inflate(Resource.Layout.ContactListItem, parent, false);
            }

            var contactNameElement = row.FindViewById<TextView>(Resource.Id.ContactName);
            contactNameElement.Text = myContactItem.Name;

            var contactEmailElement = row.FindViewById<TextView>(Resource.Id.ContactEmail);
            contactEmailElement.Text = myContactItem.Email;           
            
            Task.Run(async () =>
                {
                    Bitmap bitmap = null;

                    var contactPictureElement = row.FindViewById<ImageView>(Resource.Id.ContactPicture);

                    byte[] bytesContactPicture = await Office365Service.GetContactPicture(myContactItem.Id);

                    if (bytesContactPicture.Length > 0)
                    {
                        bitmap = await BitmapFactory.DecodeByteArrayAsync(bytesContactPicture, 0, bytesContactPicture.Length);
                       
                        SetBitmapSafe(bitmap, contactPictureElement);
                    }
                    else
                    {
                        var galUser = await Office365Service.GetUser(myContactItem.Email);

                        try
                        {
                            if (galUser != null)
                            {
                                using (var stream = (await galUser.ThumbnailPhoto.DownloadAsync()).Stream)
                                {
                                    bitmap = await BitmapFactory.DecodeStreamAsync(stream);

                                    SetBitmapSafe(bitmap, contactPictureElement);
                                }
                            }
                        }
                        catch (Exception)
                        {

                        }
                    }
                    
                });

            return row;
        }

        private void SetBitmapSafe(Bitmap bitmap, ImageView contactPictureElement)
        {
            ((Activity)this.Context).RunOnUiThread(() =>
            {
                contactPictureElement.SetImageBitmap(bitmap);
            });

        }
    }
}