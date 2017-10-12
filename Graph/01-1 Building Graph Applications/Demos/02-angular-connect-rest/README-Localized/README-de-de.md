# Office 365 Angular Connect-Beispiel unter Verwendung von Microsoft Graph

Für die Arbeit mit Office 365-Diensten und -Daten muss jede App zunächst eine Verbindung zu Office 365 herstellen. In diesem Beispiel wird gezeigt, wie die Verbindung zu und dann der Aufruf der Microsoft Graph-API (wurde zuvor als vereinheitlichte Office 365-API bezeichnet) erfolgt. Ferner wird darin die Office Fabric-Benutzeroberfläche zum Erstellen einer Office 365-Erfahrung verwendet.

> Hinweis: Rufen Sie die Seite [Erste Schritte mit Office 365-APIs](http://dev.office.com/getting-started/office365apis?platform=option-angular#setup) auf. Auf dieser wird die Registrierung vereinfacht, damit Sie dieses Beispiel schneller ausführen können.

![Screenshot des Office 365 Angular Connect-Beispiels](../README assets/screenshot.png)

## Voraussetzungen

Zum Verwenden des Office 365 Angular Connect-Beispiels benötigen Sie Folgendes:
* [Node.js](https://nodejs.org/). Node ist für das Ausführen des Beispiels auf einem Entwicklungsserver und für das Installieren der Abhängigkeiten erforderlich. 
* Ein Office 365-Konto. Sie können sich für ein [Office 365-Entwicklerabonnement](https://aka.ms/devprogramsignup) registrieren, das alle Ressourcen umfasst, die Sie zum Einstieg in die Entwicklung von Office 365-Apps benötigen.

     > Hinweis: Wenn Sie bereits über ein Abonnement verfügen, gelangen Sie über den vorherigen Link zu einer Seite mit der Meldung „Leider können Sie Ihrem aktuellen Konto diesen Inhalt nicht hinzufügen“. Verwenden Sie in diesem Fall ein Konto aus Ihrem aktuellen Office 365-Abonnement.
* Ein Microsoft Azure-Mandant zum Registrieren Ihrer Anwendung. Von Azure Active Directory (AD) werden Identitätsdienste bereitgestellt, die durch Anwendungen für die Authentifizierung und Autorisierung verwendet werden. Hier kann ein Testabonnement erworben werden: [Microsoft Azure](https://account.windowsazure.com/SignUp)

     > Wichtig: Sie müssen zudem sicherstellen, dass Ihr Azure-Abonnement an Ihren Office 365-Mandanten gebunden ist. Rufen Sie dafür den Blogpost [Creating and Managing Multiple Windows Azure Active Directories](http://blogs.technet.com/b/ad/archive/2013/11/08/creating-and-managing-multiple-windows-azure-active-directories.aspx) des Active Directory-Teams auf. Im Abschnitt **Adding a new directory** finden Sie Informationen über die entsprechende Vorgehensweise. Weitere Informationen finden Sie zudem unter [Einrichten Ihrer Office 365-Entwicklungsumgebung](https://msdn.microsoft.com/office/office365/howto/setup-development-environment#bk_CreateAzureSubscription) im Abschnitt **Verknüpfen Ihres Office 365-Kontos mit Azure AD zum Erstellen und Verwalten von Apps**.
* Eine Client-ID einer in Azure registrierten Anwendung. Dieser Beispielanwendung müssen die Berechtigungen **Senden von E-Mails als angemeldeter Benutzer** und **Senden von E-Mails als angemeldeter Benutzer** für die **Microsoft Graph**-Anwendung gewährt werden. [Fügen Sie eine Webanwendung in Azure hinzu](https://msdn.microsoft.com/office/office365/HowTo/add-common-consent-manually#bk_RegisterWebApp), und [gewähren Sie ihr die entsprechenden Berechtigungen](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/wiki/Grant-permissions-to-the-Connect-application-in-Azure).

     > Hinweis: Stellen Sie während des App-Registrierungsvorgangs sicher, dass Sie **http://127.0.0.1:8080/** als die **Anmelde-URL** angeben.

## Konfigurieren und Ausführen der App

1. Öffnen Sie unter Verwendung Ihrer bevorzugten IDE die Datei **config.js** in „public/scripts“.
2. Ersetzen Sie *IHRE_CLIENT_ID_EINGEBEN* durch die Client-ID Ihrer registrierten Azure-Anwendung.
3. Installieren Sie Projektabhängigkeiten mithilfe des Paket-Managers von Node (npm), indem Sie ```npm install``` im Stammverzeichnis des Projekts an der Befehlszeile ausführen.
4. Starten Sie den Entwicklungsserver, indem Sie ```node server.js``` im Stammverzeichnis des Projekts ausführen.
5. Navigieren Sie zu ```http://127.0.0.1:8080/``` im Webbrowser.

Weitere Informationen über das Beispiel finden Sie unter [Vorgehensweisen für Angular unter graph.microsoft.io.](http://graph.microsoft.io/docs/platform/angular). 

## Fragen und Kommentare

Wir schätzen Ihr Feedback hinsichtlich des Office 365 Angular Connect-Beispiels. Sie können uns Ihre Fragen und Vorschläge über den Abschnitt [Probleme](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/issues) dieses Repositorys senden.

Ihr Feedback ist uns wichtig. Nehmen Sie unter [Stack Overflow](http://stackoverflow.com/questions/tagged/office365+or+microsoftgraph) Kontakt mit uns auf. Taggen Sie Ihre Fragen mit [MicrosoftGraph] und [office365].
  
## Zusätzliche Ressourcen

* [Office Dev Center](http://dev.office.com/)
* [Microsoft Graph-API](http://graph.microsoft.io)
* [Office 365 Profile-Beispiel für Angular](https://github.com/OfficeDev/O365-Angular-Profile)
* [Office-Benutzeroberfläche Fabric](http://dev.office.com/fabric)

## Copyright
Copyright (c) 2016 Microsoft. Alle Rechte vorbehalten.


