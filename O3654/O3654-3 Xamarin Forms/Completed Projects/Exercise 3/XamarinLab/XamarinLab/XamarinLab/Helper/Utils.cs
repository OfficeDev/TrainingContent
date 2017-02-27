using System;
using System.Collections.Generic;
using System.Text;
using Xamarin.Forms;

namespace XamarinLab.Helper
{
    class Utils
    {
    }
    public class ActivityIndicatorScope : IDisposable
    {
        private ActivityIndicator indicator;
        private Grid indicatorPanel;

        public ActivityIndicatorScope(ActivityIndicator indicator, Grid indicatorPanel, bool showIndicator)
        {
            this.indicator = indicator;
            this.indicatorPanel = indicatorPanel;

            SetIndicatorActivity(showIndicator);
        }

        private void SetIndicatorActivity(bool isActive)
        {
            this.indicator.IsVisible = isActive;
            this.indicator.IsRunning = isActive;
            this.indicatorPanel.IsVisible = isActive;
        }

        public void Dispose()
        {
            SetIndicatorActivity(false);
        }
    }
}
