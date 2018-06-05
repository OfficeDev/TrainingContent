# Demo: Cards and Actions Using Outlook Actionable Messages

This demo will walk through building building an Actionable Message card using the [MessageCard Playground](https://messagecardplayground.azurewebsites.net/) app.

## Prerequisites

This demo requires an Office 365 subscription with an active mailbox and a **Microsoft Azure** subscription.

## Select a MessageCard to edit

1. Visit the [MessageCard Playground](https://messagecardplayground.azurewebsites.net/) app.

    ![Screenshot of MessageCard Playground app.](../../Images/playground.png)

    The MessageCard Playground provides a sandboxed environment with which to design and test your cards. You can choose from a list of existing samples or load your own sample. Each of these samples provides an interesting component of the syntax used to design a card. You can make modifications within the page that are shown visually, enabling you to quickly modify a card's design.

1. In the drop-down menu, choose **GitHub - Issue opened**.

    ![Screenshot of GitHub - Issue opened card.](Images/Exercise1_02.png)

## Modify a sample

1. Edit the `activityTitle` element to surround it with two asterisks instead of none:

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

## Create a card

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

1. Check your email and open the message. Select the **approve** button. You will see text below the button that says "The action could not be completed." This happened because you have not yet registered the action or implemented the web site, you will do that in this lab.

1. Save the JSON representing the expense report to your file system. You will use this later in the lab.