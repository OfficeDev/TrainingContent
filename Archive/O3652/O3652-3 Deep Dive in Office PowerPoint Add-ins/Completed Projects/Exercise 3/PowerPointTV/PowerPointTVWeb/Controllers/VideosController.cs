using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PowerPointTVWeb.Controllers
{
    public class VideoInfo
    {
        public string videoId { get; set; }
        public string title { get; set; }
    }

    public class VideosController : ApiController
    {
        public IEnumerable<VideoInfo> Get()
        {
            return new List<VideoInfo>() {
                new VideoInfo{videoId="Y0hsjr7S-kM", title="Adding Provider Hosted App To Windows Azure for Office365"},
                new VideoInfo{videoId="GbYzzubLGEI", title="Async Site Collection Provisioning With App Model for Office365"},
                new VideoInfo{videoId="_Duwtgn9rhc", title="Building Connected SharePoint App Parts With SignalR"},
                new VideoInfo{videoId="m2R8Bfb9Qss", title="Scot Hillier on what makes IT Unity Special"}
            };
        }
    }
}
