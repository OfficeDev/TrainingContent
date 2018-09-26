using AdaptiveCards;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.O365.ActionableMessages.Utilities;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class TicketController : ApiController
    {
        // Replace https://api.ngrok.io with your service domain URL.
        // For example, if the service URL is https://api.xyz.com/finance/expense?id=1234,
        // then replace https://api.ngrok.io with https://api.xyz.com
        private const string WebServiceHost = "https://api.ngrok.io";

        // Replace yourdomain.onmicrosoft.com with your email domain.
        private const string SenderEmailDomain = "yourdomain.onmicrosoft.com";
        
        /// <summary>
        /// The 'Bearer' token type.
        /// </summary>
        private const string BearerTokenType = "bearer";

        /// <summary>
        /// The POST method for the ticket controller.
        /// </summary>
        /// <param name="cardResponse">Value from the POST request body.</param>
        /// <returns>The asynchronous task.</returns>
        // POST api/ticket
        public async Task<HttpResponseMessage> Post(CardResponse cardResponse)
        {
            HttpRequestMessage request = this.ActionContext.Request;

            // Validate that we have a bearer token.
            if (request.Headers.Authorization == null ||
                !string.Equals(request.Headers.Authorization.Scheme, BearerTokenType,
                    StringComparison.OrdinalIgnoreCase) ||
                string.IsNullOrEmpty(request.Headers.Authorization.Parameter))
            {
                return request.CreateErrorResponse(HttpStatusCode.Unauthorized, new HttpError());
            }

            string bearerToken = request.Headers.Authorization.Parameter;
            ActionableMessageTokenValidator validator = new ActionableMessageTokenValidator();

            // ValidateTokenAsync will verify the following
            // 1. The token is issued by Microsoft and its digital signature is valid.
            // 2. The token has not expired.
            // 3. The audience claim matches the service domain URL.
            ActionableMessageTokenValidationResult result =
                await validator.ValidateTokenAsync(bearerToken, WebServiceHost);

            if (!result.ValidationSucceeded)
            {
                if (result.Exception != null)
                {
                    Trace.TraceError(result.Exception.ToString());
                }

                return request.CreateErrorResponse(HttpStatusCode.Unauthorized, new HttpError());
            }

            // We have a valid token. Your application should verify the sender and/or the ActionPerformer
            //
            // You should also return the CARD-ACTION-STATUS header in the response.
            // The value of the header will be displayed to the user.
            if (!result.Sender.ToLower().EndsWith(SenderEmailDomain))
            {
                HttpResponseMessage errorResponse =
                    request.CreateErrorResponse(HttpStatusCode.Forbidden, new HttpError());
                errorResponse.Headers.Add("CARD-ACTION-STATUS",
                    "Invalid sender or the action performer is not allowed.");
                return errorResponse;
            }

            // prepare the response
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("CARD-ACTION-STATUS", "Comment recorded...");

            #region Business logic code here to process the support ticket.

            List<Models.Comment> comments = new List<Models.Comment>();

            string newComment = cardResponse.Comment;

            if (cardResponse.CachedComments != null)
            {
                JArray cachedComments = (JArray) cardResponse.CachedComments;
                comments.AddRange(cachedComments.ToObject<List<Models.Comment>>());
            }

// add this comment
            comments.Add(new Models.Comment()
            {
                ActionPerformer = result.ActionPerformer,
                CommentDate = DateTime.Now,
                CommentText = newComment
            });

// create the card
            AdaptiveCards.AdaptiveCard refreshCard = CreateRefreshCard(comments);
            if (refreshCard != null)
            {
                // add the Action.Http block to the card.
                refreshCard.Actions.Add(CreateHttpAction(comments));
                response.Headers.Add("CARD-UPDATE-IN-BODY", "true");

                response.Content = new StringContent(refreshCard.ToJson());
            }

            #endregion

            return response;
        }

        private AdaptiveAction CreateHttpAction(List<Models.Comment> comments)
        {
            try
            {
                dynamic httpBody = new JObject();
                httpBody.cachedComments = JArray.FromObject(comments.ToArray<Models.Comment>());
                httpBody.comment = "{{comment.value}}";

                return new AdaptiveShowCardAction()
                {
                    Title = "Comment",
                    Card = new AdaptiveCard()
                    {
                        Body = new List<AdaptiveElement>()
                        {
                            {
                                new AdaptiveTextInput()
                                {
                                    Id = "comment",
                                    IsMultiline = true,
                                    Placeholder = "Enter your comment"
                                }
                            }
                        },
                        Actions = new List<AdaptiveAction>()
                        {
                            {
                                new AdaptiveHttpAction()
                                {
                                    Method = "POST",
                                    Headers = new System.Collections.Specialized.StringDictionary()
                                    {
                                        {
                                            "Content-Type", "application/json"
                                        }
                                    },
                                    Title = "OK",
                                    UrlString = $"{WebServiceHost}/api/Ticket",
                                    Body = httpBody.ToString()
                                }
                            }
                        }
                    }
                };
            }
            catch (Exception ex)
            {
                var x = ex.Message;
            }

            return null;
        }

        private AdaptiveCard CreateRefreshCard(List<Models.Comment> comments)
        {
            Assembly _assembly;
            StreamReader _textStreamReader;

            _assembly = Assembly.GetExecutingAssembly();
            _textStreamReader =
                new StreamReader(_assembly.GetManifestResourceStream("WebApplication1.refreshCard.json"));

            AdaptiveCard refreshCard = AdaptiveCard.FromJson(_textStreamReader.ReadToEnd()).Card;

            AdaptiveContainer commentContainer =
                (AdaptiveContainer) refreshCard.Body.FirstOrDefault(e => e.Id != null && e.Id.Equals("comments"));

            if (commentContainer != null)
            {
                foreach (var comment in comments)
                {
                    commentContainer.Items.Add(new AdaptiveTextBlock
                    {
                        Separator = true,
                        Wrap = true,
                        Text = comment.CommentText
                    });

                    commentContainer.Items.Add(new AdaptiveTextBlock
                    {
                        IsSubtle = true,
                        Size = AdaptiveTextSize.Small,
                        HorizontalAlignment = AdaptiveHorizontalAlignment.Right,
                        Text = $"Entered by {comment.ActionPerformer} on {comment.CommentDate}"
                    });
                }

                return refreshCard;
            }
            else
            {
                return null;
            }
        }
    }
}