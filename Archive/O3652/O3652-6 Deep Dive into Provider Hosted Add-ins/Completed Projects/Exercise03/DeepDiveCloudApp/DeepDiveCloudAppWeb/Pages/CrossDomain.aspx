<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CrossDomain.aspx.cs" Inherits="DeepDiveCloudAppWeb.Pages.CrossDomain" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Cross Domain Library</title>
    <script src="../Scripts/jquery-1.9.1.js"></script>
    <script src="../Scripts/app.js"></script>
    <script src="../Scripts/crossdomain.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <div id="chrome_ctrl_placeholder"></div>
        <div>
            <ul id="termList"></ul>
        </div>
    </form>
</body>
</html>
