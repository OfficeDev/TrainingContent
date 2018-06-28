# Demo: Adding actions to cards

In this demo, you will walk through building an Actionable Message card and adding actions.

## Prerequisites

This demo uses Visual Studio 2017. It also requires an Office 365 subscription with an active mailbox and a **Microsoft Azure** subscription.

## Register a new provider

1. Open your browser and go to the [Actionable Email Developer Dashboard](https://outlook.office.com/connectors/oam/publish). Select **New Provider**.

1. Provide a name and image for your provider. When prompted for an email, enter the email used for the sender. Typically you would use a static email address such as `actions@contoso.com`, but for the purposes of this lab enter your own email address. For the target URL, enter the URL for your Azure Web App as an HTTPS URL (for instance, https://myapp.azurewebsites.net). The scope of submission determines how you will use the provider. Choose **My Mailbox** as the scope.

    >Note: A scope of "My Mailbox" will only allow actions in cards from your inbox. A scope of "Organization" will allow you to send Actionable Messages to others in your organization, and a scope of "Global" allows you to send to users inside and outside your organization. If you choose "Organization" or "Global" then your application must first be reviewed and approved before proceeding.

## Create a new Web API application

1. In Visual Studio 2017, create a new web application project (File > New > Project > ASP.NET Web Application (.NET Framework). Name the project **ExpenseApproval**. When prompted, choose **Web API**, and make sure that **No Authentication** is selected.

    ![Screenshot of ASP.NET Web Application menu screen.](../../Images/webapplication.png)

## Add NuGet package

When the Web API is called, the application needs to validate the OAuth bearer token that is sent from Microsoft. The `Microsoft.O365.ActionableMessages.Utilities` NuGet package provides logic necessary to validate the bearer token.

1. In Visual Studio, open the **Package Manager Console** (Tools > NuGet Package Manager > Package Manager Console) and enter the following:

    ````PowerShell
    Install-Package Microsoft.O365.ActionableMessages.Utilities
    ````

1. In Visual Studio, add a folder named **Models** and add a class named **ValidationModel**. Replace the code with the following:

    ````csharp
    using Microsoft.O365.ActionableMessages.Utilities;
    using System.Net.Http;

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

## Implement the controller

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

## Publish the Azure Web Application

1. The Web API that you just created will be called from Microsoft, so it needs to be available publicly and not running locally on `localhost`. Right-click the web application project and choose **Publish**. Choose **Select Existing** and select **OK**.

    ![Screenshot of publishing options.](../../Images/publish.png)

1. Choose your existing Web App and select **OK**.

1. In the **Publish** window, select the **Settings** link. Choose the **Settings** tab and change the configuration to **Debug**.

    ![Screenshot of settings in publish window.](../../Images/webdeploy.png)

1. Select **Save** and then select **Publish** to publish your web application code.

## Debug the Azure Web App

1. In Visual Studio 2017, open the **Cloud Explorer** pane and expand the **App Services** node to show your Azure Web App. Right-click your web app and choose **Attach Debugger**.

    ![Screenshot of app services in Visual Studio.](../../Images/debugger.png)

    >Note: If you only see local resources, select the **person** icon, make sure the account you used to create the web app service is listed, and then check the **All subscriptions** item to show them in the explorer.

1. Set a breakpoint in the Web API controller to see when messages arrive and debug interactively.

## Test the card

1. In the previous section, you sent a card to yourself using both PowerShell and a webhook. Those email messages should still be in your inbox (if not, repeat the previous section exercise). Open the email sent via the steps in the previous exercise and select the **Approve** button. Enter sample text in the **Reason** box and select **Submit**.

    ![Screenshot of test card email.](../../Images/actioncard.png)

1. The debugger in your code is reached, and you can step through the code to see the bearer token is validated, the sender and email domains are validated, the refresh card body is retrieved and the response is sent with the appropriate headers.

1. In your email client, the card is now updated to reflect the data sent in the refresh card.

    ![Screenshot of updated card in email.](../../Images/refreshcard.png)