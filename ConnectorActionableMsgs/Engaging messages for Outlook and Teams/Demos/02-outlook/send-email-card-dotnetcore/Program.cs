using System.Collections.Generic;
using System.Security;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using Microsoft.Graph;
using Microsoft.Extensions.Configuration;
using Helpers;
using System;

namespace graphconsoleapp
{
  class Program
  {
    static void Main(string[] args)
    {
      var config = LoadAppSettings();
      if (config == null)
      {
        Console.WriteLine("Invalid appsettings.json file.");
        return;
      }

      var userName = ReadUsername();
      var userPassword = ReadPassword();

      var client = GetAuthenticatedGraphClient(config, userName, userPassword);

      SendEmail(client, userName).Wait();
      Console.WriteLine("\nEmail sent.");
    }

    private static IConfigurationRoot LoadAppSettings()
    {
      try
      {
        var config = new ConfigurationBuilder()
                          .SetBasePath(System.IO.Directory.GetCurrentDirectory())
                          .AddJsonFile("appsettings.json", false, true)
                          .Build();

        if (string.IsNullOrEmpty(config["applicationId"]) ||
            string.IsNullOrEmpty(config["tenantId"]))
        {
          return null;
        }

        return config;
      }
      catch (System.IO.FileNotFoundException)
      {
        return null;
      }
    }

    private static IAuthenticationProvider CreateAuthorizationProvider(IConfigurationRoot config, string userName, SecureString userPassword)
    {
      var clientId = config["applicationId"];
      var authority = $"https://login.microsoftonline.com/{config["tenantId"]}/v2.0";

      List<string> scopes = new List<string>();
      scopes.Add("User.Read");
      scopes.Add("Mail.Send");

      var cca = PublicClientApplicationBuilder.Create(clientId)
                                              .WithAuthority(authority)
                                              .Build();
      return MsalAuthenticationProvider.GetInstance(cca, scopes.ToArray(), userName, userPassword);
    }

    private static GraphServiceClient GetAuthenticatedGraphClient(IConfigurationRoot config, string userName, SecureString userPassword)
    {
      var authenticationProvider = CreateAuthorizationProvider(config, userName, userPassword);
      var graphClient = new GraphServiceClient(authenticationProvider);
      return graphClient;
    }

    private static SecureString ReadPassword()
    {
      Console.WriteLine("Enter your password");
      SecureString password = new SecureString();
      while (true)
      {
        ConsoleKeyInfo c = Console.ReadKey(true);
        if (c.Key == ConsoleKey.Enter)
        {
          break;
        }
        password.AppendChar(c.KeyChar);
        Console.Write("*");
      }
      Console.WriteLine();
      return password;
    }

    private static string ReadUsername()
    {
      string username;
      Console.WriteLine("Enter your username");
      username = Console.ReadLine();
      return username;
    }

    private static async Task SendEmail(GraphServiceClient client, string email)
    {
      // create email
      Message emailMessage = new Message()
      {
        Subject = "Webinar followup feedback request",
        ToRecipients = new List<Recipient>() {
      new Recipient() {
        EmailAddress = new EmailAddress() { Address = email}
      }
    },
        Body = new ItemBody()
        {
          ContentType = BodyType.Html,
          Content = LoadCardMessageBody()
        }
      };

      // send email
      await client.Me.SendMail(emailMessage, true).Request().PostAsync();
    }

    private static string LoadCardMessageBody()
    {
      // load message body
      string messageBody = System.IO.File.ReadAllText(@"email-body.html");

      // load adaptive card
      string cardJson = System.IO.File.ReadAllText(@"adaptive-card.json");

      // merge card JSON into email message body
      return string.Format(messageBody, cardJson);
    }
  }
}