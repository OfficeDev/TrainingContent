# Cards and Actions Using Outlook Actionable Messages – 300 Level
----------------
In this lab, you will walk through building building an Actionable Message card using the [MessageCard Playground](https://messagecardplayground.azurewebsites.net/) app.


## Prerequisites

This demo requires an Office 365 subscription with an active mailbox and a **Microsoft Azure** subscription.

## Setup

This lab will use an Azure Web App to deploy an application. The URL of the web app is required. Visit the [Microsoft Azure Portal](https://portal.azure.com) and create a new Web App using the Free pricing plan. Copy the URL (for example, https://mywebapp.azurewebsites.net) for later use.


## 1. Actionable Messages card design and MessageCard Playground

This lab will walk you through designing an Actionable Message card using the [MessageCard Playground](https://messagecardplayground.azurewebsites.net/) app.

### Visit the MessageCard Playground

Visit the [MessageCard Playground](https://messagecardplayground.azurewebsites.net/) app.

![](../../Images/playground.png)

The MessageCard Playground provides a sandboxed environment with which to design and test your cards. You can choose from a list of existing samples or load your own sample. Each of these samples provides an interesting component of the syntax used to design a card. You can make modifications within the page that are shown visually, enabling you to quickly modify a card's design.

One of the simplest sample cards to start with is the **Twitter - Hero Image** sample card. In the drop-down, choose **Twitter - Hero Image**.

![](../../Images/twitterheroimage.png)

This card demonstrates basic text formatting with markdown, using images, and provides a sample of potential actions.

### Modify a sample 

Edit the **activityTitle** element to surround it with three asterisks instead of two:

![](../../Images/activitytitle.png)

Notice the title in the card is now bold and italics. You can use basic markdown formatting for text elements within the card. 

Open your browser to the [SpaceX Twitter page](https://twitter.com/SpaceX/status/908827608678244352) from September 15 2017.

![](../../Images/spacextwitter.png)

You will use the information on that page to see how to customize a card sample. Replace the activitySubtitle, activityText, and heroImage properties to reflect the information shown in that tweet. Additionally, change the potentialAction element to use the OpenUri URL to the tweet.

**Replace** the JSON in the MessageCard Playground app with the following:

````json
{
	"@type": "MessageCard",
	"@context": "http://schema.org/extensions",
	"themeColor": "E81123",
	"sections": [
		{
			"activityTitle": "**SpaceX**",
			"activitySubtitle": "@SpaceX - 15 Sep 2017",
			"activityImage": "https://pbs.twimg.com/profile_images/671865418701606912/HECw8AzK_400x400.jpg",
			"activityText": "After a month-long stay at the @Space_Station, Dragon returns to Earth on Sunday, September 17 → [https://go.nasa.gov/2h3ysMu](https://go.nasa.gov/2h3ysMu)",
			"heroImage": {
                "image": "https://pbs.twimg.com/media/DJtJmfMUEAAmwEj.jpg"			    
			},
			"potentialAction": [
				{
					"@type": "OpenUri",
					"name": "View in Twitter",
					"targets": [
						{
							"os": "default",
							"uri": "https://twitter.com/SpaceX/status/908827608678244352"
						}
					]
				}
			]
		}
	]
}
````
![](../../Images/updatedspacex.png)

The message card now reflects a different tweet. This demonstrates how your application can change the information in a card and send it to a user or group.

Now let's see how changing the action affected the card. Click on the **View in Twitter** button.
![](../../Images/sandboxaction.png)

Actions in the MessageCard Playground app are disabled, only prompting the information that you provided in the card. However, you can send the card to your Office 365 email account to view the card and interact with its actions. Click the **Send via Email** button to send the card to yourself in email.

![](../../Images/spacexcardemail.png)

Finally, click the **View in Twitter** button and see that your browser opens and the original Twitter page is displayed.

Explore the other samples in the MessageCard Playground app. These are good references from which to base your own card design. 

### Create a card
The card you will use for the rest of the lab represents a fictitious expense approval system and has the following markup:
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
        "title": "**Pending approval**",
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
        "potentialAction":
        [
          {
            "@type": "ActionCard",
            "name": "Approve",
            "inputs":
            [
              {
                "@type": "TextInput",
                "id": "comment",
                "isMultiline": true,
                "title": "Reason (optional)"
              }
            ],
            "actions":
            [
              {
                "@type": "HttpPOST",
                "name": "Submit",
                "target": "https://YOURWEBAPPNAME.azurewebsites.net/api/expense?id=9876&action=approve",
                "body": "={{comment.value}}",
                "headers":
                [
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
            "inputs":
            [
              {
                "@type": "TextInput",
                "id": "comment",
                "isMultiline": true,
                "title": "Reason (optional)"
              }
            ],
            "actions":
            [
              {
                "@type": "HttpPOST",
                "name": "Submit",
                "target": "https://YOURWEBAPPNAME.azurewebsites.net/api/expense?id=9876&action=approve",
                "body": "={{comment.value}}",
                "headers":
                [
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
Note the *YOURWEBAPPNAME.azurewebsites.net* placeholder used in this sample. Replace it with the Azure Web App URL that you created earlier in this lab.

**Replace** the JSON data in the MessageCard Playground app with this JSON data, making sure that the URL for your Azure Web App uses the https protocol.

Click **Send via Email** to send the card to yourself.

Check your email and open the message. Click the **Approve** button. You will see text below the button that says "The action could not be completed." We have not yet registered the action or implemented the web site, we will do that in this lab.

Finally, **save** the JSON representing the expense report to your file system. You will use this later in the lab.

