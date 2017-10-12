
using Android.App;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;
using XamarinApp;
using XamarinApp.Droid;

[assembly: ExportRenderer(typeof(MainPage), typeof(MainPageRenderer))]
namespace XamarinApp.Droid
{
    class MainPageRenderer : PageRenderer
    {
        MainPage page;

        protected override void OnElementChanged(ElementChangedEventArgs<Page> e)
        {
            base.OnElementChanged(e);
            page = e.NewElement as MainPage;
            var activity = this.Context as Activity;
        }

    }
}