using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Teams;
using Microsoft.Bot.Connector.Teams.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace officedev_talent_management.Dialogs
{
  [Serializable]
  public class RootDialog : IDialog<object>
  {
    public Task StartAsync(IDialogContext context)
    {
      context.Wait(MessageReceivedAsync);

      return Task.CompletedTask;
    }

    private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
    {
      var activity = await result as Activity;

      // Strip out all mentions.  As all channel messages to a bot must @mention the bot itself, you must strip out the bot name at minimum.
      // This uses the extension SDK function GetTextWithoutMentions() to strip out ALL mentions
      var text = activity.GetTextWithoutMentions();

      if (text == null && (activity.Attachments != null && activity.Attachments.Count == 0))
      {
        // if the activity is not a system event, and it does not have text or attachment, treat it as a SubmitAction
        //await HandleSubmitAction(context, activity);
      }
      else
      {
        #region Receive file
        // If a file was sent, echo back its name try to read it.
        if (activity.Attachments != null && activity.Attachments.Count > 0)
        {
          foreach (var attachment in activity.Attachments)
          {
            if (attachment.ContentType == FileDownloadInfo.ContentType)
            {
              //await context.PostAsync($"Received a file named {attachment.Name}");
              await FileHelpers.ProcessAttachment(attachment, context);
            }
          }
        }
        #endregion

        if (!String.IsNullOrEmpty(text))
        {
          // Check for suppported commands
          // This simple text parsing assumes the command is the first two tokens,
          // and parameters are the remainder.
          var split = text.Split(' ');
          // The user is asking for one of the supported commands.
          if (split.Length >= 2)
          {
            var cmd = split[0].ToLower();
            var keywords = split.Skip(2).ToArray();

            #region Commands

            if (cmd.Contains("resume"))
            {
              // Return "resume file" for the given candidate name.
              await HandleResumeCommand(context, keywords);
            }
            else if (cmd.Contains("schedule"))
            {
              await CommandHandlers.HandleScheduleCommand(context, activity, keywords);
            }
            else if (cmd.Contains("open"))
            {
              await CommandHandlers.HandleOpenCommand(context);
            }
            else if (cmd.Contains("candidate"))
            {
              await CommandHandlers.HandleCandidateCommand(context, activity, keywords);
            }
            else if (cmd.Contains("new"))
            {
              await CommandHandlers.HandleNewCommand(context);
            }
            else if (cmd.Contains("assign"))
            {
              await CommandHandlers.HandleAssignCommand(context, split);
            }

            #endregion

          }
          else if (text.Contains("help"))
          {
            // Respond with standard help message.
            await MessageHelpers.SendMessage(context, MessageHelpers.CreateHelpMessage("Sure, I can provide help info about me."));
          }
          else if (text.Contains("profile"))
          {
            await CommandHandlers.HandleProfileCommand(context);
            return;
          }
          else if (text.Contains("welcome") || text.Contains("hello") || text.Contains("hi"))
          {
            await MessageHelpers.SendMessage(context, MessageHelpers.CreateHelpMessage("## Welcome to the Contoso Talent Management app"));
          }
          else
          // Don't know what to say so this is the generic handling here.
          {
            await MessageHelpers.SendMessage(context, MessageHelpers.CreateHelpMessage("I'm sorry, I did not understand you :("));
          }
        }
      }
      context.Wait(MessageReceivedAsync);
    }




    private static async Task HandleResumeCommand(IDialogContext context, string[] keywords)
    {
      if (keywords.Length > 0)
      {
        string name = string.Join(" ", keywords).ToLower();

        //
        //  Access the file from some storage location and capture its metadata
        //
        var fileID = "abc";
        var fileSize = 1500;


        IMessageActivity reply = context.MakeMessage();
        reply.Attachments = new List<Attachment>();

        JObject acceptContext = new JObject();
        // Fill in any additional context to be sent back when the user accepts the file.
        acceptContext["fileId"] = fileID;
        acceptContext["name"] = name;

        JObject declineContext = new JObject();
        // Fill in any additional context to be sent back when the user declines the file.

        FileConsentCard card = new FileConsentCard()
        {
          Name = $"{name} resume.txt",
          AcceptContext = acceptContext,
          DeclineContext = declineContext,
          SizeInBytes = fileSize,
          Description = $"Here is the resume for {name}"
        };

        reply.Attachments.Add(card.ToAttachment());

        // A production bot would save the reply id so it can be updated later with file send status
        // https://docs.microsoft.com/en-us/azure/bot-service/dotnet/bot-builder-dotnet-state?view=azure-bot-service-3.0
        //
        //var consentMessageReplyId = (reply as Activity).Id;
        //var consentMessageReplyConversationId = reply.Conversation.Id;


        await context.PostAsync(reply);
      }
    }
  }
}