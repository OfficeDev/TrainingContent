using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Teams.Models;
using System.Text;
using System.Threading.Tasks;

namespace officedev_talent_management
{
	public class MessageHelpers
	{
		public static string CreateHelpMessage(string firstLine)
		{
			var sb = new StringBuilder();
			sb.AppendLine(firstLine);
			sb.AppendLine();
			sb.AppendLine("Here's what I can help you do:");
			sb.AppendLine();
			sb.AppendLine("* Create a new job posting");
			sb.AppendLine("* List all your open positions");
			sb.AppendLine("* Show top recent candidates for a Req ID, for example: top candidates 0F812D01");
			sb.AppendLine("* Show details about a candidate, for example: candidate details John Smith 0F812D01");
			sb.AppendLine("* Get a résumé for a candidate, for example: resume John Smith");
			sb.AppendLine("* Schedule interview for name and Req ID, for example: schedule interview John Smith 0F812D01");
			return sb.ToString();
		}
		public static async Task SendMessage(IDialogContext context, string message)
		{
			await context.PostAsync(message);
		}

		public static async Task SendOneToOneWelcomeMessage(
			ConnectorClient connector, TeamsChannelData channelData,
			ChannelAccount botAccount, ChannelAccount userAccount,
			string tenantId)
		{
			string welcomeMessage = CreateHelpMessage($"The team {channelData.Team.Name} has the Talent Management bot- helping your team to find and hire candidates.");

			// create or get existing chat conversation with user
			var response = connector.Conversations.CreateOrGetDirectConversation(botAccount, userAccount, tenantId);

			// Construct the message to post to conversation
			Activity newActivity = new Activity()
			{
				Text = welcomeMessage,
				Type = ActivityTypes.Message,
				Conversation = new ConversationAccount
				{
					Id = response.Id
				},
			};

			// Post the message to chat conversation with user
			await connector.Conversations.SendToConversationAsync(newActivity);
		}

		public static async Task SendPriorityMessage(
			string messageText, string messageSummary,
			ConnectorClient connector,
			ChannelAccount botAccount, ChannelAccount userAccount,
			string tenantId)
		{
			// create or get existing chat conversation with user
			var response = connector.Conversations.CreateOrGetDirectConversation(botAccount, userAccount, tenantId);

			// Construct the message to post to conversation
			Activity newActivity = new Activity()
			{
				Text = messageText,
				Summary = messageSummary,
				Type = ActivityTypes.Message,
				Conversation = new ConversationAccount
				{
					Id = response.Id
				},
				DeliveryMode = "notification"
			};

			// Post the message to chat conversation with user
			await connector.Conversations.SendToConversationAsync(newActivity);

		}

	}
}