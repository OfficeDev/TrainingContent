# Cards and Actions Using Outlook Actionable Messages – 300 Level
----------------
In this lab, you will walk through building an Actionable Message card and adding actions. 

## Prerequisites

This lab uses Visual Studio 2017. It also requires an Office 365 subscription with an active mailbox and a **Microsoft Azure** subscription.

## Setup

This lab will use an Azure Web App to deploy an application. The URL of the web app is required. Visit the [Microsoft Azure Portal](https://portal.azure.com) and create a new Web App. Copy the URL (for example, https://mywebapp.azurewebsites.net) for later use.


## Adding actions to cards

The first section of this lab demonstrated how to design a card, the second section demonstrated how to send Actionable Messages. This section will now pull it all together by implementing a Web API that responds to card actions.

## Register a new provider
As you saw previously in this lab, the action URL did not yet work because it had not been whitelisted. Registration of a provider is required to whitelist your action URL to use with cards. 

Open your browser to the [Actionable Email Developer Dashboard](https://outlook.office.com/connectors/oam/publish) and click **New Provider**. 

Provide a name and image for your provider. You are prompted for an email, this is the email used as the sender for your Actionable Messages. Typically you would use a static email address such as `actions@contoso.com`, but for the purposes of this lab enter your own email address. For the target URL, enter the URL for your Azure web app as an HTTPS URL (for instance, https://myapp.azurewebsites.net). Finally, the scope of submission determines how you will use the provider. Choose **Mailbox** as the scope.

A scope of **Mailbox** will only allow actions in cards from your inbox. A scope of **Organization** will allow you to send Actionable Messages to others in your organization, and a scope of **Global** allows you to send to users inside and outside your organization. If you choose **Organization** or **Global**, then your application must first be reviewed and approved before proceeding.

### Create a new Web API application
In Visual Studio 2017, **create** a new Web Application project (File / New / Project / ASP.NET Web Application (.NET Framework). Name the project **ExpenseApproval**. When prompted, choose **Web API**, and ensure that **No Authentication** is selected.

![](../../Images/webapplication.png)

## Add NuGet package
When the Web API is called, the application needs to validate the OAuth bearer token that is sent from Microsoft. The `Microsoft.O365.ActionableMessages.Utilities' NuGet package provides logic necessary to validate the bearer token.

In Visual Studio, **open** the Package Manager Console (Tools / NuGet Package Manager / Package Manager Console) and enter the following:
````PowerShell
Install-Package Microsoft.O365.ActionableMessages.Utilities
````

In Visual Studio, **add** a folder named `Models` and **add** a class named `ValidationModel`. **Replace** the code with the following:

````csharp
using Microsoft.O365.ActionableMessages.Authentication;
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
In Visual Studio, **add** a folder named `Helpers` and **add** a class named `ActionableMessageHelper`. **Replace** the code with the following:

````csharp
using ExpenseApproval.Models;
using Microsoft.O365.ActionableMessages.Authentication;
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
Notice the first few lines in the ValidateTokenAsync method use configuration settings. **Open** the web.config file in your project's root directory and **add** the following to the appSettings section:
````xml
    <add key="sender" value="" />                        <!-- Ex: admin@contoso.onmicrosoft.com -->
    <add key="emailDomain" value="" />                   <!-- Ex: @contoso.onmicrosoft.com -->
    <add key="registeredActionURL" value="" />           <!-- Ex: https://myapp.azurewebsites.net -->
````

The `GetCardBody` method references a project resource file to obtain a template representing the card to send as a response. **Double-click** the Properties node in Visual Studio and click on the **Resources** tab. **Add** a new string resource named "refreshCard" and paste the following JSON:

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
**Rename** the default controller class named **ValuesController** to **ExpenseController**. Replace the class contents with the following.
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
The Web API that you just created will be called from Microsoft, so it needs to be available publicly and not running locally on localhost. Right-click the web application project and choose **Publish**. Choose **Select Existing** and click **OK**. 

![](../../Images/publish.png)

Choose your existing Web App and click **OK**.

In the **Publish** window, click the **Settings...** link. Click the **Settings** tab and change the configuration to **Debug**. 

![](../../Images/webdeploy.png)

**Save** your changes then click **Publish** to publish your web application code.

### Debug the Azure Web App
You can attach a debugger to an Azure Web App similar to how you attach a debugger to a local process during debugging. In Visual Studio 2017, open the **Cloud Explorer** pane and expand the **App Services** node to show your Azure Web App. Right-click your web app and choose **Attach Debugger**.

![](../../Images/debugger.png)

Set a breakpoint in the Web API controller to see when messages arrive and debug interactively.

### Test the card
In the previous section, you sent a card to yourself using both PowerShell and a webhook. Those email messages should still be in your inbox (if not, repeat the previous section exercise). Open the email and click the **Approve** button. Provide text, simulating comments to an approval form, and click **Submit**. 

![](../../Images/actioncard.png)

The debugger in your code is reached, and you can step through the code to see the bearer token is validated, the sender and email domains are validated, the refresh card body is retrieved and the response is sent with the appropriate headers.

In your email client, the card is now updated to reflect the data sent in the refresh card.

![](../../Images/refreshcard.png)