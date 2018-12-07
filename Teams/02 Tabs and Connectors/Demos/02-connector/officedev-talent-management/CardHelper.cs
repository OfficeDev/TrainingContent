using AdaptiveCards;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Teams.Models;
using Newtonsoft.Json.Linq;
using OfficeDev.Talent.Management;
///
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace officedev_talent_management
{
	public class CardHelper
	{
		/// <summary>
		/// JSON template.
		/// </summary>
		private static string cardJson = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath("~/cardtemplate.json"));

		#region Card Helpers

		public static ThumbnailCard CreateSummaryCardForCandidate(Candidate c)
		{
			ThumbnailCard card = new ThumbnailCard()
			{
				Title = c.Name,
				Subtitle = $"Job ID: {c.ReqId}",
				Text = $"Current role: {c.CurrentRole}<br/> <b>Stage:</b> {c.Stage}<br/> <b>Hire:</b> {c.Hires} <b>No hire:</b> {c.NoHires}",
				Images = new List<CardImage>()
			};

			card.Images.Add(new CardImage(c.ProfilePicture));

			JObject ctx = new JObject();
			ctx["reqId"] = c.ReqId;
			ctx["name"] = c.Name;

			JObject cJson = JObject.FromObject(c);

			card.Buttons = new List<CardAction>()
		{
			new CardAction("messageBack", "See details", null, cJson, "candidate details", $"candidate details {c.Name}"),
			new CardAction("messageBack", "Schedule interview", null, cJson, "schedule interview", $"Schedule interview with {c.Name}"),
			new CardAction("openUrl", "Read feedback", null, "https://www.microsoft.com"),
		};

			return card;
		}

		public static ThumbnailCard CreatePreviewCardForCandidate(Candidate c)
		{
			ThumbnailCard card = new ThumbnailCard()
			{
				Title = c.Name,
				Subtitle = $"Job ID: {c.ReqId}",
				Text = $"Current role: {c.CurrentRole}",
				Images = new List<CardImage>()
			};

			card.Images.Add(new CardImage(c.ProfilePicture));
			return card;
		}

		public static AdaptiveCard CreateFullCardForCandidate(Candidate c)
		{
			AdaptiveCard card = new AdaptiveCard();
			card.Body = new List<AdaptiveElement>();
			AdaptiveContainer header = new AdaptiveContainer();
			card.Body.Add(header);

			header.Items = new List<AdaptiveElement>();
			header.Items.Add(new AdaptiveTextBlock()
			{
				Text = c.Name,
				Weight = AdaptiveTextWeight.Bolder,
				Size = AdaptiveTextSize.Large
			});

			AdaptiveColumnSet headerDetails = new AdaptiveColumnSet();
			header.Items.Add(headerDetails);

			AdaptiveColumn col1 = new AdaptiveColumn();
			col1.Width = AdaptiveColumnWidth.Auto;
			col1.Items = new List<AdaptiveElement>
		{
			new AdaptiveImage()
			{
				Url = new Uri(c.ProfilePicture),
				Size = AdaptiveImageSize.Small,
				Style = AdaptiveImageStyle.Person
			}
		};

			AdaptiveColumn col2 = new AdaptiveColumn();
			col2.Width = AdaptiveColumnWidth.Stretch;
			col2.Items = new List<AdaptiveElement>
		{
			new AdaptiveTextBlock()
			{
				Text = $"Applied {DateTime.Today.ToString("MM/dd/yyyy")}",
				Wrap = true
			},
			new AdaptiveTextBlock()
			{
				Text = $"Current role {c.CurrentRole}",
				Spacing = AdaptiveSpacing.None,
				Wrap = true,
				IsSubtle = true
		}
	};

			headerDetails.Columns = new List<AdaptiveColumn>
		{
			col1,
			col2
		};

			AdaptiveContainer details = new AdaptiveContainer();

			AdaptiveTextBlock candidateSummary = new AdaptiveTextBlock()
			{
				Text = new CandidatesDataController().GetCandidateBio(c),
				Wrap = true
			};

			AdaptiveFactSet factsCol1 = new AdaptiveFactSet();
			factsCol1.Facts = new List<AdaptiveFact>
		{
			new AdaptiveFact("Applied to position", c.ReqId),
			new AdaptiveFact("Interview date", "Not set")
		};

			AdaptiveFactSet factsCol2 = new AdaptiveFactSet();
			factsCol2.Facts = new List<AdaptiveFact>
		{
			new AdaptiveFact("Hires", c.Hires.ToString()),
			new AdaptiveFact("No hires", c.NoHires.ToString())
		};

			AdaptiveColumnSet factColumns = new AdaptiveColumnSet()
			{
				Columns = new List<AdaptiveColumn>
			{
				new AdaptiveColumn()
				{
					Items = new List<AdaptiveElement>
					{
						factsCol1
					},
					Width = AdaptiveColumnWidth.Stretch
				},

				new AdaptiveColumn()
				{
					Items = new List<AdaptiveElement>
					{
						factsCol2
					},
					Width = AdaptiveColumnWidth.Stretch
				}
			}
			};

			details.Items = new List<AdaptiveElement>
		{
			candidateSummary,
			factColumns
		};

			card.Body.Add(details);

			AdaptiveImageSet referrals = new AdaptiveImageSet();
			referrals.ImageSize = AdaptiveImageSize.Small;
			referrals.Images = new List<AdaptiveImage>();

			foreach (Candidate referral in new CandidatesDataController().GetReferrals(c))
			{
				referrals.Images.Add(new AdaptiveImage()
				{
					Url = new Uri(referral.ProfilePicture),
					Style = AdaptiveImageStyle.Person
				});
			}

			card.Body.Add(new AdaptiveTextBlock()
			{
				Text = "Referrals",
				Size = AdaptiveTextSize.Large
			});
			card.Body.Add(referrals);

			AdaptiveAction setInterview = new AdaptiveShowCardAction()
			{
				Title = "Set interview date",
				Card = new AdaptiveCard()
				{
					Body = new List<AdaptiveElement>
				{
					new AdaptiveDateInput()
					{
						Id = "InterviewDate",
						Placeholder = "Enter in a date for the interview"
					}
				},
					Actions = new List<AdaptiveAction>
				{
					new AdaptiveSubmitAction()
					{
						Title = "OK"
					}
				}
				}
			};

			AdaptiveAction setComment = new AdaptiveShowCardAction()
			{
				Title = "Add comment",
				Card = new AdaptiveCard()
				{
					Body = new List<AdaptiveElement>
				{
					new AdaptiveTextInput()
					{
						Id = "Comment",
						Placeholder = "Add a comment for this candidate",
						IsMultiline = true
					}
				},
					Actions = new List<AdaptiveAction>
				{
					new AdaptiveSubmitAction()
					{
						Title = "OK"
					}
				}
				}
			};

			card.Actions = new List<AdaptiveAction>
						{
								setInterview,
								setComment
						};

			return card;
		}

		public static AdaptiveCard CreateCardForNewJobPosting()
		{
			string json = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath("~/newjobpostingtemplate.json"));

			return AdaptiveCard.FromJson(json).Card;
		}

		public static AdaptiveCard CreateExtendedCardForNewJobPosting()
		{
			string json = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath("~/newjobpostingtemplateextended.json"));

			return AdaptiveCard.FromJson(json).Card;
		}

		// Helps create an O365 actionable message for a particular task.
		public static O365ConnectorCard CreateCardForInterviewRequest(InterviewRequest request)
		{
			var random = new Random();

			O365ConnectorCard actionableCard = new O365ConnectorCard()
			{
				Sections = new List<O365ConnectorCardSection>()
			};

			O365ConnectorCardSection section = new O365ConnectorCardSection()
			{
				ActivityTitle = request.Candidate.Name,
				ActivitySubtitle = $"For position: {request.PositionTitle}",
				ActivityText = $"Req ID: {request.ReqId}",
				ActivityImage = request.Candidate.ProfilePicture,
				PotentialAction = new List<O365ConnectorCardActionBase>()
			};

			// Add a more complex form action
			O365ConnectorCardActionCard updateDateAction = new O365ConnectorCardActionCard(type: "ActionCard")
			{
				Id = "updateInterviewDate",
				Name = "Set interview date",
				Actions = new List<O365ConnectorCardActionBase>(),
				Inputs = new List<O365ConnectorCardInputBase>()
			};

			dynamic actionBody = new
			{
				reqId = request.ReqId,
				name = request.Candidate.Name,
				date = "{{interviewDate.value}}"
			};

			updateDateAction.Actions.Add(new O365ConnectorCardHttpPOST("HttpPOST", "Schedule", "scheduleInterview", Newtonsoft.Json.JsonConvert.SerializeObject(actionBody)));
			updateDateAction.Inputs.Add(new O365ConnectorCardDateInput("DateInput", "interviewDate", false, "Interview date", new DateTime(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day).ToString("MMM d, yyyy"), false));
			section.PotentialAction.Add(updateDateAction);

			actionableCard.Sections.Add(section);

			return actionableCard;
		}

		// Helps create a simple thumbnail card for a task
		public static ThumbnailCard CreateCardForPosition(OpenPosition position, bool includeButtons = false)
		{
			var random = new Random();

			ThumbnailCard card = new ThumbnailCard()
			{
				Title = position.Title,
				Subtitle = $"Applicants: {position.Applicants}  Days open: {position.DaysOpen} Hiring manager: {position.HiringManager}",
				Text = $"Req ID: {position.ReqId}",
			};

			if (includeButtons)
			{
				card.Buttons = new List<CardAction>()
			{
				new CardAction("openUrl", "See details", null, "https://hr.contoso.com"),
				new CardAction("messageBack", "Update status", null, position.ReqId, "update position", $"Update position status for {position.ReqId}"),
			};
			}

			return card;
		}

		#endregion
	}
}