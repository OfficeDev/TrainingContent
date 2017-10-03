using System;
//using System.Threading;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Teams;

namespace teams_bot2.Dialogs
{
	[Serializable]
	public class RootDialog : IDialog<IMessageActivity>
	{
		public async Task StartAsync(IDialogContext context)
		{
			context.Wait(MessageReceivedAsync);
		}

		public virtual async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
		{
			var activity = await result as Activity;

			if (activity.GetTextWithoutMentions().ToLower().Trim() == "ping")
			{
				ConnectorClient connector = new ConnectorClient(new Uri(activity.ServiceUrl));
				Activity reply = activity.CreateReply();
				//reply = reply.AddMentionToText(activity.From, MentionTextLocation.PrependText);
				reply.NotifyUser();
				reply.Summary = "One ping only, please.";
				reply.Text += "Give me a ping, Vasili. One ping only, please.";
				await connector.Conversations.ReplyToActivityAsync(reply);
			}
			else if (activity.Text.ToLower().Contains("card"))
			{
				//await Conversation.SendAsync(activity, () => new Dialogs.CardsDialog());
				await context.Forward(new Dialogs.CardsDialog(), this.ResumeAfterCardsDialog, activity, CancellationToken.None);
			}
			else
			{
				// calculate something for us to return
				int length = (activity.Text ?? string.Empty).Length;

				ConnectorClient connector = new ConnectorClient(new Uri(activity.ServiceUrl));
				Activity reply = activity.CreateReply($"You sent {activity.Text} which was {activity.Text.Length} characters");
				var msgToUpdate = await connector.Conversations.ReplyToActivityAsync(reply);

				// Simulate external activity
				System.Threading.Thread.Sleep(5000);

				var withoutMentions = activity.GetTextWithoutMentions();

				Activity updatedReply = activity.CreateReply($"Actually, removing the @ mention, it was {withoutMentions.Length} characters");
				await connector.Conversations.UpdateActivityAsync(reply.Conversation.Id, msgToUpdate.Id, updatedReply);
			}
		}

		private async Task ResumeAfterCardsDialog(IDialogContext context, IAwaitable<IMessageActivity> result)
		{
			context.Wait(this.MessageReceivedAsync);
		}
	}
}