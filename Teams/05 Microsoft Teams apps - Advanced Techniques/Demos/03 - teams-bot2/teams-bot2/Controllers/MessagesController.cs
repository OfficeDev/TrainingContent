using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Teams;
using System.Configuration;
using System;
using Polly;
using Microsoft.Bot.Connector.Teams.Models;
using System.Collections.Generic;

namespace teams_bot2
{
	[BotAuthentication]
	public class MessagesController : ApiController
	{
		/// <summary>
		/// POST: api/Messages
		/// Receive a message from a user and reply to it
		/// </summary>
		public async Task<HttpResponseMessage> Post([FromBody]Activity activity)
		{
			switch (activity.Type)
			{
				case ActivityTypes.Message:
					await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
					break;

				case ActivityTypes.ConversationUpdate:
					await HandleSystemMessageAsync(activity);
					break;

				case ActivityTypes.Invoke:
					var composeResponse = await ComposeHelpers.HandleInvoke(activity);
					var stringContent = new StringContent(composeResponse);
					HttpResponseMessage httpResponseMessage = new HttpResponseMessage(HttpStatusCode.OK);
					httpResponseMessage.Content = stringContent;
					return httpResponseMessage;
					break;

				default:
					break;
			}
			var response = Request.CreateResponse(HttpStatusCode.OK);
			return response;
		}

		private async Task<Activity> HandleSystemMessageAsync(Activity message)
		{
			TeamEventBase eventData = message.GetConversationUpdateData();
			switch (eventData.EventType)
			{
				case TeamEventType.MembersAdded:

					var client = new ConnectorClient(
												 new Uri(message.ServiceUrl),
												 ConfigurationManager.AppSettings["MicrosoftAppId"],
												 ConfigurationManager.AppSettings["MicrosoftAppPassword"]);
					client.SetRetryPolicy(RetryHelpers.DefaultPolicyBuilder.WaitAndRetryAsync(new[] { TimeSpan.FromSeconds(2), TimeSpan.FromSeconds(5), TimeSpan.FromSeconds(10) }));

					var tenantId = message.GetTenantId();
					var botAccount = message.Recipient;
					var channelData = message.GetChannelData<TeamsChannelData>();

					if (EventHelpers.MemberAddedIsBot(message))
					{
						// Fetch the members in the current conversation
						ChannelAccount[] channelAccount = await client.Conversations.GetConversationMembersAsync(message.Conversation.Id);
						IEnumerable<TeamsChannelAccount> members = channelAccount.AsTeamsChannelAccounts();

						// send a OneToOne message to each member
						foreach (TeamsChannelAccount member in members)
						{
							await EventHelpers.SendOneToOneWelcomeMessage(client, channelData, botAccount, member, tenantId);
						}
					}
					else
					{
						// send a OneToOne message to new member
						await EventHelpers.SendOneToOneWelcomeMessage(client, channelData, botAccount, message.From, tenantId);
					}


					break;
				case TeamEventType.MembersRemoved:
					break;
				case TeamEventType.ChannelCreated:
					break;
				case TeamEventType.ChannelDeleted:
					break;
				case TeamEventType.ChannelRenamed:
					break;
				case TeamEventType.TeamRenamed:
					break;
				default:
					break;
			}

			return null;
		}
	}
}