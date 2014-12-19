<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ServerSideCSOMWeb.Pages.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
  <title>Server-side CSOM Demo</title>
  <link href="../Content/themes/cupertino/jquery-ui.css" rel="stylesheet" />
  <script src="../Scripts/jquery-2.0.3.js"></script>
  <script src="../Scripts/jquery-ui-1.10.3.js"></script>
  <link href="../Content/App.css" rel="stylesheet" />
  <script src="../Scripts/App.js"></script>
</head>
<body>
  <form id="form1" runat="server">

    <div id="page_width">

      <div id="nav_bar">
        <asp:HyperLink ID="linkHostWeb" runat="server">Host Web</asp:HyperLink>
      </div>

      <div id="top_banner">
        <div id="site_logo">&nbsp;</div>
        <div id="site_title">Server-side CSOM Demo</div>
      </div>

      <div id="toolbar">
        <asp:Button ID="cmdHelloCSOM" runat="server" Text="Hello CSOM" OnClick="cmdHelloCSOM_Click" />
        <asp:Button ID="cmdGetLists" runat="server" Text="Get Lists 1" OnClick="cmdGetLists_Click" />
        <asp:Button ID="cmdGetLists2" runat="server" Text="Get Lists 2" OnClick="cmdGetLists2_Click" />
        <asp:Button ID="cmdCreateLists" runat="server" Text="Create Lists" OnClick="cmdCreateLists_Click" />
      </div>

      <div id="content_box">
        <asp:PlaceHolder ID="PlaceHolderMain" runat="server"></asp:PlaceHolder>
      </div>

    </div>

  </form>
</body>
</html>
