using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;

namespace HubApp2.Data
{
    public class O365DataGroup
    {
        public O365DataGroup(String uniqueId, String title, String subtitle, String imagePath, String description)
        {
            this.UniqueId = uniqueId;
            this.Title = title;
            this.Subtitle = subtitle;
            this.Description = description;
            this.ImagePath = imagePath;
            this.Items = new ObservableCollection<O365DataItem>();
        }

        public string UniqueId { get; private set; }
        public string Title { get; private set; }
        public string Subtitle { get; private set; }
        public string Description { get; private set; }
        public string ImagePath { get; private set; }
        public ObservableCollection<O365DataItem> Items { get; private set; }

        public override string ToString()
        {
            return this.Title;
        }
    }
}
