<%@ Page Language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<html lang="en">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9" >

    <title>Contacts</title>

    <link rel="Stylesheet" href="../Content/App.css" />

    <WebPartPages:AllowFraming runat="server" ID="AllowFraming1" />
    <script type="text/javascript" src="../Scripts/jquery-1.6.2.min.js"></script>
    <script type="text/javascript" src="../Scripts/knockout-2.1.0.js"></script>
    <script type="text/javascript" src="../Scripts/WelcomeViewModel.js"></script>
    <script type="text/javascript" src="../Scripts/App.js"></script>

</head>
<body>
    <div>
        <article>
            <div id="portrait" style="text-align:center;">
                <figure>
                    <img src="#" data-bind="attr: { src: get_pictureUrl() }" alt="photo" />
                </figure>
            </div>
            <div style="text-align:center;">
                <figcaption>
                    Welcome <span data-bind="text: get_displayName()"></span>
                </figcaption>
            </div>
        </article>
    </div>
</body>
</html>
