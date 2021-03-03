# Microsoft Identity Training Module - Secure custom APIs with Microsoft Identity

Many solutions involve creating web APIs to expose functionality to different clients and consumers. Developers can secure these APIs using Microsoft identity to ensure only approved apps can access the web APIs provided they've been granted the necessary permissions. In this module, you’ll learn how to secure a web API with Microsoft identity and how to call it from another application.

> This module is also published as a Microsoft Learn module: [Secure custom APIs with Microsoft Identity](https://docs.microsoft.com/learn/modules/identity-secure-custom-api)

## Lab - Secure custom APIs with Microsoft Identity

The lab for this module is available in multiple units within the associated Microsoft Learn module. Use the following links to jump to the specific unit. Each Microsoft Learn unit represents a different lab exercise & demo in the presentation.

1. [Exercise - Create and secure a web API with Microsoft identity](https://docs.microsoft.com/learn/modules/identity-secure-custom-api/3-exercise-secure-api-microsoft-identity)

   > In this exercise, you’ll learn how to create a .NET Core web API application and secure it with Microsoft identity.

1. [Exercise - Call secured APIs from web applications](https://docs.microsoft.com/en-us/learn/modules/identity-secure-custom-api/5-exercise-call-secured-apis-web-apps)

   > In this exercise, you’ll learn how to create server-side web apps that enable users to sign in and grant the app permissions to act on the user’s behalf. Once the user has authenticated and granted the app consent to act on their behalf, the web application will use data returned from a secure web API by using the OAuth 2.0 auth code grant flow.

1. [Exercise - Leverage app roles to secure custom APIs](https://docs.microsoft.com/en-us/learn/modules/identity-secure-custom-api/7-exercise-call-secured-apis-daemon-apps)

   > In this exercise, you'll learn how to add app roles (application permission) to an Azure AD Application registration and consume a secured API from a daemon application.

## Demos

1. [Create a custom web API that is secured with Microsoft identity](./demos/01-product-catalog-webapi-app)
1. [Call secured APIs from web applications](./demos/02-call-webapi-from-webapp)
1. [Leverage app roles to secure custom APIs](./demos/03-add-app-roles-to-webapi)

## Watch the module

This module has been recorded and is available in the Office Development YouTube channel: [Microsoft identity - Secure custom APIs with Microsoft Identity](https://www.youtube.com/watch?v=gXb6t3gjnOA)

## Contributors

| Roles                | Author(s)                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Lab / Slides / Demos | Andrew Connell (Microsoft MVP, [Voitanos](https://www.voitanos.io)) [@andrewconnell](//github.com/andrewconnell) |
| QA                   | Rob Windsor (Microsoft MVP, PAIT Group) [@rob-windsor](//github.com/rob-windsor)                                 |
| Sponsor / Support    | Kyle Marsh (Microsoft) [@kylemar](//github.com/kylemar)                                                          |

## Version history

| Version | Date              | Comments                                         |
| ------- | ----------------- | ------------------------------------------------ |
| 1.5     | March 6, 2021     | FY2021Q3 content refresh                         |
| 1.4     | November 27, 2020 | FY2021Q2 content refresh                         |
| 1.3     | September 7, 2020 | FY2021Q1 content refresh                         |
| 1.2     | August 17, 2020   | Incorporate Microsoft.Identity.Web NuGet package |
| 1.1     | May 26, 2019      | FY2020Q4 content refresh                         |
| 1.0     | March 15, 2019    | New module published                             |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

<img src="https://telemetry.sharepointpnp.com/TrainingContent/Identity/04%20securing%20custom%20apis" />
