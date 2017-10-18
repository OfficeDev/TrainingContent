using Microsoft.Bot.Connector.Teams;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace teams_bot2.Dialogs
{
	[Serializable]
	public class CardsDialog : IDialog<IMessageActivity>
	{
		private const string HeroCard = "Hero card";
		private const string ThumbnailCard = "Thumbnail card";

		private IEnumerable<string> options = new List<string> { HeroCard, ThumbnailCard };

		public async Task StartAsync(IDialogContext context)
		{
			context.Wait(this.MessageReceivedAsync);
		}

		public virtual async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
		{
			var message = await result as Activity;

			string cardName = message.GetTextWithoutMentions().Trim().ToLower();
			if (cardName== HeroCard.ToLower())
			{
				await DisplaySelectedCard(context, HeroCard);
			}
			else if (cardName == ThumbnailCard.ToLower())
			{
				await DisplaySelectedCard(context, ThumbnailCard);
			}
			else
			{
				var reply = context.MakeMessage();
				reply.Text = "I don't support that kind of card.";
				await context.PostAsync(reply);
				context.Done(reply);
			}
		}

		public async Task DisplaySelectedCard(IDialogContext context, string selectedCard)
		{
			var message = context.MakeMessage();
			var attachment = GetSelectedCard(selectedCard);
			message.Attachments.Add(attachment);

			await context.PostAsync(message);

			context.Done(message);

			//context.Wait(this.MessageReceivedAsync);
		}

		private static Attachment GetSelectedCard(string selectedCard)
		{
			switch (selectedCard)
			{
				case HeroCard:
					return GetHeroCard();
				case ThumbnailCard:
					return GetThumbnailCard();
				default:
					return GetHeroCard();
			}
		}

		private static Attachment GetHeroCard()
		{
			var heroCard = new HeroCard
			{
				Title = "BotFramework Hero Card",
				Subtitle = "Your bots — wherever your users are talking",
				Text = "Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.",
				Images = new List<CardImage> { new CardImage("https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg") },
				Buttons = new List<CardAction> { new CardAction(ActionTypes.OpenUrl, "Get Started", value: "https://docs.microsoft.com/bot-framework") }
			};
			return heroCard.ToAttachment();
		}

		private static Attachment GetThumbnailCard()
		{
			var thumbnailCard = new ThumbnailCard
			{
				Title = "BotFramework Thumbnail Card",
				Subtitle = "Your bots — wherever your users are talking",
				Text = "Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.",
				Images = new List<CardImage> { new CardImage("https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg") },
				Buttons = new List<CardAction> { new CardAction(ActionTypes.OpenUrl, "Get Started", value: "https://docs.microsoft.com/bot-framework") }
			};
			return thumbnailCard.ToAttachment();
		}
	}
}