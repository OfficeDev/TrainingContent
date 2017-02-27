using Android.App;
using Microsoft.Identity.Client;
using Xamarin.Forms.Platform.Android;
using XamarinLab;
using Xamarin.Forms;
using XamarinLab.Droid;

[assembly: ExportRenderer(typeof(LoginPage), typeof(LoginPageRenderer))]
namespace XamarinLab.Droid
{
    class LoginPageRenderer: PageRenderer
    {
        LoginPage page;

        protected override void OnElementChanged(ElementChangedEventArgs<Page> e)
        {
            base.OnElementChanged(e);
            page = e.NewElement as LoginPage;
            var activity = this.Context as Activity;
            page.platformParameters = new PlatformParameters(activity);
        }
    }
}