using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Teams;
using Microsoft.Bot.Connector.Teams.Models;
using Newtonsoft.Json.Linq;
using OfficeDev.Talent.Management;
using System.Globalization;
using System.Threading.Tasks;
/////////
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace officedev_talent_management
{
	public class MessagingExtensionHelper
	{
		public static async Task<ComposeExtensionResponse> CreateResponse(Activity activity)
		{
			ComposeExtensionResponse response = null;

			var query = activity.GetComposeExtensionQueryData();
			JObject data = activity.Value as JObject;

			//Check to make sure a query was actually made:
			if (query.CommandId == null || query.Parameters == null)
			{
				return null;
			}
			else if (query.Parameters.Count > 0)
			{
				// query.Parameters has the parameters sent by client
				var results = new ComposeExtensionResult()
				{
					AttachmentLayout = "list",
					Type = "result",
					Attachments = new List<ComposeExtensionAttachment>(),
				};

				if (query.CommandId == "searchPositions")
				{
					OpenPositionsDataController controller = new OpenPositionsDataController();
					IEnumerable<OpenPosition> positions;

					if (query.Parameters[0].Name == "initialRun")
					{
						// Default query => list all
						positions = controller.ListOpenPositions(10);
					}
					else
					{
						// Basic search.
						string title = query.Parameters[0].Value.ToString().ToLower();
						positions = controller.ListOpenPositions(10).Where(x => x.Title.ToLower().Contains(title));
					}

					// Generate cards for the response.
					foreach (OpenPosition pos in positions)
					{
						var card = CardHelper.CreateCardForPosition(pos, true);

						var composeExtensionAttachment = card.ToAttachment().ToComposeExtensionAttachment();
						results.Attachments.Add(composeExtensionAttachment);
					}
				}
				else if (query.CommandId == "searchCandidates")
				{
					string name = query.Parameters[0].Value.ToString();
					CandidatesDataController controller = new CandidatesDataController();

					foreach (Candidate c in controller.GetTopCandidates("ABCD1234"))
					{
						c.Name = c.Name.Split(' ')[0] + " " + CultureInfo.CurrentCulture.TextInfo.ToTitleCase(name);
						var card = CardHelper.CreateSummaryCardForCandidate(c);

						var composeExtensionAttachment = card.ToAttachment().ToComposeExtensionAttachment(CardHelper.CreatePreviewCardForCandidate(c).ToAttachment());
						results.Attachments.Add(composeExtensionAttachment);
					}
				}

				response = new ComposeExtensionResponse()
				{
					ComposeExtension = results
				};
			}

			return response;
		}
	}
}