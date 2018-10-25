# Lab: Cards and actions using Microsoft Outlook Actionable Messages

In this lab, you will walk through building an Actionable Message card and adding actions.

## In this lab

1. [Actionable Messages card design and MessageCard Playground](#exercise-1-actionable-Messages-card-design-and-messagecard-playground)
1. [Sending Actionable Messages](#exercise-2-sending-actionable-messages)
1. [Adding actions to cards](#exercise-3-adding-actions-to-cards)

## Prerequisites

This lab uses Visual Studio 2017. It also requires an Microsoft Office 365 subscription with an active mailbox and a **Microsoft Azure** subscription.

## Setup

This lab will use an Microsoft Azure Web App to deploy an application. The URL of the web app is required. Visit the [Microsoft Azure Portal](<https://portal.azure.com>) and create a new web app using the free pricing tier. Copy the URL (for example, <https://mywebapp.azurewebsites.net>) for later use.

## Exercise 1: Actionable Messages card design and MessageCard Playground

This lab will walk you through designing an Actionable Message card using the [MessageCard Playground](https://messagecardplayground.azurewebsites.net/) app.

### Select a MessageCard to edit

1. Visit the [MessageCard Playground](https://messagecardplayground.azurewebsites.net/) app.

    ![Screenshot of MessageCard Playground app.](Images/playground.png)

    The MessageCard Playground provides a sandboxed environment with which to design and test your cards. You can choose from a list of existing samples or load your own sample. Each of these samples provides an interesting component of the syntax used to design a card. You can make modifications within the page that are shown visually, enabling you to quickly modify a card's design.

1. In the drop-down menu, choose **Microsoft Flow Approval**.

### Modify a sample

1. Edit the `activityTitle` element to surround it with three asterisks instead of two, note how the text changes:

    ![Screenshot of Microsoft Flow approval with title highlighted.](Images/Exercise1_03.png)

    >Note: You can use basic markdown formatting for text elements within the card.

1. Open your browser and go to the [Training Content Issue 493](https://github.com/OfficeDev/TrainingContent/issues/493).

    ![Screenshot of GitHub Training Content Issue 493.](Images/Exercise1_04.png)

1. Replace the JSON in the MessageCard Playground app with the following code:

    ````json
    {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "summary": "Issue 176715375",
      "themeColor": "0078D7",
      "title": "Issue opened: \"Is the Stock Service Down?\"",
      "sections": [
        {
          "activityTitle": "MatthewMcD",
          "activitySubtitle": "5/20/2018, 12:36pm",
          "activityImage": "https://avatars1.githubusercontent.com/u/7558738?s=460&v=4",
          "facts": [
            {
              "name": "Repository:",
              "value": "OfficeDev\\TrainingContent"
            },
            {
              "name": "Issue #:",
              "value": "493"
            }
          ],
          "text": "Attempting the Office Add-In modules. Attempting to connect to https://estx.azurewebsites.net/api/quote/msft and getting 500 Server Error. Who controls that endpoint?"
        }
      ],
      "potentialAction": [
        {
          "@type": "OpenUri",
          "name": "View in GitHub",
          "targets": [
            { "os": "default", "uri": "https://github.com/OfficeDev/TrainingContent/issues/493" }
          ]
        }
      ]
    }
    ````

    ![Screenshot of JSON and GitHub - Issue opened card side by side.](Images/Exercise1_05.png)

    The message card now reflects a different GitHub issue. This demonstrates how your application can change the information in a card and send it to a user or group.

1. Select the **View in GitHub** button to see the issue.

    ![Screenshot of action message in MessageCard Playground app.](Images/Exercise1_06.png)

    Actions in the MessageCard Playground app are disabled, only prompting the information that you provided in the card. However, you can send the card to your Office 365 email account to view the card and interact with its actions.

1. Select the **Send via Email** button to send the card to yourself in email. If you are not logged in to the MessageCard Playground it will prompt you to log in and then ask for your consent.  When consent is given the MessageCard Playground page will reload and you will need to load the sample again.

    ![Screenshot of test message card in email.](Images/Exercise1_07.png)

1. Select the **View in GitHub** button and see that your browser opens and the original GitHub issue page is displayed.

1. Explore the other samples in the MessageCard Playground app. These are good references to use as a basis for your own card design.

### Create a card

1. Replace the JSON data in the MessageCard Playground app with this JSON data, making sure that the URL for your Azure Web App uses the HTTPS protocol. This is the card you will use for the rest of the lab. It is a fictitious expense approval system.

    ````json
    {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "summary": "This is the summary property",
      "themeColor": "0075FF",
      "sections": [
        {
          "heroImage": {
            "image": "http://messagecardplayground.azurewebsites.net/assets/FlowLogo.png"
          }
        },
        {
          "startGroup": true,
          "title": "**Pending approval**",
          "activityImage": "http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg",
          "activityTitle": "Requested by **Miguel Garcia**",
          "activitySubtitle": "m.garcia@contoso.com",
          "facts": [
            {
              "name": "Date submitted:",
              "value": "06/27/2017, 2:44 PM"
            },
            {
              "name": "Details:",
              "value": "Please approve this expense report for **$123.45**."
            },
            {
              "name": "Link:",
              "value": "[Link to the expense report](http://messagecardplayground.azurewebsites.net)"
            }
          ]
        },
        {
          "potentialAction": [
            {
              "@type": "ActionCard",
              "name": "Approve",
              "inputs": [
                {
                  "@type": "TextInput",
                  "id": "comment",
                  "isMultiline": true,
                  "title": "Reason (optional)"
                }
              ],
              "actions": [
                {
                  "@type": "HttpPOST",
                  "name": "Submit",
                  "target": "https://YOURWEBAPPNAME.azurewebsites.net/api/expense?id=9876&action=approve",
                  "body": "={{comment.value}}",
                  "headers": [
                    {
                      "Content-Type": "application/x-www-form-urlencoded"
                    }
                  ]
                }
              ]
            },
            {
              "@type": "ActionCard",
              "name": "Reject",
              "inputs": [
                {
                  "@type": "TextInput",
                  "id": "comment",
                  "isMultiline": true,
                  "title": "Reason (optional)"
                }
              ],
              "actions": [
                {
                  "@type": "HttpPOST",
                  "name": "Submit",
                  "target": "https://YOURWEBAPPNAME.azurewebsites.net/api/expense?id=9876&action=approve",
                  "body": "={{comment.value}}",
                  "headers": [
                    {
                      "Content-Type": "application/x-www-form-urlencoded"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "startGroup": true,
          "activitySubtitle": "Grant approvals directly from your mobile device with the Microsoft Flow app. [Learn more](http://learnmode)\n\nThis message was created by an automated workflow in Microsoft Flow. Do not reply."
        }
      ]
    }
    ````

    >Note: Replace both instances of the `YOURWEBAPPNAME.azurewebsites.net` placeholders with the Azure Web App URL that you created earlier in this lab.

1. Select **Send via Email** to send the card to yourself.

1. Check your email and open the message. Select the **approve** button. You will see text below the button that says "The remote endpoint returned an error (HTTP Forbidden). Please try again later." This happened because you have not yet registered the action or implemented the web site, you will do that in this lab.

1. Save the JSON representing the expense report to your file system. You will use this later in the lab.

## Exercise 2: Sending Actionable Messages

In this section, you will use PowerShell to send an email containing a message card.

### Write PowerShell to send email via Microsoft Office 365 SMTP Server

PowerShell provides a utility method `Send-MailMessage` that is used to send emails. You can use this method with the Office 365 SMTP Server to send an email using PowerShell.

1. Open the **PowerShell ISE** and expand the script pane. Copy the following PowerShell script to the script pane:

    ````PowerShell
    Param(
      [Parameter(Mandatory = $true,
        HelpMessage="The Office 365 email address the email is being sent from")]
      [ValidateNotNullOrEmpty()]
      [string]$from,
      [Parameter(Mandatory = $true,
        HelpMessage="The email address the email is being sent to")]
      [ValidateNotNullOrEmpty()]
      [string]$to
      )

    $emailHeader = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><script type='application/ld+json'>"
    $jsonBody = Get-Content .\CardSample.json
    $emailFooter = "</script></head><body>Visit the <a href='https://docs.microsoft.com/en-us/outlook/actionable-messages'>Outlook Dev Portal</a> to learn more about Actionable Messages.</body></html>"

    $emailBody = $emailHeader + $jsonBody + $emailFooter

    $msolcred = Get-Credential
    Send-MailMessage –From $from –To $to –Subject "MessageCard Demo" –Body $emailBody -BodyAsHtml -SmtpServer smtp.office365.com -Credential $msolcred -UseSsl -Port 587
    ````

1. In the interactive pane, change the directory to the location where you saved the JSON file representing the fictitious expense report.

    ![Screenshot of Powershell script.](Images/powershell.png)

1. Run the script. When prompted, enter your own email address for both emails. Also enter your login credentials for your Microsoft Office 365 mailbox.

1. When the script completes, check your inbox for the email just sent.

## Exercise 3: Adding actions to cards

The first section of this lab demonstrated how to design a card, the second section demonstrated how to send Actionable Messages.

### Register a new provider

1. Open your browser and go to the [Actionable Email Developer Dashboard](https://outlook.office.com/connectors/oam/publish). Select **New Provider**.

1. Provide a name and image for your provider. When prompted for an email, enter the email used for the sender. Typically you would use a static email address such as `actions@contoso.com`, but for the purposes of this lab enter your own email address. For the target URL, enter the URL for your Azure Web App as an HTTPS URL (for instance, <https://myapp.azurewebsites.net>). The scope of submission determines how you will use the provider. Choose **My Mailbox** as the scope.

    >Note: A scope of "My Mailbox" will only allow actions in cards from your inbox. A scope of "Organization" will allow you to send Actionable Messages to others in your organization, and a scope of "Global" allows you to send to users inside and outside your organization. If you choose "Organization" or "Global" then your application must first be reviewed and approved before proceeding.

### Create a new Web API application

1. In Visual Studio 2017, create a new web application project (File > New > Project > ASP.NET Web Application (.NET Framework). Name the project **ExpenseApproval**. When prompted, choose **Web API**, and make sure that **No Authentication** is selected.

    ![Screenshot of ASP.NET Web Application menu screen.](Images/webapplication.png)

### Add NuGet package

When the Web API is called, the application needs to validate the OAuth bearer token that is sent from Microsoft. The `Microsoft.O365.ActionableMessages.Utilities` NuGet package provides logic necessary to validate the bearer token.

1. In Visual Studio, open the **Package Manager Console** (Tools > NuGet Package Manager > Package Manager Console) and enter the following:

    ````PowerShell
    Install-Package Microsoft.O365.ActionableMessages.Utilities
    ````

1. In Visual Studio, add a folder named **Models** and add a class named **ValidationModel**. Replace the code with the following:

    ````csharp
    using System.Net.Http;
    using Microsoft.O365.ActionableMessages.Utilities;

    namespace ExpenseApproval.Models
    {
        public class ValidationModel
        {
            public bool IsError { get; set; }
            public ActionableMessageTokenValidationResult ValidationResult { get; set; }
            public HttpResponseMessage Response { get; set; }

            public string Message { get; set; }
        }
    }
    ````

1. In Visual Studio, add a folder named **Helpers** and add a class named **ActionableMessageHelper**. Replace the code with the following:

    ````csharp
    using ExpenseApproval.Models;
    using Microsoft.O365.ActionableMessages.Utilities;
    using System;
    using System.Configuration;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

    namespace ExpenseApproval.Helpers
    {
        public class ActionableMessageHelper
        {
            public static async Task<ValidationModel> ValidateTokenAsync(HttpRequestMessage request)
            {
                var sender = ConfigurationManager.AppSettings["sender"].ToLower();
                var emailDomain = ConfigurationManager.AppSettings["emailDomain"].ToLower();
                var registeredActionURL = ConfigurationManager.AppSettings["registeredActionURL"].ToLower();

                var message = string.Empty;
                // Validate that we have a bearer token.
                if (request.Headers.Authorization == null ||
                    !string.Equals(request.Headers.Authorization.Scheme, "bearer", StringComparison.OrdinalIgnoreCase) ||
                    string.IsNullOrEmpty(request.Headers.Authorization.Parameter))
                {
                    message = "Missing authentication token.";
                    return new ValidationModel {
                        IsError = true,
                        Message = message,
                        Response = CreateCardResponse(request, HttpStatusCode.Unauthorized, message)
                    };
                }

                //Validate the token
                var validator = new ActionableMessageTokenValidator();
                var result = await validator.ValidateTokenAsync(request.Headers.Authorization.Parameter, registeredActionURL);
                if (!result.ValidationSucceeded)
                {
                    message = "Invalid token.";
                    return new ValidationModel
                    {
                        IsError = true,
                        Message = message,
                        Response = CreateCardResponse(request, HttpStatusCode.Unauthorized, message),
                        ValidationResult = result
                    };
                }

                //The sender is registered in the portal and should be a static email address.
                if (result.Sender.ToLower().CompareTo(sender) != 0)
                {
                    message = "Invalid sender.";
                    return new ValidationModel
                    {
                        IsError = true,
                        Message = message,
                        Response = CreateCardResponse(request, HttpStatusCode.Forbidden, message),
                        ValidationResult = result
                    };
                }

                //TODO: Add additional logic to validate the performer. Here we just compare against
                //the domain.
                if (!result.ActionPerformer.ToLower().EndsWith(emailDomain)) {
                    message = "The performer is not allowed.";
                    return new ValidationModel
                    {
                        IsError = true,
                        Message = message,
                        Response = CreateCardResponse(request, HttpStatusCode.Forbidden, message),
                        ValidationResult = result
                    };
                }

                //Return a validation model without creating a response, caller must create their own
                //response.
                return new ValidationModel
                {
                    IsError = false,
                    ValidationResult = result
                };
            }

            internal static HttpResponseMessage CreateCardResponse(HttpRequestMessage request, HttpStatusCode code, string cardStatus)
            {
                if (code == HttpStatusCode.OK)
                {
                    HttpResponseMessage response = request.CreateResponse(code);
                    response.Headers.Add("CARD-ACTION-STATUS", cardStatus);
                    return response;
                }
                else
                {
                    var errorResponse = request.CreateErrorResponse(code, new HttpError());
                    errorResponse.Headers.Add("CARD-ACTION-STATUS", cardStatus);
                    return errorResponse;
                }
            }

            public static string GetCardBody(string value, string result, string performer)
            {
                string template = ExpenseApproval.Properties.Resources.refreshCard;

                return template
                    .Replace("{{approvalResult}}", result)
                    .Replace("{{performer}}", performer)
                    .Replace("{{processDate}}", System.DateTime.Now.ToLongTimeString());
            }
        }
    }
    ````

    >Note: The first few lines in the `ValidateTokenAsync` method use configuration settings. Open the `web.config` file in your project's root directory and add the following to the `appSettings` section and fill in the values:

    ````xml
    <add key="sender" value="" />                        <!-- Ex: admin@contoso.onmicrosoft.com -->
    <add key="emailDomain" value="" />                   <!-- Ex: @contoso.onmicrosoft.com -->
    <add key="registeredActionURL" value="" />           <!-- Ex: https://myapp.azurewebsites.net -->
    ````

1. The **GetCardBody** method references a project resource file to obtain a template representing the card to send as a response. Expand the **Properties** node in Visual Studio and select the **Resources** tab. Add a new string resource named `refreshCard` and paste the following JSON:

    ````json
    {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "summary": "This is the summary property",
      "themeColor": "0075FF",
      "sections":
      [
        {
          "heroImage":
          {
            "image": "http://messagecardplayground.azurewebsites.net/assets/FlowLogo.png"
          }
        },
        {
          "startGroup": true,
          "title": "{{approvalResult}}",
          "activityImage": "http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg",
          "activityTitle": "Requested by **Miguel Garcia**",
          "activitySubtitle": "m.garcia@contoso.com",
          "facts":
          [
            {
              "name": "Date submitted:",
              "value": "06/27/2017, 2:44 PM"
            },
            {
              "name": "Date processed:",
              "value": "{{processDate}}"
            },
            {
              "name": "Processed by:",
              "value": "{{performer}}"
            },
            {
              "name": "Details:",
              "value": "Please approve this expense report for **$123.45**."
            },
            {
              "name": "Link:",
              "value": "[Link to the expense report](http://connectorsdemo.azurewebsites.net)"
            }
          ]
        },
        {
          "startGroup": true,
          "activitySubtitle": "Grant approvals directly from your mobile device with the Microsoft Flow app. [Learn more](http://learnmode)\n\nThis message was created by an automated workflow in Microsoft Flow. Do not reply."
        }
      ]
    }
    ````

The JSON contains placeholders that are replaced with actual values by the code.

### Implement the controller

1. Add a new controller class named **ExpenseController**. Replace the class contents with the following.

    ````csharp
    using ExpenseApproval.Helpers;
    using System.Diagnostics;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

    namespace ExpenseApproval.Controllers
    {
        public class ExpenseController : ApiController
        {
            // POST api/values
            public async Task<HttpResponseMessage> Post([FromUri]string id, [FromUri]string action, [FromBody]string value)
            {
                //Validate the token before continuing.
                var ret = await ActionableMessageHelper.ValidateTokenAsync(Request);
                if(ret.IsError)
                {
                    Trace.TraceError(ret.Message);
                    return ret.Response;
                }

                // TODO: Add business logic code here to process the expense report
                HttpResponseMessage response;
                var approvalResult = default(string);

                if(action == "approve")
                {
                    approvalResult = "Approved";
                    response = ActionableMessageHelper.CreateCardResponse(Request, HttpStatusCode.OK, "The expense was approved.");
                    Trace.TraceInformation("Expense report approved: " + value);
                }
                else
                {
                    approvalResult = "Declined";
                    response = ActionableMessageHelper.CreateCardResponse(Request, HttpStatusCode.OK, "The expense was declined.");
                    Trace.TraceInformation("Expense report declined: " + value);
                }

                //Refresh the card
                response.Headers.Add("CARD-UPDATE-IN-BODY", "true");
                string refreshCard = ActionableMessageHelper.GetCardBody(value, approvalResult, ret.ValidationResult.ActionPerformer);
                response.Content = new StringContent(refreshCard);

                return response;
            }
        }
    }
    ````

### Publish the Azure Web Application

1. The Web API that you just created will be called from Microsoft, so it needs to be available publicly and not running locally on `localhost`. Right-click the web application project and choose **Publish**. Choose **Select Existing** and select **OK**.

    ![Screenshot of publishing options.](Images/publish.png)

1. Choose your existing Web App and select **OK**.

1. In the **Publish** window, select the **Settings** link. Choose the **Settings** tab and change the configuration to **Debug**.

    ![Screenshot of settings in publish window.](Images/webdeploy.png)

1. Select **Save** and then select **Publish** to publish your web application code.

### Debug the Azure Web App

1. In Visual Studio 2017, open the **Cloud Explorer** pane and expand the **App Services** node to show your Azure Web App. Right-click your web app and choose **Attach Debugger**.

    ![Screenshot of app services in Visual Studio.](Images/debugger.png)

    >Note: If you only see local resources, select the **person** icon, make sure the account you used to create the web app service is listed, and then check the **All subscriptions** item to show them in the explorer.

1. Set a breakpoint in the Web API controller to see when messages arrive and debug interactively.

### Test the card

1. In the previous section, you sent a card to yourself using both PowerShell and a webhook. Those email messages should still be in your inbox (if not, repeat the previous section exercise). Open the email sent via the steps in the previous exercise and select the **Approve** button. Enter sample text in the **Reason** box and select **Submit**.

    ![Screenshot of test card email.](Images/actioncard.png)

1. The debugger in your code is reached, and you can step through the code to see the bearer token is validated, the sender and email domains are validated, the refresh card body is retrieved and the response is sent with the appropriate headers.

1. In your email client, the card is now updated to reflect the data sent in the refresh card.

    ![Screenshot of updated card in email.](Images/refreshcard.png)