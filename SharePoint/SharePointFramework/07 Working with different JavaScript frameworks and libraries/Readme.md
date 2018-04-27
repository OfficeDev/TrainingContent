# Working with different JavaScript frameworks and libraries #

----------

Implementing CRUD operations on SharePoint data in client side web parts with Angular and Knockout frameworks, using multiple JavaScript libraries in client side web parts to read and render  SharePoint data. 

### Topics and Videos ###
You can see videos around this module:

- [Different options to load JavaScript libraries](https://aka.ms/spfxtm7s1)
- [Angular 1.x](https://aka.ms/spfxtm7s2)
- [Knockout](https://aka.ms/spfxtm7s3)

## Key recommendations ##
- Client side web parts are framework agnostic. You can use any client side framework that you like: Angular, Knockout, React, Handlebars, and more.
- You need install the typings for the packages you add, because Typescript depends on it for compiling.
- Configuring Non-AMD libraries as external resources is different than AMD, UMD or CommonJS modules.
- Any dependencies you add are bundled by default.
- Avoid bundling when not needed to keep the web part bundle as small as possible.
- Use the WebPack visualizer to inspect web part bundles.

## Lab - Working with different JavaScript frameworks and libraries ##
In these labs, you will enhance the web parts created in the [Getting Started with the SharePoint Framework (SPFx)](../Module-1/Lab.md) module.  First, you will implement CRUD operations on SharePoint data in both Angular and Knockout client-side web parts.  Then you will use multiple JavaScript libraries (jQuery, Chartist, Moment) to manipulate the SharePoint data and render it in a chart.

- [Exercise 1: Implement CRUD operations in a SPFx client-side web part with the Angular 1.x framework](./Lab.md#exercise-1-implement-crud-operations-in-a-spfx-client-side-web-part-with-the-angular-1-x-framework)
- [Exercise 2: Implement CRUD operations in a SPFx client-side web part with the Knockout framework](./Lab.md#exercise-2-implement-crud-operations-in-a-spfx-client-side-web-part-with-the-knockout-framework)
- [Exercise 3: Use different JavaScript libraries(jQuery, Chartist, Moment) in a SPFx client-side web part](./Lab.md#exercise-3-use-different-javascript-libraries-jquery-chartist-moment-in-a-spfx-client-side-web-part)

## Demos ##
The completed lab exercises are the demos for this module. 

- [Exercise 1: Implement CRUD operations in a SPFx client-side web part with the Angular 1.x framework](./Demos/Exercise 1/helloworld-webpart-angular1)
- [Exercise 2: Implement CRUD operations in a SPFx client-side web part with the Knockout framework](./Demos/Exercise 1/helloworld-webpart-knockout)
- [Exercise 3: Use different JavaScript libraries(jQuery, Chartist, Moment) in a SPFx client-side web part](./Demos/Exercise 1/helloworld-webpart-jquery)

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

| Version | Date          		| Comments        |
| ------- | ------------------- | --------------- |
| 1.0     | November 18, 2016 	| Initial release |

## Disclaimer ##
**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

----------

Notice that we will keep on updating this material based on your input and work being done in the [Office 365 Developer Patterns and Practices program](http://aka.ms/officedevpnp). You can provide us input directly using the [Office 365 Developer Patterns & Practices Yammer group](http://aka.ms/officedevpnpyammer)
![](https://camo.githubusercontent.com/a732087ed949b0f2f84f5f02b8c79f1a9dd96f65/687474703a2f2f692e696d6775722e636f6d2f6c3031686876452e706e67)

<img src="https://telemetry.sharepointpnp.com/TrainingContent/SharePoint/SharePointFramework/07-working-with-different-javascript-frameworks" />