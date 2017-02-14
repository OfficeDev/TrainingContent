# Get started with SharePoint webhooks #

----------

Add a webhook subscription to SharePoint, build an application that handles SharePoint webhook requests.

## Video ##
- Module 8: Using React and Office UI Fabric React components - Coming

## Agenda ##
- Registering a webhook to SharePoint
- Working with the Webhooks to receive and act on SharePoint changes

## Key recommendations ##
- Use Postman Chrome App to construct and send requests quickly to a web api during development and test.
- Add a webhook subscription to SharePoint using Postman during development and test.
- Use ngrok to expose a web server running on your local machine to the Internet during development and test.
- You can use an ASP.NET Web API application to handle to web hook notifications, or any other technology to create the endpoint the webhook invokes.
- Your service endpoint must reply to SharePoint within 5 seconds.
- SharePoint only sends notifications that changes have happened.  You must use an asynchronous approach to determine what changed and still reply in less than 5 seconds.
- SharePoint does not call subscribed notification services in real-time
- When changes occur in SharePoint lists SharePoint queues the webhook call outs
- SharePoint batches webhook callout requests for each subscription
- Webhook subscriptions expire in 6 months if there are no changes to the SharePoint list.  You must take steps to renew the subscription.

## Lab - Get started with SharePoint webhooks ##
This lab demonstrates how to build an application that adds and handles SharePoint webhook requests. You will learn how to use the [Postman client](https://www.getpostman.com/) to construct and execute SharePoint webhook requests quickly while interacting with a simple ASP.NET Web API as the webhook receiver.

- [Lab manual](./Lab.md)

## Demos ##
The completed lab exercises are the demos for this module. 

- [HelloWorld Webpart](./Demos/SPWebhooksReceiver)

## Contributors ##

| Roles                                    			| Author(s)                                			|
| -------------------------------------------------	| ------------------------------------------------- |
| Project Lead / Architect / Lab Manuals / Videos   | Todd Baginski (Microsoft MVP, Canviz) @tbag		|
| PM / Dev Lead                            			| Alex Chen (Canviz) @alexchx  						|
| Lab Manuals / Source Code                			| Luis Lu (Canviz) @stluislu   						|
| Lab Manuals / Source Code                			| Theodore Shi (Canviz) @TheodoreShi				|
| Lab Manuals / Source Code                			| Max Liu (Canviz) @maxliu0621 						|
| Testing                                  			| Cindy Yan (Canviz) @CindyYan     					|
| Testing                                  			| Melody She (Canviz) @melodyshe   					|
| Testing                                  			| Lucas Smith (Canviz) @lucas66   					|
| PM                                       			| John Trivedi (Canviz) @johnt83      				|
| Sponsor / Support                        			| Vesa Juvonen (Microsoft) @VesaJuvonen   			|
| Sponsor / Support                        			| Chakkaradeep Chandran (Microsoft) @chakkaradeep   |
| Sponsor / Support                        			| Mike Ammerlaan (Microsoft) @mammerla         		|
| Sponsor / Support                        			| Rob Howard (Microsoft) @robmhoward      			|

## Version history ##

| Version | Date          		| Comments                     |
| ------- | ------------------- | ---------------------------- |
| 1.0     | February 15, 2017 	| Initial release for SPFx RC0 |

## Disclaimer ##
**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

----------

Notice that we will keep on updating this material based on your input and work being done in the [SharePoint Patterns and Practices initiative](http://aka.ms/sppnp). If you have any questions or comments, please use the [SharePoint Developer Group](http://aka.ms/sppnp-community) at Microsoft Tech Community.

![SharePoint PnP Logo](https://devofficecdn.azureedge.net/media/Default/PnP/sppnp.png)
