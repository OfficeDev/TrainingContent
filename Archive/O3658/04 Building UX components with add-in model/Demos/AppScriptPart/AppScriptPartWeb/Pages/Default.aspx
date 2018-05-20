﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="AppScriptPartWeb.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>App Script Part Usage</title>
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.js"></script>
    <script type="text/javascript" src="../Scripts/app.js"></script>
</head>
<body style="display: none; overflow: auto;">
    <form id="form1" runat="server">
 <asp:ScriptManager ID="ScriptManager1" runat="server" EnableCdn="True" />
    <div id="divSPChrome"></div>
    <div style="left: 40px; position: absolute;">
        <h1>Scenario: Add script app part to host web</h1>
        In this scenario you'll learn how to inject app script part to host web, which still uses scripts and processes from the provider hosted app without app parts.
        <ul style="list-style-type: square;">
            <li>How to create app script part which is referencing scripts from provider hosted app</li>
            <li>How to deploy app script web part to be available for use from web part gallery</li>
        </ul>
        <br />
        <i>Notice that technically you could also upload the needed script(s) to the host web from the provider hosted app or during provisioning and reference scripts from there.</i>
        <br />
        <br />       
        <asp:Button runat="server" ID="btnScenario" Text="Add App Script Part" OnClick="btnScenario_Click" />
        <br />
        <br /> 
        <asp:Label ID="lblStatus" runat="server" />
        <br />
        <br />
    </div>
    </form>
</body>
</html>
