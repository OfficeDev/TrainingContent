<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="HostWebEventsWeb.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Remote event receivers</title>
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.js"></script>
    <script type="text/javascript" src="../Scripts/app.js"></script>
</head>
<body style="display: none; overflow: auto;">
    <form id="form1" runat="server">
        <div>
            <asp:ScriptManager ID="ScriptManager1" runat="server" EnableCdn="True" />
            <div id="divSPChrome"></div>
        </div>
        <div style="left: 40px; position: absolute;">
            <h1>Attach an event receiver</h1>
            <br />
            As part of the installation of this app a list has been created in the host web if it was not yet available and an event receiver was attached that processes the itemAdded event. To test this functionality go back to the host web and add an item to the list named "Remote Event Receiver Lab". The itemadded event receiver will intercept this add and update the item.
            <br />
            <br />
            <h1>Detach the event receiver</h1>
            <br />
            Detaches the event receiver of the list in the host web. Note that detaching will result in a permission denied error. This occurs only while side-loading the app, which is what Visual Studio does when you deploy using F5. To see this work, you will need to install the app via an App Catalog or the Marketplace.
            <br />
            <asp:Button runat="server" ID="btnDetachEventHandler" Text="Detach event receiver" OnClick="btnDetachEventHandler_Click" />
        </div>
    </form>
</body>
</html>
