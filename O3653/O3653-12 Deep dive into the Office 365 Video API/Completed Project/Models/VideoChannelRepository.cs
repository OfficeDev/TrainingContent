using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.UI.WebControls;
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
          DurationInSeconds = channelVideo.VideoDurationInSeconds
        };
        videos.Add(video);
      }

      return videos.OrderBy(v => v.Title).ToList();
    }

    public async Task UploadVideo(Video video) {
      var videoServiceUrl = await SpHelper.GetVideoPortalRootUrl();

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
      const int fileUploadChunkSize = 2 * 1024 * 1024; // upload 2MB chunks
      long fileBytesUploaded = 0;
      bool canContinue = true;
      var fileUploadSessionId = Guid.NewGuid().ToString();

      string uploadVideoEndpoint = string.Format("{0}/_api/VideoService/Channels('{1}')/Videos('{2}')/GetFile()/StartUpload(uploadId=guid'{3}')",
                                      videoServiceUrl,
                                      video.ChannelId,
                                      jsonResponse.Data.ID,
                                      fileUploadSessionId);

      using (HttpResponseMessage startResponseMessage = await _client.PostAsync(uploadVideoEndpoint, null)) {
        canContinue = startResponseMessage.IsSuccessStatusCode;
      }

      // upload all but the last chunk
      var totalChunks = Math.Ceiling(video.FileContent.Length / (double)fileUploadChunkSize);
      while (fileBytesUploaded < fileUploadChunkSize * (totalChunks - 1)) {
        if (!canContinue) { break; }

        // read file in
        using (var videoFileReader = new BinaryReader(new MemoryStream(video.FileContent))) {
          // advance to the part of the video to show
          videoFileReader.BaseStream.Seek(fileBytesUploaded, SeekOrigin.Begin);

          // get a slice of the file to upload
          var videoSlice = videoFileReader.ReadBytes(Convert.ToInt32(fileUploadChunkSize));

          // upload slice
          string chunkUploadUrl = string.Format("{0}/_api/VideoService/Channels('{1}')/Videos('{2}')/GetFile()/ContinueUpload(uploadId=guid'{3}',fileOffset='{4}')",
                                    videoServiceUrl,
                                    video.ChannelId,
                                    jsonResponse.Data.ID,
                                    fileUploadSessionId, fileBytesUploaded);
          using (var fileContent = new StreamContent(new MemoryStream(videoSlice))) {
            using (HttpResponseMessage uploadResponseMessage = await _client.PostAsync(chunkUploadUrl, fileContent)) {
              canContinue = uploadResponseMessage.IsSuccessStatusCode;
              fileBytesUploaded += fileUploadChunkSize;
            }
          }
        }
      }

      // upload last chunk
      if (canContinue) {
        var lastBytesToUpload = video.FileContent.Length - fileBytesUploaded;
        using (var videoFileReader = new BinaryReader(new MemoryStream(video.FileContent))) {
          // jump to the part of the file to upload
          videoFileReader.BaseStream.Seek(fileBytesUploaded, SeekOrigin.Begin);

          // get the last slice of file to upload
          var videoSlice = videoFileReader.ReadBytes(Convert.ToInt32(lastBytesToUpload));
          string chunkUploadUrl = string.Format("{0}/_api/VideoService/Channels('{1}')/Videos('{2}')/GetFile()/FinishUpload(uploadId=guid'{3}',fileOffset='{4}')",
                                    videoServiceUrl,
                                    video.ChannelId,
                                    jsonResponse.Data.ID,
                                    fileUploadSessionId, fileBytesUploaded);
          using (var fileContent = new StreamContent(new MemoryStream(videoSlice))) {
            using (HttpResponseMessage uploadResponseMessage = await _client.PostAsync(chunkUploadUrl, fileContent)) {
              canContinue = uploadResponseMessage.IsSuccessStatusCode;
              fileBytesUploaded += fileUploadChunkSize;
            }
          }
        }
      }
    }

    public async Task DeleteChannelVideo(string channelId, string videoId) {
      var videoServiceUrl = await SpHelper.GetVideoPortalRootUrl();

      // create request for videos
      var query = string.Format("{0}/_api/VideoService/Channels('{1}')/Videos('{2}')", await SpHelper.GetVideoPortalRootUrl(), channelId, videoId);

      // set request header method
      _client.DefaultRequestHeaders.Add("X-HTTP-Method", "DELETE");

      // issue request
      await _client.PostAsync(query, null);
    }
  }
}