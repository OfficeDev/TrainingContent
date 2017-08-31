# Microsoft Graph を使った Office 365 Angular Connect サンプル

各アプリで Office 365 のサービスとデータの操作を開始するため、最初に Office 365 に接続する必要があります。このサンプルでは、Microsoft Graph API (以前は Office 365 統合 API と呼ばれていた) に接続してから呼び出す方法を示し、Office Fabric UI を使って Office 365 エクスペリエンスを作成します。

> 注:このサンプルをより迅速に実行するため、「[Office 365 API を使う](http://dev.office.com/getting-started/office365apis?platform=option-angular#setup)」ページに記載された登録の簡略化をお試しください。

[Office 365 Angular Connect サンプルのスクリーンショット](../README assets/screenshot.png)

## 前提条件

Office 365 Angular Connect サンプルを使うには、次のものが必要です:
* [Node.js](https://nodejs.org/)。Node は、開発サーバーでサンプルを実行して、依存関係をインストールするために必要です。 
* Office 365 アカウント。[Office 365 Developer](https://aka.ms/devprogramsignup) サブスクリプションにサイン アップすることができます。ここには、Office 365 アプリのビルドを開始するために必要なリソースが含まれています。

     > 注: サブスクリプションが既に存在する場合、上記のリンクをクリックすると、*申し訳ありません、現在のアカウントに追加できません* と表示されたページに移動します。その場合は、現在使用している Office 365 サブスクリプションのアカウントをご利用いただけます。
* アプリケーションを登録する Microsoft Azure テナント。Azure Active Directory (AD) は、アプリケーションが認証と承認に使用する ID サービスを提供します。試用版サブスクリプションは、[Microsoft Azure](https://account.windowsazure.com/SignUp) で取得できます。

     > 重要事項: Azure サブスクリプションが Office 365 テナントにバインドされていることを確認する必要があります。確認するには、Active Directory チームのブログ投稿「[複数の Windows Azure Active Directory を作成および管理する](http://blogs.technet.com/b/ad/archive/2013/11/08/creating-and-managing-multiple-windows-azure-active-directories.aspx)」を参照してください。「**新しいディレクトリを追加する**」セクションで、この方法について説明しています。また、詳細については、「[Office 365 開発環境をセットアップする](https://msdn.microsoft.com/office/office365/howto/setup-development-environment#bk_CreateAzureSubscription)」や「**Office 365 アカウントを Azure AD と関連付けてアプリを作成および管理する**」セクションも参照してください。
* Azure に登録されたアプリケーションのクライアント ID。このサンプル アプリケーションには、**サインインしているユーザーとしてメールを送信する**アクセス許可と、**Microsoft Graph** アプリケーションの**サインインしているユーザーとしてメールを送信する**アクセス許可を付与する必要があります。[Azure に Web アプリケーションを追加](https://msdn.microsoft.com/office/office365/HowTo/add-common-consent-manually#bk_RegisterWebApp)し、[適切なアクセス許可を付与](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/wiki/Grant-permissions-to-the-Connect-application-in-Azure)します。

     > 注:アプリ登録プロセス時に、**サインオン URL** として **http://127.0.0.1:8080/** を必ず指定します。

## アプリの構成と実行

1. 任意の IDE を使って、*パブリック/スクリプト* で **config.js** を開きます。
2. *ENTER_YOUR_CLIENT_ID* を登録済みの Azure アプリケーションのクライアント ID と置き換えます。
3. コマンド ライン上のプロジェクトのルート ディレクトリで ```npm install``` を実行して、ノードのパッケージ マネージャー (npm) でプロジェクトの依存関係をインストールします。
4. プロジェクトのルート ディレクトリで ```node server.js``` を実行して、開発サーバーを起動します。
5. Web ブラウザーで ```http://127.0.0.1:8080/``` に移動します。

サンプルについて詳しくは、「[graph.microsoft.io の Angular に関するチュートリアル](http://graph.microsoft.io/docs/platform/angular)」をご覧ください。 

## 質問とコメント

Office 365 Angular Connect サンプルについて、Microsoft にフィードバックをお寄せください。質問や提案につきましては、このリポジトリの「[問題](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/issues)」セクションに送信できます。

お客様からのフィードバックを重視しています。[スタック・オーバーフロー](http://stackoverflow.com/questions/tagged/office365+or+microsoftgraph)でご連絡いただけます。質問には [MicrosoftGraph] と [office365] でタグ付けしてください。
  
## その他の技術情報

* [Office デベロッパー センター](http://dev.office.com/)
* [Microsoft Graph API](http://graph.microsoft.io)
* [Angular 用 Office 365 プロファイル サンプル](https://github.com/OfficeDev/O365-Angular-Profile)
* [Office の UI ファブリック](http://dev.office.com/fabric)

## 著作権
Copyright (c) 2016 Microsoft. All rights reserved.


