using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using VideoApiWeb.Models.JsonHelpers;
using VideoApiWeb.Utils;

namespace VideoApiWeb.Models {
  public class VideoChannelRepository {
    private HttpClient _client = null;

    public VideoChannelRepository(string accessToken) {
      _client = new HttpClient();
      _client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
      _client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);
    }

    public async Task<List<VideoChannel>> GetChannels(bool onlyEditable) {
      var query = onlyEditable
        ? await SpHelper.GetVideoPortalRootUrl() + "/_api/VideoService/CanEditChannels"
        : await SpHelper.GetVideoPortalRootUrl() + "/_api/VideoService/Channels";

      // create request for channels
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, query);

      // issue request & get response 
      var response = await _client.SendAsync(request);
      string responseString = await response.Content.ReadAsStringAsync();
      // convert response to object
      var jsonResponse = JsonConvert.DeserializeObject<JsonHelpers.VideoChannelCollection>(responseString);

      // convert to model object
      var channels = new List<VideoChannel>();

      foreach (var videoChannel in jsonResponse.Data.Results) {
        var channel = new VideoChannel {
          Id = videoChannel.Id,
          HtmlColor = videoChannel.TileHtmlColor,
          Title = videoChannel.Title,
          Description = videoChannel.Description,
          ServerRelativeUrl = videoChannel.ServerRelativeUrl
        };
        channels.Add(channel);
      }

      return channels.OrderBy(vc => vc.Title).ToList();
    }

    public async Task<VideoChannel> GetChannel(string channelId) {
      var query = string.Format("{0}/_api/VideoService/Channels('{1}')", await SpHelper.GetVideoPortalRootUrl(), channelId);

      // issue request & get response 
      var response = await _client.GetAsync(query);
      string responseString = await response.Content.ReadAsStringAsync();
      // convert response to object
      var jsonResponse = JsonConvert.DeserializeObject<JsonHelpers.VideoChannelSingle>(responseString);

      var channel = new VideoChannel {
        Id = jsonResponse.Data.Id,
        HtmlColor = jsonResponse.Data.TileHtmlColor,
        Title = jsonResponse.Data.Title,
        Description = jsonResponse.Data.Description,
        ServerRelativeUrl = jsonResponse.Data.ServerRelativeUrl
      };

      return channel;
    }

    public async Task<List<Video>> GetChannelVideos(string channelId) {
      // create request for videos
      var query = string.Format("{0}/_api/VideoService/Channels('{1}')/Videos",
        await SpHelper.GetVideoPortalRootUrl(), channelId);

      // issue request & get response 
      var response = await _client.GetAsync(query);
      string responseString = await response.Content.ReadAsStringAsync();
      // convert response to object
      var jsonResponse = JsonConvert.DeserializeObject<JsonHelpers.ChannelVideosCollection>(responseString);

      // convert to model object
      var videos = new List<Video>();

      foreach (var channelVideo in jsonResponse.Data.Results) {
        var video = new Video {
          ChannelId = channelId,
          VideoId = channelVideo.ID,
          Title = channelVideo.Title,
          DisplayFormUrl = channelVideo.DisplayFormUrl,
          DurectionInSeconds = channelVideo.VideoDurationInSeconds
        };
        videos.Add(video);
      }

      return videos.OrderBy(v => v.Title).ToList();
    }

    public async Task UploadVideo(Video video) {
      // set digest
      var videoServiceUrl = await SpHelper.GetVideoPortalRootUrl();
      _client.DefaultRequestHeaders.Add("X-RequestDigest", await SpHelper.GetRequestDigest(videoServiceUrl));

      // create new video object
      var newVideo = new JsonHelpers.NewVideoPayload {
        Title = video.Title,
        Description = video.Description,
        FileName = video.FileName,
        Metadata = new NewVideoPayloadMetadata { Type = "SP.Publishing.VideoItem" }
      };
      var newVideoJson = JsonConvert.SerializeObject(newVideo, Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

      // create video placeholder
      var placeholderRequestQuery = string.Format("{0}/_api/VideoService/Channels('{1}')/Videos", videoServiceUrl, video.ChannelId);
      var placeholderRequestBody = new StringContent(newVideoJson);
      placeholderRequestBody.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");

      // issue request & get response 
      var createPlaceholderResponse = await _client.PostAsync(placeholderRequestQuery, placeholderRequestBody);
      string createPlaceholderResponseString = await createPlaceholderResponse.Content.ReadAsStringAsync();
      // convert response to object
      var jsonResponse = JsonConvert.DeserializeObject<JsonHelpers.ChannelVideosSingle>(createPlaceholderResponseString);


      // upload video
      HttpRequestMessage uploadVideoRequest = new HttpRequestMessage(HttpMethod.Post,
        string.Format("{0}/_api/VideoService/Channels('{1}')/Videos('{2}')/GetFile()/SaveBinaryStream", videoServiceUrl, video.ChannelId, jsonResponse.Data.ID));
      uploadVideoRequest.Content = new StreamContent(new MemoryStream(video.FileContent));

      // issue request
      await _client.SendAsync(uploadVideoRequest);
    }

    public async Task DeleteChannelVideo(string channelId, string videoId) {
      // set digest
      var videoServiceUrl = await SpHelper.GetVideoPortalRootUrl();
      _client.DefaultRequestHeaders.Add("X-RequestDigest", await SpHelper.GetRequestDigest(videoServiceUrl));

      // create request for videos
      var query = string.Format("{0}/_api/VideoService/Channels('{1}')/Videos('{2}')", await SpHelper.GetVideoPortalRootUrl(), channelId, videoId);

      // set request header method
      _client.DefaultRequestHeaders.Add("X-HTTP-Method", "DELETE");

      // issue request
      await _client.PostAsync(query, null);
    }
  }
}