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
    sb.AppendLine("* Schedule interview for name and Req ID, for example: schedule interview John Smith 0F812D01");
    return sb.ToString();
  }

  public static async Task SendOneToOneWelcomeMessage(
    ConnectorClient client,
    TeamsChannelData channelData,
    ChannelAccount botAccount, ChannelAccount userAccount,
    string tenantId)
  {
    string welcomeMessage = CreateHelpMessage($"The team {channelData.Team.Name} has the Talent Management bot- helping your team to find and hire candidates.");

    // create or get existing chat conversation with user
    var response = client.Conversations.CreateOrGetDirectConversation(botAccount, userAccount, tenantId);

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
    await client.Conversations.SendToConversationAsync(newActivity);
  }
}
