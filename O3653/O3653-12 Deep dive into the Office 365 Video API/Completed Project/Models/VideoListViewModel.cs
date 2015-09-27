using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VideoApiWeb.Models {
  public class VideoListViewModel {
    public string ChannelId { get; set; }
    public string ChannelTitle { get; set; }
    public List<Video> Videos { get; set; } 
  }
}