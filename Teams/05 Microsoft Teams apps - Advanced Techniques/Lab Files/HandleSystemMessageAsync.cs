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
						IList<ChannelAccount> channelAccount = await client.Conversations.GetConversationMembersAsync(message.Conversation.Id);
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
