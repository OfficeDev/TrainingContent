# 使用 Microsoft Graph 的 Office 365 Angular Connect 示例

连接到 Office 365 是每个应用开始使用 Office 365 服务和数据必须采取的第一步。该示例演示如何连接并调用 Microsoft Graph API（旧称 Office 365 统一 API），以及如何使用 Office 结构 UI 创建 Office 365 体验。

> 注意：尝试 [Office 365 API 入门](http://dev.office.com/getting-started/office365apis?platform=option-angular#setup)页面，其简化了注册，使您可以更快地运行该示例。

![Office 365 Angular Connect 示例的屏幕截图](../README assets/screenshot.png)

## 先决条件

要使用 Office 365 Angular Connect 示例，您需要以下内容：
* [Node.js](https://nodejs.org/)。需要提供节点才能在开发服务器上运行示例和安装依赖项。 
* Office 365 帐户。您可以注册 [Office 365 开发人员订阅](https://aka.ms/devprogramsignup) 其中包含开始构建 Office 365 应用所需的资源。

     > 注意：如果您已经订阅，之前的链接会将您转至包含以下信息的页面：*抱歉，您无法将其添加到当前帐户*。在这种情况下，请使用当前 Office 365 订阅中的帐户。
* 用于注册您的应用程序的 Microsoft Azure 租户。Azure Active Directory (AD) 为应用程序提供了用于进行身份验证和授权的标识服务。您还可在此处获得试用订阅：[Microsoft Azure](https://account.windowsazure.com/SignUp)。

     > 重要说明：您还需要确保您的 Azure 订阅已绑定到 Office 365 租户。要执行这一操作，请参阅 Active Directory 团队的博客文章：[创建和管理多个 Microsoft Azure Active Directory](http://blogs.technet.com/b/ad/archive/2013/11/08/creating-and-managing-multiple-windows-azure-active-directories.aspx)。**添加新目录**一节将介绍如何执行此操作。您还可以参阅[设置 Office 365 开发环境](https://msdn.microsoft.com/office/office365/howto/setup-development-environment#bk_CreateAzureSubscription)和**关联您的 Office 365 帐户和 Azure AD 以创建并管理应用**一节获取详细信息。
* 在 Azure 中注册的应用程序的客户端 ID。必须向该示例应用程序授予**以登录用户身份发送邮件**和**以登录用户身份发送邮件**权限以使用 **Microsoft Graph** 应用程序。[在 Azure 中添加 Web 应用程序](https://msdn.microsoft.com/office/office365/HowTo/add-common-consent-manually#bk_RegisterWebApp)并向其[授予适当的权限](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/wiki/Grant-permissions-to-the-Connect-application-in-Azure)。

     > 注意：在应用注册过程中，务必将 **http://127.0.0.1:8080/** 指定为**登录 URL**。

## 配置并运行应用

1. 使用最喜爱的 IDE，打开 *public/scripts* 中的 **config.js**。
2. 用所注册的 Azure 应用程序的客户端 ID 替换 *ENTER_YOUR_CLIENT_ID*。
3. 通过在命令行的项目根目录中运行 ```npm install``` 来安装项目依赖项和节点的程序包管理器 (npm)。
4. 通过在项目根目录中运行 ```node server.js``` 启动开发服务器。
5. 导航到 Web 浏览器中的 ```http://127.0.0.1:8080/```。

若要了解有关该示例的详细信息，请参阅 [graph.microsoft.io 上的 Angular 演练](http://graph.microsoft.io/docs/platform/angular)。 

## 问题和意见

我们乐意倾听您有关 Office 365 Angular Connect 示例的反馈。您可以在该存储库中的[问题](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/issues)部分将问题和建议发送给我们。

我们非常重视您的反馈意见。请在[堆栈溢出](http://stackoverflow.com/questions/tagged/office365+or+microsoftgraph)上与我们联系。使用 [MicrosoftGraph] 和 [office365] 标记出您的问题。
  
## 其他资源

* [Office 开发人员中心](http://dev.office.com/)
* [Microsoft Graph API](http://graph.microsoft.io)
* [Angular Office 365 Profile 示例](https://github.com/OfficeDev/O365-Angular-Profile)
* [Office UI 结构](http://dev.office.com/fabric)

## 版权
版权所有 (c) 2016 Microsoft。保留所有权利。


