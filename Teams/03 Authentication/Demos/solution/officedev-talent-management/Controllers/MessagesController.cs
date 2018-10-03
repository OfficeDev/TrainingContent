using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Teams;
using Microsoft.Bot.Connector.Teams.Models;
using Polly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace officedev_talent_management
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
      if (activity.GetActivityType() == ActivityTypes.Message)
      {
        await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
      }
      else if (activity.Type == ActivityTypes.Invoke)
      {
        if (activity.Name == "fileConsent/invoke")
        {
          await HandleFileConsentActivity(activity);
        }
        else if (activity.IsO365ConnectorCardActionQuery())
        {
          Newtonsoft.Json.Linq.JObject ctx = activity.Value as Newtonsoft.Json.Linq.JObject;
          if ((string)ctx["actionId"] == "scheduleInterview")
          {
            activity.Text = "schedule interview invoke";
            await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
          }
        }
        else if (activity.IsComposeExtensionQuery())
        {
          // Determine the response object to reply with
          var invokeResponse = await MessagingExtensionHelper.CreateResponse(activity);

          // Messaging Extensions require the response body to have the response data
          // explicitly return the response rather that falling thru to the default return
          return Request.CreateResponse(HttpStatusCode.OK, invokeResponse);
        }
        // Send teams Invoke along to the Dialog stack
        else if (activity.IsTeamsVerificationInvoke())
        {
          await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
        }
      }
      else
      {
        await HandleSystemMessageAsync(activity);
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
          var connector = new ConnectorClient(new Uri(message.ServiceUrl));
          connector.SetRetryPolicy(
            RetryHelpers.DefaultPolicyBuilder.WaitAndRetryAsync(
              new[] { TimeSpan.FromSeconds(2),
                      TimeSpan.FromSeconds(5),
                      TimeSpan.FromSeconds(10) })
          );

          var tenantId = message.GetTenantId();
          var channelData = message.GetChannelData<TeamsChannelData>();
          var botAccount = message.Recipient;

          // if the bot is in the collection of added members,
          // then send a welcometo all team members
          if (message.MembersAdded.Any(m => m.Id.Equals(botAccount.Id)))
          {
            // Fetch the members in the current conversation
            IList<ChannelAccount> channelAccount =
              await connector.Conversations.GetConversationMembersAsync(
                message.Conversation.Id);
            IEnumerable<TeamsChannelAccount> members =
              channelAccount.AsTeamsChannelAccounts();

            // send a OneToOne message to each member
            foreach (TeamsChannelAccount member in members)
            {
              await MessageHelpers.SendOneToOneWelcomeMessage(
                connector, channelData, botAccount, member, tenantId);
            }
          }
          else
          {
            string messageText = MessageHelpers.CreateHelpMessage($"The team {channelData.Team.Name} has the Talent Management bot- helping your team to find and hire candidates.");
            string messageSummary = "This team has the Talent Management bot";
            // send a OneToOne message to new members
            foreach (TeamsChannelAccount member in message.MembersAdded.AsTeamsChannelAccounts())
            {
              await MessageHelpers.SendPriorityMessage(messageText, messageSummary,
                connector, botAccount, member, tenantId);
            }
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

    private async Task HandleFileConsentActivity(Activity activity)
    {
      Activity reply;
      try
      {
        reply = await FileHelpers.ProcessFileConsentResponse(activity.Value);
      }
      catch (Exception ex)
      {
        reply = new Activity { Text = ex.ToString() };
      }

      // Production bot would retrieve the message containing the FileConsent card and update it with results.
      // This would prevent the user from consenting again
      //
      //var consentMessageReplyConversationId  = <read from state>
      //var consentMessageReplyId = <read from state>
      //Activity updatedReply = activity.CreateReply(messageText);
      //await connector.Conversations.UpdateActivityAsync(consentMessageReplyConversationId, consentMessageReplyId, updatedReply);

      // sending files happens in personal scope, so send a 1:1 message
      var user = activity.From;
      var bot = activity.Recipient;
      var connector = new ConnectorClient(new Uri(activity.ServiceUrl));
      var tenantId = activity.GetTenantId();

      try
      {
        // create or get existing chat conversation with user
        var response = connector.Conversations.CreateOrGetDirectConversation(bot, user, tenantId);

        reply.Conversation = new ConversationAccount { Id = response.Id };

      }
      catch (Exception ex)
      {
        var paul = ex.Message;
      }
      // Post the message to chat conversation with user
      await connector.Conversations.SendToConversationAsync(reply);
    }
  }
}