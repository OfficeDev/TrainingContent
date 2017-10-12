# Пример приложения Angular, подключающегося к Office 365 и использующего Microsoft Graph

Подключение к Office 365 — это первый шаг, который должно выполнить каждое приложение, чтобы начать работу со службами и данными Office 365. В этом примере показано, как подключить и вызвать API Microsoft Graph (прежнее название — единый API Office 365), а также использовать платформу Office UI Fabric для работы с Office 365.

> Примечание. Перейдите на страницу [Начало работы с API Office 365](http://dev.office.com/getting-started/office365apis?platform=option-angular#setup) для упрощенной регистрации, чтобы ускорить запуск этого примера.

![Снимок экрана приложения Angular Connect для Office 365](../README assets/screenshot.png)

## Необходимые условия

Чтобы использовать пример приложения Angular, подключающегося к Office 365, требуются следующие компоненты:
* [Node.js](https://nodejs.org/). Платформа Node необходима для установки зависимостей и запуска примера на сервере разработки. 
* Учетная запись Office 365. Вы можете [подписаться на план Office 365 для разработчиков](https://aka.ms/devprogramsignup), включающий ресурсы, которые необходимы для создания приложений Office 365.

     > Примечание. Если у вас уже есть подписка, при выборе приведенной выше ссылки откроется страница с сообщением *К сожалению, вы не можете добавить это к своей учетной записи*. В этом случае используйте учетную запись, сопоставленную с текущей подпиской на Office 365.
* Клиент Microsoft Azure для регистрации приложения. В Azure Active Directory (AD) доступны службы идентификации, которые приложения используют для проверки подлинности и авторизации. Здесь можно получить пробную подписку: [Microsoft Azure](https://account.windowsazure.com/SignUp).

     > Важно! Убедитесь, что ваша подписка на Azure привязана к клиенту Office 365. Для этого просмотрите запись в блоге команды Active Directory, посвященную [созданию нескольких каталогов Microsoft Azure AD и управлению ими](http://blogs.technet.com/b/ad/archive/2013/11/08/creating-and-managing-multiple-windows-azure-active-directories.aspx). Инструкции приведены в разделе о **добавлении нового каталога**. Дополнительные сведения см. в статье [Как настроить среду разработки для Office 365](https://msdn.microsoft.com/office/office365/howto/setup-development-environment#bk_CreateAzureSubscription) и, в частности, в разделе **Связывание Azure AD и учетной записи Office 365 для создания приложений и управления ими**.
* Идентификатор клиента для приложения, зарегистрированного в Azure. Этому примеру приложения необходимо предоставить разрешения **Отправка почты от имени вошедшего пользователя** и **Отправка почты от имени вошедшего пользователя** для приложения, использующего **Microsoft Graph**. [Добавьте приложение в Azure](https://msdn.microsoft.com/office/office365/HowTo/add-common-consent-manually#bk_RegisterWebApp) и [предоставьте ему необходимые разрешения](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/wiki/Grant-permissions-to-the-Connect-application-in-Azure).

     > Примечание. При регистрации приложения укажите **http://127.0.0.1:8080/** как значение параметра **URL-адрес входа**.

## Настройка и запуск приложения

1. С помощью используемого интерфейса IDE откройте файл **config.js** в папке *public/scripts*.
2. Замените *ENTER_YOUR_CLIENT_ID* на идентификатор клиента для зарегистрированного в Azure приложения.
3. Установите зависимости проекта с помощью диспетчера пакетов Node (npm), выполнив команду ```npm install``` для корневого каталога проекта в командной строке.
4. Запустите сервер разработки, выполнив команду ```node server.js``` для корневого каталога проекта.
5. Введите адрес ```http://127.0.0.1:8080/``` в веб-браузере.

Дополнительные сведения о примере см. в [пошаговых инструкциях касательно Angular на сайте graph.microsoft.io](http://graph.microsoft.io/docs/platform/angular). 

## Вопросы и комментарии

Мы будем рады получить от вас отзывы о примере приложения Angular, подключающегося к Office 365. Вы можете отправлять нам вопросы и предложения в разделе [Issues](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/issues) этого репозитория.

Ваш отзыв важен для нас. Для связи с нами используйте сайт [Stack Overflow](http://stackoverflow.com/questions/tagged/office365+or+microsoftgraph). Помечайте свои вопросы тегами [MicrosoftGraph] и [office365].
  
## Дополнительные ресурсы

* [Центр разработки для Office](http://dev.office.com/)
* [API Microsoft Graph](http://graph.microsoft.io)
* [Пример профиля Office 365 для Angular](https://github.com/OfficeDev/O365-Angular-Profile)
* [Office UI Fabric](http://dev.office.com/fabric)

## Авторское право
(c) Корпорация Майкрософт (Microsoft Corporation), 2016. Все права защищены.


