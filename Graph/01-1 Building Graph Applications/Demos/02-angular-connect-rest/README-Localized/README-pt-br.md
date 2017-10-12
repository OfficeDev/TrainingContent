# Exemplo de conexão com o Office 365 para Angular usando o Microsoft Graph

A primeira etapa para que os aplicativos comecem a funcionar com dados e serviços do Office 365 é estabelecer uma conexão com essa plataforma. Este exemplo mostra como conectar e chamar a API do Microsoft Graph (antiga API unificada do Office 365) e usa o Office Fabric UI para criar uma experiência do Office 365.

> Observação: Experimente a página [Introdução às APIs do Office 365](http://dev.office.com/getting-started/office365apis?platform=option-angular#setup), que simplifica o registro para que você possa executar esse exemplo com mais rapidez.

![Captura de tela do exemplo do Office 365 para Angular](../README assets/screenshot.png)

## Pré-requisitos

Para usar o exemplo de conexão com o Office 365 para Angular, é necessário o seguinte:
* [Node.js](https://nodejs.org/). O nó é necessário para executar o exemplo em um servidor de desenvolvimento e para instalar as dependências. 
* Uma conta do Office 365. Você pode se inscrever para [uma assinatura do Office 365 Developer](https://aka.ms/devprogramsignup), que inclui os recursos de que você precisa para começar a criar aplicativos do Office 365.

     > Observação: Caso já tenha uma assinatura, o link anterior direciona você para uma página com a mensagem *Não é possível adicioná-la à sua conta atual*. Nesse caso, use uma conta de sua assinatura atual do Office 365.
* Um locatário do Microsoft Azure para registrar o seu aplicativo. O Active Directory (AD) do Azure fornece serviços de identidade que os aplicativos usam para autenticação e autorização. Você pode adquirir uma assinatura de avaliação aqui: [Microsoft Azure](https://account.windowsazure.com/SignUp).

     > Importante: Você também deve assegurar que a sua assinatura do Azure esteja vinculada ao seu locatário do Office 365. Para saber como fazer isso, confira a postagem de blog da equipe do Active Directory: [Criar e gerenciar vários Microsoft Azure Active Directory](http://blogs.technet.com/b/ad/archive/2013/11/08/creating-and-managing-multiple-windows-azure-active-directories.aspx). A seção **Adicionar um novo diretório** explica como fazer isso. Para saber mais, confira o artigo [Configurar o seu ambiente de desenvolvimento do Office 365](https://msdn.microsoft.com/office/office365/howto/setup-development-environment#bk_CreateAzureSubscription) e a seção **Associar a sua conta do Office 365 ao Azure AD para criar e gerenciar aplicativos**.
* Uma ID do cliente de um aplicativo registrado no Microsoft Azure. Este exemplo de aplicativo deve ter permissão para **Enviar email como usuário conectado** e **Enviar email como usuário conectado** para o aplicativo **Microsoft Graph**. Para isso, [adicione um aplicativo Web no Microsoft Azure](https://msdn.microsoft.com/office/office365/HowTo/add-common-consent-manually#bk_RegisterWebApp) e [conceda as permissões adequadas](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/wiki/Grant-permissions-to-the-Connect-application-in-Azure).

     > Observação: Durante o processo de registro do aplicativo, não deixe de especificar **http://127.0.0.1:8080/** como **URL de Entrada**.

## Configurar e executar o aplicativo

1. Abra **config.js** em *public/scripts* usando o seu IDE favorito.
2. Substitua *ENTER_YOUR_CLIENT_ID* pela ID do cliente do aplicativo Azure registrado.
3. Instale as dependências do projeto com o NPM (Gerenciador de Pacotes de Nós) executando ```npm install``` no diretório raiz do projeto, na linha de comando.
4. Inicie o servidor de desenvolvimento executando ```node server.js``` no diretório raiz do projeto.
5. Acesse ```http://127.0.0.1:8080/``` no navegador da Web.

Para saber mais sobre o exemplo, confira a [explicação passo a passo sobre o Angular em graph.microsoft.io](http://graph.microsoft.io/docs/platform/angular). 

## Perguntas e comentários

Gostaríamos de saber a sua opinião sobre o exemplo de conexão com o Office 365 para Angular. Você pode enviar perguntas e sugestões na seção [Problemas](https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect/issues) deste repositório.

Os seus comentários são importantes para nós. Junte-se a nós na página do [Stack Overflow](http://stackoverflow.com/questions/tagged/office365+or+microsoftgraph). Marque as suas perguntas com [MicrosoftGraph] e [office365].
  
## Recursos adicionais

* [Centro de Desenvolvimento do Office](http://dev.office.com/)
* [API do Microsoft Graph](http://graph.microsoft.io)
* [Exemplo de perfil do Office 365 para Angular](https://github.com/OfficeDev/O365-Angular-Profile)
* [Office UI Fabric](http://dev.office.com/fabric)

## Direitos autorais
Copyright © 2016 Microsoft. Todos os direitos reservados.


