# Exemple de connexion d’Angular à Office 365 à l’aide de Microsoft Graph

La connexion à Office 365 est la première étape que chaque application doit suivre pour commencer à travailler avec les données et services Office 365. Cet exemple explique comment connecter, puis appeler l’API Microsoft Graph (anciennement appelée API unifiée Office 365). Il utilise la structure d’interface utilisateur d’Office pour créer une expérience Office 365.

> Remarque : Consultez la page relative à la [prise en main des API Office 365](http://dev.office.com/getting-started/office365apis?platform=option-angular#setup) pour enregistrer plus facilement votre application et exécuter plus rapidement cet exemple.

[Capture d’écran d’un exemple de connexion d’une application Angular à Office 365](../README assets/screenshot.png)

## Conditions requises

Pour utiliser l’exemple de connexion d’Angular à Office 365, vous devez disposer des éléments suivants :
* [Node.js](https://nodejs.org/). Node est requis pour exécuter l’exemple sur un serveur de développement et installer des dépendances. 
* Un compte Office 365. Vous pouvez souscrire à [un abonnement Office 365 Développeur](https://aka.ms/devprogramsignup) comprenant les ressources dont vous avez besoin pour commencer à créer des applications Office 365.

     > Remarque : si vous avez déjà un abonnement, le lien précédent vous renvoie vers une page avec le message suivant : « Désolé, vous ne pouvez pas ajouter ceci à votre compte existant ». Dans ce cas, utilisez un compte lié à votre abonnement Office 365 existant.
* Un client Microsoft Azure pour enregistrer votre application. Azure Active Directory (AD) fournit des services d’identité que les applications utilisent à des fins d’authentification et d’autorisation. Un abonnement d’évaluation peut être demandé ici : [Microsoft Azure](https://account.windowsazure.com/SignUp).

     > Important : vous devez également vous assurer que votre abonnement Azure est lié à votre client Office 365. Pour cela, consultez le billet du blog de l’équipe d’Active Directory relatif à la [création et la gestion de plusieurs fenêtres dans les répertoires Azure Active Directory](http://blogs.technet.com/b/ad/archive/2013/11/08/creating-and-managing-multiple-windows-azure-active-directories.aspx). La section sur l’**ajout d’un nouveau répertoire** vous explique comment procéder. Pour en savoir plus, vous pouvez également consulter la rubrique relative à la [configuration de votre environnement de développement Office 365](https://msdn.microsoft.com/office/office365/howto/setup-development-environment#bk_CreateAzureSubscription) et la section sur l’**association de votre compte Office 365 à Azure Active Directory pour créer et gérer des applications**.
* Un ID client d’une application enregistrée dans Azure. Cet exemple d’application doit obtenir l’autorisation **Envoyer du courrier en tant qu’utilisateur connecté** pour l’application **Microsoft Graph**. [Ajoutez une application web dans Azure](https://msdn.microsoft.com/office/office365/HowTo/add-common-consent-manually#bk_RegisterWebApp) et [accordez-lui les autorisations appropriées](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/wiki/Grant-permissions-to-the-Connect-application-in-Azure).

     > Remarque : pendant l’enregistrement de l’application, veillez à indiquer **http://127.0.0.1:8080/** comme **URL d’authentification**.

## Configuration et exécution de l’application

1. À l’aide de votre IDE favori, ouvrez **config.js** dans public/scripts.
2. Remplacez *ENTER_YOUR_CLIENT_ID* par l’ID client de votre application Azure inscrite.
3. Installez les dépendances du projet avec le gestionnaire de package de Node (npm) en exécutant ```npm install``` dans le répertoire racine du projet dans la ligne de commande.
4. Démarrez le serveur de développement en exécutant ```node server.js``` dans le répertoire racine du projet.
5. Accédez à ```http://127.0.0.1:8080/``` dans votre navigateur web.

Pour en savoir plus sur cet exemple, consultez la [procédure pas à pas de l’exécution de l’application Angular sur graph.microsoft.io.](http://graph.microsoft.io/docs/platform/angular). 

## Questions et commentaires

Nous serions ravis de connaître votre opinion sur l’exemple de connexion d’Angular à Office 365. Vous pouvez nous faire part de vos questions et suggestions dans la rubrique [Problèmes](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/issues) de ce référentiel.

Votre avis compte beaucoup pour nous. Communiquez avec nous sur [Stack Overflow](http://stackoverflow.com/questions/tagged/office365+or+microsoftgraph). Posez vos questions avec les tags [MicrosoftGraph] et [Office 365].
  
## Ressources supplémentaires

* [Centre de développement Office](http://dev.office.com/)
* [API Microsoft Graph](http://graph.microsoft.io)
* [Exemple de profil Office 365 pour Angular](https://github.com/OfficeDev/O365-Angular-Profile)
* [Structure de l’interface utilisateur Office](http://dev.office.com/fabric)

## Copyright
Copyright (c) 2016 Microsoft. Tous droits réservés.


