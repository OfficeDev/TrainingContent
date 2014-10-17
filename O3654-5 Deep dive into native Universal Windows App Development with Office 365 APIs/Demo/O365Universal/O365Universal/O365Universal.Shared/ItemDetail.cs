using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace O365Universal
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class ItemDetail : Page
    {
        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.
        /// This parameter is typically used to configure the page.</param>
        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            controller = new MyFilesController();
            int index = (int)e.Parameter;
            this.DataContext = (App.Current as App).Items;
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Low, () => { imgFlipView.SelectedIndex = index; });
            await updateUI((App.Current as App).Items[index]);
            loaded = true;
        }

        public MyFilesController controller { get; set; }
        private bool loaded = false;

        private async void imgFlipView_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            //load new picture
            if (imgFlipView.SelectedIndex != -1 && loaded)
            {
                var item = (App.Current as App).Items[imgFlipView.SelectedIndex];
                await updateUI(item);
            }
        }

        private async Task updateUI(MyFile item)
        {
            pageTitle.Text = item.Name;
            if (!item.ImageLoaded)
            {
                item.Bitmap = await controller.GetImage(item, (int)Window.Current.Bounds.Width);
                item.ImageLoaded = true;
            }
        }
    }
}
