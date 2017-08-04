using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Teams;
using Microsoft.Bot.Connector.Teams.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace teams_bot2
{
	public class ComposeHelpers
	{
		public static async Task<string> HandleInvoke(Activity activity)
		{
			// these are the values specified in manifest.json
			string COMMANDID = "searchCmd";
			string PARAMNAME = "searchText";

			if (!activity.IsComposeExtensionQuery())
			{
				return null;
			}

			// This helper method gets the query as an object.
			var query = activity.GetComposeExtensionQueryData();
			if (query.CommandId == null || query.Parameters == null)
			{
				return null;
			}


			if (query.CommandId != COMMANDID)
			{
				return null;
			}

			var param = query.Parameters.FirstOrDefault(p => p.Name.Equals(PARAMNAME)).Value.ToString();
			if (String.IsNullOrEmpty(param))
			{
				return null;
			}

			// This is the response object that will get sent back to the compose extension request.
			ComposeExtensionResponse invokeResponse = null;

			// search our data
			var data = BotChannels.GetBotChannels();
			var resultData = data.Where(t => t.Title.IndexOf(param, StringComparison.InvariantCultureIgnoreCase) >= 0).ToList();

			// format the results
			var results = new ComposeExtensionResult()
			{
				AttachmentLayout = "list",
				Type = "result",
				Attachments = new List<ComposeExtensionAttachment>(),
			};

			foreach (var resultDataItem in resultData)
			{
				var card = new ThumbnailCard()
				{
					Title = resultDataItem.Title,
					Images = new List<CardImage>() { new CardImage() { Url = resultDataItem.LogoUrl } }
				};

				var composeExtensionAttachment = card.ToAttachment().ToComposeExtensionAttachment();
				results.Attachments.Add(composeExtensionAttachment);
			}

			invokeResponse = new ComposeExtensionResponse();
			invokeResponse.ComposeExtension = results;

			string response = String.Empty;
			try
			{
				response = Newtonsoft.Json.JsonConvert.SerializeObject(invokeResponse);
			}
			catch (Exception ex)
			{
				response = ex.ToString();
			}
			return response;
		}

	}
}
