//*********************************************************
// Copyright (c) Microsoft Corporation
// All rights reserved. 
//
// Licensed under the Apache License, Version 2.0 (the ""License""); 
// you may not use this file except in compliance with the License. 
// You may obtain a copy of the License at 
// http://www.apache.org/licenses/LICENSE-2.0 
//
// THIS CODE IS PROVIDED ON AN  *AS IS* BASIS, WITHOUT 
// WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS 
// OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED 
// WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR 
// PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
//
// See the Apache Version 2.0 License for specific language 
// governing permissions and limitations under the License.
//*********************************************************

using System.IO;
using Microsoft.Live;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Windows.ApplicationModel;

namespace OneNoteCloudCreatePagesSample
{
    /// <summary>
    /// Class to show a selection of examples of creating posts via the OneNote Cloud API
    /// </summary>
    public class CreateExamples
    {
        private static readonly string PagesEndPoint = "https://www.onenote.com/api/v1.0/pages";

		private string SectionName = "Quick Notes";

		private string DEFAULT_SECTION_NAME = "Quick Notes";

        /// <summary>
        /// Client to do OAUTH against Microsoft Live Connect service
        /// </summary>
        private readonly LiveAuthClient _authClient;

        public CreateExamples(LiveAuthClient authClient)
        {
            _authClient = authClient;
        }

		public Uri GetPagesEndpoint(string specifiedSectionName)
		{
			string sectionNameToUse;
			if(specifiedSectionName != null)
			{
				sectionNameToUse = specifiedSectionName;
			}
			else
			{
				sectionNameToUse = DEFAULT_SECTION_NAME;
			}
			return new Uri(PagesEndPoint + "/?sectionName=" + sectionNameToUse);
		}

        /// <summary>
        /// Does the object currently have a valid authenticated state
        /// </summary>
        public bool IsAuthenticated
        {
            get { return _authClient.Session != null && !string.IsNullOrEmpty(_authClient.Session.AccessToken); }
        }

        /// <summary>
        /// Create a very simple page with some formatted text.
        /// </summary>
        /// <param name="debug">Run the code under the debugger</param>
        async public Task<StandardResponse> CreateSimplePage(bool debug, string sectionName)
        {
            if (debug)
            {
                Debugger.Launch();
                Debugger.Break();
            }

            var client = new HttpClient();

            // Note: API only supports JSON return type.
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
 
            // This allows you to see what happens when an unauthenticated call is made.
            if (IsAuthenticated)
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _authClient.Session.AccessToken);
            }

            string date = GetDate();
            string simpleHtml = "<html>" +
                                "<head>" +
                                "<title>A simple page created from basic HTML-formatted text on Windows 8</title>" +
                                "<meta name=\"created\" content=\"" + date + "\" />" +
                                "</head>" +
                                "<body>" +
                                "<p>This is a page that just contains some simple <i>formatted</i> <b>text</b></p>" +
                                "<p>Here is a <a href=\"http://www.microsoft.com\">link</a></p>" +
                                "</body>" +
                                "</html>";

			var createMessage = new HttpRequestMessage(HttpMethod.Post, GetPagesEndpoint(sectionName))
                {
                    Content = new StringContent(simpleHtml, System.Text.Encoding.UTF8, "text/html")
                };

            HttpResponseMessage response = await client.SendAsync(createMessage);

            return await TranslateResponse(response);
        }

        /// <summary>
        /// Create a page with an image on it.
        /// </summary>
        /// <param name="debug">Run the code under the debugger</param>
		async public Task<StandardResponse> CreatePageWithImage(bool debug, string sectionName)
        {
            if (debug)
            {
                Debugger.Launch();
                Debugger.Break();
            }

            var client = new HttpClient();

            // Note: API only supports JSON return type.
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
 
            // This allows you to see what happens when an unauthenticated call is made.
            if (IsAuthenticated)
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _authClient.Session.AccessToken);
            }

            const string imagePartName = "image1";
            string date = GetDate();
            string simpleHtml = "<html>" +
                                "<head>" +
                                "<title>A simple page created with an image on it</title>" +
                                "<meta name=\"created\" content=\"" + date + "\" />" +
                                "</head>" +
                                "<body>" +
                                "<h1>This is a page with an image on it</h1>" +
                                "<img src=\"name:" + imagePartName + "\" alt=\"A beautiful logo\" width=\"426\" height=\"68\" />" +
                                "</body>" +
                                "</html>";

            // Create the image part - make sure it is disposed after we've sent the message in order to close the stream.
            HttpResponseMessage response;
            using (var imageContent = new StreamContent(await GetBinaryStream("assets\\Logo.jpg")))
            {
                imageContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
				HttpRequestMessage createMessage = new HttpRequestMessage(HttpMethod.Post, GetPagesEndpoint(sectionName))
                {
                    Content = new MultipartFormDataContent
                    {
                        {new StringContent(simpleHtml, System.Text.Encoding.UTF8, "text/html"), "Presentation"},
                        {imageContent, imagePartName}
                    }
                };


                // Must send the request within the using block, or the image stream will have been disposed.
                response = await client.SendAsync(createMessage);
            }

            return await TranslateResponse(response);
        }

        /// <summary>
        /// Create a page with a PDF document attached and rendered
        /// </summary>
        /// <param name="debug">Determines whether to execute this method under the debugger</param>
        /// <returns>The converted HTTP response message</returns>
		async public Task<StandardResponse> CreatePageWithPDFAttachedAndRendered(bool debug, string sectionName)
        {
            if(debug)
            {
                Debugger.Launch();
                Debugger.Break();
            }

            var client = new HttpClient();
            string date = GetDate();
            //Note: API only supports JSON return type
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            // This allows you to see what happens when an unauthenticated call is made.
            if (IsAuthenticated)
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _authClient.Session.AccessToken);
            }
            const string attachmentPartName = "pdfattachment1";
            string attachmentRequestHtml = "<html>" +
                                "<head>" +
                                "<title>A page created with a PDF document attached and rendered</title>" +
                                "<meta name=\"created\" content=\"" + date + "\" />" +
                                "</head>" +
                                "<body>" +
                                "<h1>This is a page with a PDF file attachment</h1>" +
                                "<object data-attachment=\"attachment.pdf\" data=\"name:" + attachmentPartName + "\" />" +
								"<p>Here's the content of the PDF document :</p>" +
								"<img data-render-src=\"name:" + attachmentPartName + "\" alt=\"Hello World\" width=\"1500\" />" +
                                "</body>" +
                                "</html>";
            HttpResponseMessage response;
            using (var attachmentContent = new StreamContent(await GetBinaryStream("assets\\attachment.pdf")))
            {
                attachmentContent.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
				HttpRequestMessage createMessage = new HttpRequestMessage(HttpMethod.Post, GetPagesEndpoint(sectionName))
                {
                    Content = new MultipartFormDataContent
                    {
                        {new StringContent(attachmentRequestHtml, System.Text.Encoding.UTF8, "text/html"), "Presentation"},
                        {attachmentContent, attachmentPartName}
                    }
                };
                // Must send the request within the using block, or the binary stream will have been disposed.
                response = await client.SendAsync(createMessage);
            }
            return await TranslateResponse(response);
        }

        /// <summary>
        /// Create a page with an image of an embedded webpage on it.
        /// </summary>
        /// <param name="debug">Run the code under the debugger</param>
		async public Task<StandardResponse> CreatePageWithEmbeddedWebPage(bool debug, string sectionName)
        {
            if (debug)
            {
                Debugger.Launch();
                Debugger.Break();
            }

            var client = new HttpClient();

            // Note: API only supports JSON return type.
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
 
            // This allows you to see what happens when an unauthenticated call is made.
            if (IsAuthenticated)
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _authClient.Session.AccessToken);
            }
            const string embeddedPartName = "embedded1";
            const string embeddedWebPage = 
                "<html>" +
                "<head>" +
                "<title>An embedded webpage</title>" +
                "</head>" +
                "<body>" +
                "<h1>This is a screen grab of a web page</h1>" +
                "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vehicula magna quis mauris accumsan, nec imperdiet nisi tempus. Suspendisse potenti. " +
                "Duis vel nulla sit amet turpis venenatis elementum. Cras laoreet quis nisi et sagittis. Donec euismod at tortor ut porta. Duis libero urna, viverra id " +
                "aliquam in, ornare sed orci. Pellentesque condimentum gravida felis, sed pulvinar erat suscipit sit amet. Nulla id felis quis sem blandit dapibus. Ut " +
                "viverra auctor nisi ac egestas. Quisque ac neque nec velit fringilla sagittis porttitor sit amet quam.</p>" +
                "</body>" +
                "</html>";

            string date = GetDate();

            string simpleHtml = "<html>" +
                                "<head>" +
                                "<title>A page created with an image of an html page on it</title>" +
                                "<meta name=\"created\" content=\"" + date + "\" />" +
                                "</head>" +
                                "<body>" +
                                "<h1>This is a page with an image of an html page on it.</h1>" +
                                "<img data-render-src=\"name:" + embeddedPartName + "\" alt=\"A website screen grab\" />" +
                                "</body>" +
                                "</html>";

			var createMessage = new HttpRequestMessage(HttpMethod.Post, GetPagesEndpoint(sectionName))
            {
                Content = new MultipartFormDataContent
                        {
                            {new StringContent(simpleHtml, System.Text.Encoding.UTF8, "text/html"), "Presentation"},
                            {new StringContent(embeddedWebPage, System.Text.Encoding.UTF8, "text/html"), embeddedPartName}
                        }
            };

            HttpResponseMessage response = await client.SendAsync(createMessage);

            return await TranslateResponse(response);
        }

        /// <summary>
        /// Create a page with an image of a URL on it.
        /// </summary>
        /// <param name="debug">Run the code under the debugger</param>
		async public Task<StandardResponse> CreatePageWithUrl(bool debug, string sectionName)
        {
            if (debug)
            {
                Debugger.Launch();
                Debugger.Break();
            }

            var client = new HttpClient();

            // Note: API only supports JSON return type.
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
 
            // This allows you to see what happens when an unauthenticated call is made.
            if (IsAuthenticated)
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _authClient.Session.AccessToken);
            }

            string date = GetDate();
            string simpleHtml = @"<html>" +
                                "<head>" +
                                "<title>A page created with an image from a URL on it</title>" +
                                "<meta name=\"created\" content=\"" + date + "\" />" +
                                "</head>" +
                                "<body>" +
                                "<p>This is a page with an image of an html page rendered from a URL on it.</p>" +
                                "<img data-render-src=\"http://www.onenote.com\" alt=\"An important web page\"/>" +
                                "</body>" +
                                "</html>";

			var createMessage = new HttpRequestMessage(HttpMethod.Post, GetPagesEndpoint(sectionName))
            {
                Content = new StringContent(simpleHtml, System.Text.Encoding.UTF8, "text/html")
            };

            HttpResponseMessage response = await client.SendAsync(createMessage);

            return await TranslateResponse(response);
        }

        /// <summary>
        /// Get date in ISO8601 format with local timezone offset
        /// </summary>
        /// <returns>Date as ISO8601 string</returns>
        private static string GetDate()
        {
            return DateTime.Now.ToString("o");
        }

        /// <summary>
        /// Convert the http response message into a simple structure suitable for apps to process
        /// </summary>
        /// <param name="response">The response to convert</param>
        /// <returns>A simple rsponse</returns>
        private async static Task<StandardResponse> TranslateResponse(HttpResponseMessage response)
        {
            StandardResponse standardResponse;
            if (response.StatusCode == HttpStatusCode.Created)
            {
                dynamic responseObject = JsonConvert.DeserializeObject(await response.Content.ReadAsStringAsync());
                standardResponse = new CreateSuccessResponse
                    {
                        StatusCode = response.StatusCode,
                        OneNoteClientUrl = responseObject.links.oneNoteClientUrl.href,
                        OneNoteWebUrl = responseObject.links.oneNoteWebUrl.href
                    };
            }
            else
            {
                standardResponse = new StandardErrorResponse
                {
                    StatusCode = response.StatusCode,
                    Message = await response.Content.ReadAsStringAsync()
                };
            }

            // Extract the correlation id.  Apps should log this if they want to collcet the data to diagnose failures with Microsoft support 
            IEnumerable<string> correlationValues;
            if (response.Headers.TryGetValues("X-CorrelationId", out correlationValues))
            {
                standardResponse.CorrelationId = correlationValues.FirstOrDefault();
            } 

            return standardResponse;
        }

        /// <summary>
        /// Get a binary file asset packaged with the application and return it as a managed stream
        /// </summary>
        /// <param name="binaryFile">The path to refer to the file relative to the application package root</param>
        /// <returns>A managed stream of the file data, opened for read</returns>
        private async static Task<Stream> GetBinaryStream(string binaryFile)
        {
            var storageFile = await Package.Current.InstalledLocation.GetFileAsync(binaryFile);
            var storageStream = await storageFile.OpenSequentialReadAsync();
            return storageStream.AsStreamForRead();
        }

    }
}