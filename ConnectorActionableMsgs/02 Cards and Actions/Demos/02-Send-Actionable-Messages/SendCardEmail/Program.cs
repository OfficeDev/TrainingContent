/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net.Http.Headers;
using System.Threading.Tasks;

using Microsoft.Identity.Client;
using Microsoft.Graph;
using OfficeDev.TrainingContent.SendEmailCard;

namespace OfficeDev.TrainingContent.SendCardEmail
{
  class Program
  {
    static IPublicClientApplication authClient = null;
    static readonly string[] scopes =
    {
      "User.Read", // Scope needed to read /Me from Graph (to get email address)
      "Mail.Send"  // Scope needed to send mail as the user
    };

    static void Main(string[] args)
    {
      var valid = true;
      string validationMessage = string.Empty;

      if (args.Length != 2)
      {
        valid = false;
        validationMessage = "Missing argument";
      }

      if (valid && args[0] != "actionable" && args[0] != "adaptive")
      {
        valid = false;
        validationMessage = "arg[0] not valid";
      }

      if (valid && !System.IO.File.Exists(args[1]))
      {
        valid = false;
        validationMessage = "card_json_file not found";
      }

      if (valid)
      {
        SendMessage(args).Wait();
      }
      else
      {
        Output.WriteLine(Output.Error, $"Invalid args: {validationMessage}");
        Output.WriteLine(Output.Info, "Usage: SendActionableEmail.exe actionable|adaptive path_to_card_json");
      }

      Console.WriteLine("Hit any key to exit...");
      Console.ReadKey();
    }

    static async Task SendMessage(string[] args)
    {
      var clientId = ConfigurationManager.AppSettings.Get("applicationId");
      var tenantId = ConfigurationManager.AppSettings.Get("tenantId");

      // Setup MSAL client

      authClient = PublicClientApplicationBuilder.Create(clientId)
        .WithAuthority(AzureCloudInstance.AzurePublic, tenantId)
        .WithRedirectUri("https://login.microsoftonline.com/common/oauth2/nativeclient")
        .Build();

      try
      {
        // Get the access token
        var result = await authClient
          .AcquireTokenInteractive(scopes)
          .ExecuteAsync();

        // Initialize Graph client with delegate auth provider
        // that just returns the token we already retrieved
        GraphServiceClient graphClient = new GraphServiceClient(
            new DelegateAuthenticationProvider(
                (requestMessage) =>
                {
                  requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
                  return Task.FromResult(0);
                }));

        // Create a recipient for the authenticated user
        Microsoft.Graph.User me = await graphClient.Me.Request().GetAsync();
        Recipient toRecip = new Recipient()
        {
          EmailAddress = new EmailAddress() { Address = me.Mail }
        };

        // Create the message
        Message adaptiveCardMessage = new Message()
        {
          Subject = "TrainingContent Actionable Message",
          ToRecipients = new List<Recipient>() { toRecip },
          Body = new ItemBody()
          {
            ContentType = BodyType.Html,
            Content = LoadCardMessageBody(args[0], args[1])
          }
        };

        // Send the message
        await graphClient.Me.SendMail(adaptiveCardMessage, true).Request().PostAsync();

        Output.WriteLine(Output.Success, "Message sent");
      }
      catch (MsalException ex)
      {
        Output.WriteLine(Output.Error, "An exception occurred while acquiring an access token.");
        Output.WriteLine(Output.Error, "  Code: {0}; Message: {1}", ex.ErrorCode, ex.Message);
      }
      catch (Microsoft.Graph.ServiceException graphEx)
      {
        Output.WriteLine(Output.Error, "An exception occurred while making a Graph request.");
        Output.WriteLine(Output.Error, "  Code: {0}; Message: {1}", graphEx.Error.Code, graphEx.Message);
      }
    }

    static string LoadCardMessageBody(string cardType, string filepath)
    {
      string messageBody = string.Empty;

      if (cardType == "adaptive")
      {
        messageBody = System.IO.File.ReadAllText(@"AdaptiveMessageBody.html");
      }
      else
      {
        messageBody = System.IO.File.ReadAllText(@"ActionableMessageBody.html");
      }

      string cardJson = System.IO.File.ReadAllText(filepath);

      // Insert the JSON into the HTML
      return string.Format(messageBody, cardJson);
    }
  }
}
