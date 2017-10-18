# Ejemplo Connect de Angular para Office 365 con Microsoft Graph

Conectarse a Office 365 es el primer paso que debe realizar cada aplicación para empezar a trabajar con los datos y servicios de Office 365. Este ejemplo muestra cómo conectar y cómo llamar después a la API de Microsoft Graph (anteriormente denominada API unificada de Office 365), y usa la interfaz de usuario Fabric de Office para crear una experiencia de Office 365.

> Nota: Consulte la página [Introducción a las API de Office 365](http://dev.office.com/getting-started/office365apis?platform=option-angular#setup), que simplifica el registro para que este ejemplo se ejecute más rápidamente.

[Captura de pantalla de ejemplo Connect de Angular de Office 365](../README assets/screenshot.png)

## Requisitos previos

Para usar el ejemplo Connect de Angular para Office 365, necesita lo siguiente:
* [Node.js](https://nodejs.org/). Node es necesario para ejecutar el ejemplo en un servidor de desarrollo y para instalar las dependencias. 
* Una cuenta de Office 365. Puede registrarse para obtener [una suscripción a Office 365 Developer](https://aka.ms/devprogramsignup) que incluye los recursos que necesita para empezar a compilar aplicaciones de Office 365.

     > Nota: Si ya dispone de una suscripción, el vínculo anterior le dirige a una página con el mensaje *No se puede agregar a su cuenta actual*. En ese caso, use una cuenta de su suscripción actual de Office 365.
* Un inquilino de Microsoft Azure para registrar la aplicación. Azure Active Directory (AD) proporciona servicios de identidad que las aplicaciones usan para autenticación y autorización. Puede adquirir una suscripción de prueba aquí: [Microsoft Azure](https://account.windowsazure.com/SignUp).

     > Importante: También necesita asegurarse de que su suscripción de Azure está enlazada a su inquilino de Office 365. Para ello, consulte la publicación del blog del equipo de Active Directory, [Crear y administrar varios directorios de Windows Azure Active Directory](http://blogs.technet.com/b/ad/archive/2013/11/08/creating-and-managing-multiple-windows-azure-active-directories.aspx). La sección **Agregar un nuevo directorio** le explicará cómo hacerlo. Para obtener más información, también puede consultar [Configurar el entorno de desarrollo de Office 365](https://msdn.microsoft.com/office/office365/howto/setup-development-environment#bk_CreateAzureSubscription) y la sección **Asociar su cuenta de Office 365 con Azure AD para crear y administrar aplicaciones**.
* Un identificador de cliente de una aplicación registrada en Azure. A esta aplicación de ejemplo se le debe conceder el permiso **Enviar correo como usuario con sesión iniciada** para la aplicación **Microsoft Graph**. [Agregar una aplicación web en Azure](https://msdn.microsoft.com/office/office365/HowTo/add-common-consent-manually#bk_RegisterWebApp) y [concederle los permisos adecuados](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/wiki/Grant-permissions-to-the-Connect-application-in-Azure).

     > Nota: Durante el proceso de registro de la aplicación, asegúrese de especificar **http://127.0.0.1:8080/** como la **dirección URL de inicio de sesión**.

## Configurar y ejecutar la aplicación

1. Con su IDE favorito, abra **config.js** en *public/scripts*.
2. Reemplace *ENTER_YOUR_CLIENT_ID* por el identificador de cliente de la aplicación registrada en Azure.
3. Instale las dependencias del proyecto con el administrador de paquetes de Node (npm) ejecutando ```npm install``` en el directorio raíz del proyecto, en la línea de comandos.
4. Inicie el servidor de desarrollo mediante la ejecución de ```node server.js``` en el directorio raíz del proyecto.
5. Vaya a ```http://127.0.0.1:8080/``` en el explorador web.

Para obtener más información sobre el ejemplo, consulte el [Tutorial de Angular en graph.microsoft.io](http://graph.microsoft.io/docs/platform/angular). 

## Preguntas y comentarios

Nos encantaría recibir sus comentarios acerca del ejemplo Connect de Angular para Office 365. Puede enviarnos sus preguntas y sugerencias a través de la sección [Problemas](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/issues) de este repositorio.

Su opinión es importante para nosotros. Conecte con nosotros en [Stack Overflow](http://stackoverflow.com/questions/tagged/office365+or+microsoftgraph). Etiquete sus preguntas con [MicrosoftGraph] y [office365].
  
## Recursos adicionales

* [Centro para desarrolladores de Office](http://dev.office.com/)
* [API de Microsoft Graph](http://graph.microsoft.io)
* [Ejemplo de perfil de Office 365 para Angular](https://github.com/OfficeDev/O365-Angular-Profile)
* [Office UI Fabric](http://dev.office.com/fabric)

## Copyright
Copyright (c) 2016 Microsoft. Todos los derechos reservados.


