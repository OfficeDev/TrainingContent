public class BotChannel
{
  public string Title { get; set; }
  public string LogoUrl { get; set; }
}

public class BotChannels
{
  public static List<BotChannel> GetBotChannels()
  {
    var data = new List<BotChannel>();
    data.Add(new BotChannel { Title = "Bing", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/bing.png" });
    data.Add(new BotChannel { Title = "Cortana", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/cortana.png" });
    data.Add(new BotChannel { Title = "Direct Line", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/directline.png" });
    data.Add(new BotChannel { Title = "Email", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/email.png" });
    data.Add(new BotChannel { Title = "Facebook Messenger", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/facebook.png" });
    data.Add(new BotChannel { Title = "GroupMe", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/groupme.png" });
    data.Add(new BotChannel { Title = "Kik", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/kik.png" });
    data.Add(new BotChannel { Title = "Microsoft Teams", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/msteams.png" });
    data.Add(new BotChannel { Title = "Skype", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/skype.png" });
    data.Add(new BotChannel { Title = "Skype for Business", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/skypeforbusiness.png" });
    data.Add(new BotChannel { Title = "Slack", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/slack.png" });
    data.Add(new BotChannel { Title = "Telegram", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/telegram.png" });
    data.Add(new BotChannel { Title = "Twilio (SMS)", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/sms.png" });
    data.Add(new BotChannel { Title = "Web Chat", LogoUrl = "https://dev.botframework.com/client/images/channels/icons/webchat.png" });
    return data;
  }
}