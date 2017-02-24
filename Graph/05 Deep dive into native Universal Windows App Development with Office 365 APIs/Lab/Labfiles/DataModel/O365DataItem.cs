using System;
using System.Collections.Generic;
using System.Text;

namespace HubApp2.Data {
  public class O365DataItem {
    public O365DataItem(String uniqueId, String title, String subtitle, String imagePath, String description, String content) {
      this.UniqueId = uniqueId;
      this.Title = title;
      this.Subtitle = subtitle;
      this.Description = description;
      this.ImagePath = imagePath;
      this.Content = content;
    }

    public string UniqueId { get; private set; }
    public string Title { get; private set; }
    public string Subtitle { get; private set; }
    public string Description { get; private set; }
    public string ImagePath { get; private set; }
    public string Content { get; private set; }

    public override string ToString() {
      return this.Title;
    }
  }
}
