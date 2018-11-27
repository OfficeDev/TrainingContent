using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Teams.Models;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
/////
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using OfficeDev.Talent.Management;
using AdaptiveCards;

namespace officedev_talent_management
{
	public class CommandHandlers
	{
		#region HandleScheduleCommand

		public static async Task HandleScheduleCommand(IDialogContext context, Activity activity, string[] keywords)
		{
			JObject ctx = activity.Value as JObject;

			// Check if this is a button press or a text command.
			if (ctx != null)
			{
				JObject scheduleRequest = JObject.Parse((string)ctx["body"]);
				DateTime scheduleDate = DateTime.Parse((string)scheduleRequest["date"]);

				// make call to the Microsoft Graph to schedule the interview

				await MessageHelpers.SendMessage(context, $"Interview scheduled for position {scheduleRequest["reqId"]} with {scheduleRequest["name"]} on {scheduleDate.ToShortDateString()}");
			}
			else if (keywords.Length == 3)
			{
				string name = string.Join(" ", keywords.Take(2).ToArray());
				string reqId = keywords[2];

				// Takes 3 parameters: first name, last name, and then req ID
				await SendScheduleInterviewMessage(context, name, reqId);
			}
			else
			{
				await MessageHelpers.SendMessage(context, MessageHelpers.CreateHelpMessage("I'm sorry, I did not understand you :("));
			}
		}

		private static async Task SendScheduleInterviewMessage(IDialogContext context, string name, string reqId)
		{
			OfficeDev.Talent.Management.InterviewRequest request = new OfficeDev.Talent.Management.InterviewRequest
			{
				Candidate = new OfficeDev.Talent.Management.CandidatesDataController().GetCandidateByName(name),
				Date = new DateTime(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day),
				PositionTitle = new OfficeDev.Talent.Management.OpenPositionsDataController().GetPositionForReqId(reqId).Title,
				Remote = false,
				ReqId = reqId
			};

			IMessageActivity reply = context.MakeMessage();
			reply.Attachments = new List<Attachment>();
			reply.Text = $"Here's your request to schedule an interview:";

			O365ConnectorCard card = CardHelper.CreateCardForInterviewRequest(request);
			reply.Attachments.Add(card.ToAttachment());

			ConnectorClient client = new ConnectorClient(new Uri(context.Activity.ServiceUrl));
			ResourceResponse resp = await client.Conversations.ReplyToActivityAsync((Activity)reply);
		}

		#endregion

		#region HandleOpenCommand

		public static async Task HandleOpenCommand(IDialogContext context)
		{
			var openPositions = new OpenPositionsDataController().ListOpenPositions(5);

			IMessageActivity reply = context.MakeMessage();
			reply.Attachments = new List<Attachment>();
			reply.Text = $"Hi {context.Activity.From.Name}! You have {openPositions.Count} active postings right now:";

			foreach (OpenPosition position in openPositions)
			{
				ThumbnailCard card = CardHelper.CreateCardForPosition(position);
				reply.Attachments.Add(card.ToAttachment());
			}

			ThumbnailCard buttonsCard = new ThumbnailCard();

			buttonsCard.Buttons = new List<CardAction>()
						{
								new CardAction("openUrl", "View details", null, "https://www.microsoft.com"),
								new CardAction("messageBack", "Add new job posting", null, null, $"new job posting", "New job posting")
						};
			reply.Attachments.Add(buttonsCard.ToAttachment());
			await context.PostAsync(reply);
		}

		#endregion

		#region HandleCandidateCommand

		public static async Task HandleCandidateCommand(IDialogContext context, Activity activity, string[] keywords)
		{
			// Supports either structured query or via user input.
			JObject ctx = activity.Value as JObject;
			Candidate c = null;

			if (ctx != null)
			{
				c = ctx.ToObject<Candidate>();
				await SendCandidateDetailsMessage(context, c);
			}
			else if (keywords.Length > 0)
			{
				string name = string.Join(" ", keywords);
				c = new CandidatesDataController().GetCandidateByName(name);
				await SendCandidateDetailsMessage(context, c);
			}
		}

		private static async Task SendCandidateDetailsMessage(IDialogContext context, Candidate c)
		{
			IMessageActivity reply = context.MakeMessage();
			reply.Attachments = new List<Attachment>();

			AdaptiveCard card = CardHelper.CreateFullCardForCandidate(c);
			Attachment attachment = new Attachment()
			{
				ContentType = AdaptiveCard.ContentType,
				Content = card
			};

			reply.Attachments.Add(attachment);
			System.Diagnostics.Debug.WriteLine(card.ToJson());

			await context.PostAsync(reply);
		}

		#endregion

		#region HandleNewCommand

		public static async Task HandleNewCommand(IDialogContext context)
		{
			await SendCreateNewJobPostingMessage(context);
		}

		private static async Task SendCreateNewJobPostingMessage(IDialogContext context)
		{
			IMessageActivity reply = context.MakeMessage();
			reply.Attachments = new List<Attachment>();

			AdaptiveCard card = CardHelper.CreateCardForNewJobPosting();
			Attachment attachment = new Attachment()
			{
				ContentType = AdaptiveCard.ContentType,
				Content = card
			};

			reply.Attachments.Add(attachment);

			await context.PostAsync(reply);
		}

		#endregion

		#region HandleAssignCommand

		public static async Task HandleAssignCommand(IDialogContext context, string[] split)
		{
			string guid = split[1];
			await UpdateMessage(context, guid);
		}

		private static async Task UpdateMessage(IDialogContext context, string taskItemGuid)
		{
			Tuple<string, ThumbnailCard> cachedMessage;

			//Retrieve passed task guid from the ConversationData cache
			if (context.ConversationData.TryGetValue("task " + taskItemGuid, out cachedMessage))
			{
				IMessageActivity reply = context.MakeMessage();
				reply.Attachments = new List<Attachment>();

				string activityId = cachedMessage.Item1;
				ThumbnailCard card = cachedMessage.Item2;

				card.Subtitle = $"Assigned to: {context.Activity.From.Name}";

				card.Buttons = new List<CardAction>()
								{
										new CardAction("openUrl", "View task", null, "https://www.microsoft.com"),
										new CardAction("openUrl", "Update details", null, "https://www.microsoft.com")
								};

				reply.Attachments.Add(card.ToAttachment());
				await context.PostAsync(reply);
			}
			else
			{
				System.Diagnostics.Debug.WriteLine($"Could not update task {taskItemGuid}");
			}
		}

		#endregion
	}
}